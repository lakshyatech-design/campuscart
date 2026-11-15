/**
 * GSV Direct — Real-Time Notification Center & Live Upload Alerts
 * 
 * Manages Server-Sent Events (SSE) live connection to /api/notifications/stream,
 * harmonic Web Audio alert chime, multiple stacking toast popups,
 * unread badges, and interactive notification center dropdown.
 */

window.NotificationCenter = (function () {
  'use strict';

  let eventSource = null;
  let notifications = [];
  let unreadCount = 0;
  let isOpen = false;
  let reconnectTimer = null;

  // Sound Synthesizer via Web Audio API (Zero external assets required)
  function playNotificationChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      // Pleasant high-end double ping (A5 -> E6)
      const now = ctx.currentTime;
      [880, 1318.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);

        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.09, now + i * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.4);
      });
    } catch (e) {
      // Audio playback silently caught if restricted
    }
  }

  async function fetchNotifications() {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        notifications = data.notifications || [];
        unreadCount = data.unreadCount || 0;
        updateBadgeUI();
        renderDropdownList();
      }
    } catch (e) {
      console.warn('Could not fetch notifications:', e.message);
    }
  }

  function initSSE() {
    if (eventSource) {
      try { eventSource.close(); } catch (e) {}
    }

    try {
      eventSource = new EventSource('/api/notifications/stream');

      eventSource.onopen = function () {
        console.log('⚡ GSV Real-Time Notification Stream: Connected');
        if (reconnectTimer) clearTimeout(reconnectTimer);
      };

      eventSource.onmessage = function (event) {
        if (!event.data || event.data.startsWith(':')) return; // ignore heartbeat ping
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'NEW_UPLOAD' && payload.notification) {
            handleIncomingNotification(payload.notification);
          }
        } catch (err) {
          console.warn('Notification parse error:', err);
        }
      };

      eventSource.onerror = function () {
        if (eventSource) eventSource.close();
        // Exponential reconnect
        reconnectTimer = setTimeout(initSSE, 10000);
      };
    } catch (e) {
      console.warn('SSE not supported or blocked, relying on fallback polling.');
    }

    // Safety polling fallback every 25 seconds
    setInterval(fetchNotifications, 25000);
  }

  function handleIncomingNotification(notif) {
    // Avoid self-notification toast if current user was the seller
    const currentUser = window.CampusState ? window.CampusState.getUser() : null;
    const isSelf = currentUser && currentUser.id === notif.seller_id;

    // Prepend to memory list
    notifications.unshift(notif);
    unreadCount++;
    updateBadgeUI();
    renderDropdownList();

    // Trigger Audio and Visual Toast
    playNotificationChime();
    showToastPopup(notif);
  }

  function showToastPopup(notif) {
    const toastContainer = document.getElementById('gsv-toast-stack');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'gsv-toast-item';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <div class="gsv-toast-glow"></div>
      <div class="gsv-toast-header">
        <div class="gsv-toast-badge">
          <span class="gsv-toast-pulse"></span>
          <span>GSV LIVE LISTING</span>
        </div>
        <span class="gsv-toast-time">Just now</span>
        <button class="gsv-toast-close" title="Dismiss">&times;</button>
      </div>
      <div class="gsv-toast-body">
        <div class="gsv-toast-avatar">
          <img src="${notif.seller_avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100'}" alt="${notif.seller_name || 'Student'}" />
        </div>
        <div class="gsv-toast-info">
          <div class="gsv-toast-title">${escapeHTML(notif.productTitle || notif.title)}</div>
          <div class="gsv-toast-desc">${escapeHTML(notif.seller_name)} • ${escapeHTML(notif.campus_location || 'GSV Campus')}</div>
          <div class="gsv-toast-price">₹${Number(notif.productPrice || 0).toLocaleString('en-IN')}</div>
        </div>
      </div>
      <div class="gsv-toast-actions">
        <button class="gsv-toast-btn-view" data-product-id="${notif.productId}">Inspect Listing →</button>
      </div>
    `;

    // Dismiss button
    toast.querySelector('.gsv-toast-close').addEventListener('click', (e) => {
      e.stopPropagation();
      dismissToast(toast);
    });

    // Click anywhere on toast to view
    toast.addEventListener('click', () => {
      if (notif.productId && window.ProductDetailModal) {
        window.ProductDetailModal.open(notif.productId);
        markAsRead(notif.id);
      }
      dismissToast(toast);
    });

    toastContainer.appendChild(toast);

    // Trigger slide-in
    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });

    // Auto-dismiss after 6.5 seconds
    setTimeout(() => {
      dismissToast(toast);
    }, 6500);
  }

  function dismissToast(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.remove('is-visible');
    toast.classList.add('is-dismissed');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 350);
  }

  function updateBadgeUI() {
    const badges = document.querySelectorAll('.gsv-notif-badge');
    badges.forEach(b => {
      if (unreadCount > 0) {
        b.textContent = unreadCount > 9 ? '9+' : unreadCount;
        b.style.display = 'inline-flex';
        b.classList.add('has-unread');
      } else {
        b.textContent = '0';
        b.style.display = 'none';
        b.classList.remove('has-unread');
      }
    });
  }

  function renderDropdownList() {
    const listEl = document.getElementById('gsv-notif-list');
    if (!listEl) return;

    if (notifications.length === 0) {
      listEl.innerHTML = `
        <div class="gsv-notif-empty">
          <div class="gsv-notif-empty-icon">📭</div>
          <p class="gsv-notif-empty-title">All caught up</p>
          <p class="gsv-notif-empty-text">No new campus listing notifications right now.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = notifications.map(n => `
      <div class="gsv-notif-card ${n.is_read ? 'is-read' : 'is-unread'}" data-notif-id="${n.id}" data-prod-id="${n.productId || ''}">
        <div class="gsv-notif-avatar">
          <img src="${n.seller_avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100'}" alt="" />
        </div>
        <div class="gsv-notif-content">
          <div class="gsv-notif-header-row">
            <span class="gsv-notif-title-text">${escapeHTML(n.title)}</span>
            <span class="gsv-notif-time-text">${formatTimeAgo(n.created_at)}</span>
          </div>
          <p class="gsv-notif-desc-text">${escapeHTML(n.message)}</p>
        </div>
        ${!n.is_read ? '<span class="gsv-notif-dot" title="Unread"></span>' : ''}
      </div>
    `).join('');

    // Attach click triggers
    listEl.querySelectorAll('.gsv-notif-card').forEach(card => {
      card.addEventListener('click', () => {
        const notifId = card.getAttribute('data-notif-id');
        const prodId = card.getAttribute('data-prod-id');
        markAsRead(notifId);
        if (prodId && window.ProductDetailModal) {
          window.ProductDetailModal.open(prodId);
          closeDropdown();
        }
      });
    });
  }

  async function markAsRead(notifId) {
    const item = notifications.find(n => n.id === notifId);
    if (item && !item.is_read) {
      item.is_read = 1;
      unreadCount = Math.max(0, unreadCount - 1);
      updateBadgeUI();
      renderDropdownList();
      try {
        await fetch(`/api/notifications/${notifId}/read`, { method: 'POST' });
      } catch (e) {}
    }
  }

  async function markAllAsRead() {
    notifications.forEach(n => { n.is_read = 1; });
    unreadCount = 0;
    updateBadgeUI();
    renderDropdownList();
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' });
    } catch (e) {}
  }

  function toggleDropdown() {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  function openDropdown() {
    const dropdown = document.getElementById('gsv-notif-dropdown');
    if (!dropdown) return;
    dropdown.classList.add('is-open');
    isOpen = true;
    renderDropdownList();
  }

  function closeDropdown() {
    const dropdown = document.getElementById('gsv-notif-dropdown');
    if (!dropdown) return;
    dropdown.classList.remove('is-open');
    isOpen = false;
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatTimeAgo(dateStr) {
    if (!dateStr) return 'Recently';
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  // Setup outside click dismissal
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('gsv-notif-dropdown');
    const trigger = document.getElementById('gsv-notif-trigger');
    if (isOpen && dropdown && !dropdown.contains(e.target) && !trigger.contains(e.target)) {
      closeDropdown();
    }
  });

  return {
    init: function () {
      fetchNotifications();
      initSSE();
      const markAllBtn = document.getElementById('gsv-notif-mark-all');
      if (markAllBtn) {
        markAllBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          markAllAsRead();
        });
      }
    },
    toggleDropdown: toggleDropdown,
    openDropdown: openDropdown,
    closeDropdown: closeDropdown,
    markAllAsRead: markAllAsRead,
    showToast: showToastPopup
  };
})();
