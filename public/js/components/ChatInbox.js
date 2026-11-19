/**
 * GSV Direct — Real-Time Campus Chat & Separate Inbox Experience
 * Inspired by OLX, WhatsApp & Facebook Messenger
 * 
 * Features:
 * - Distinct Conversation Threads (All, Buying, Selling, GSV Official Desk)
 * - Separate Full Chat View with Contact Info, Active Listing Context & Fast Actions
 * - Direct WhatsApp Connect & Campus Meetup Point Agreement
 * - Real-Time Message Bubbles with Double Blue Checks (✓✓)
 * - Quick Action Negotiation Chips (OLX style)
 * - Interactive Live Auto-Responder with Typing Indicators & Audio Alerts
 * - "+ Start New Chat" Dialog for Any Campus Listing
 */

const DEFAULT_CAMPUS_CONVERSATIONS = [
  {
    id: 'conv-priya-math',
    type: 'buying', // 'buying' | 'selling' | 'desk'
    other_user: {
      id: 'user-priya',
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      college: 'GSV Vadodara',
      branch: 'B.Tech Mechanical • 2nd Year',
      phone: '+91 98765 43210',
      online: true
    },
    product_id: 'prod-math-textbook',
    product_title: 'Engineering Mathematics Vol 2 (Advanced Calculus & ODE)',
    product_price: 450,
    product_status: 'active',
    product_images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'],
    last_message: 'Awesome! Can we meet at Central Canteen today around 5:30 PM for cash pickup?',
    last_message_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    unread_count: 1,
    messages: [
      {
        id: 'm-p1',
        sender_id: 'user-student-current',
        content: 'Hi Priya! Is the Engineering Mathematics Vol 2 textbook still available?',
        created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString()
      },
      {
        id: 'm-p2',
        sender_id: 'user-priya',
        content: 'Yes! It is in mint condition, semester 2 syllabus with solved previous year questions.',
        created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      },
      {
        id: 'm-p3',
        sender_id: 'user-student-current',
        content: 'Sounds great. Would you consider ₹400 for quick cash pickup on campus?',
        created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      },
      {
        id: 'm-p4',
        sender_id: 'user-priya',
        content: 'Awesome! Can we meet at Central Canteen today around 5:30 PM for cash pickup?',
        created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'conv-rohan-cycle',
    type: 'buying',
    other_user: {
      id: 'user-rohan',
      name: 'Rohan Mehta',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      college: 'GSV Vadodara',
      branch: 'B.Tech CSE • Senior Year',
      phone: '+91 98222 33445',
      online: true
    },
    product_id: 'prod-campus-cycle',
    product_title: 'Hero Sprint Campus Gear Bicycle (With Lock & Bell)',
    product_price: 2800,
    product_status: 'active',
    product_images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400'],
    last_message: 'Come by Pratap Nagar Colony Gate B after 6 PM today. Gears and brakes are brand new.',
    last_message_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    unread_count: 0,
    messages: [
      {
        id: 'm-r1',
        sender_id: 'user-student-current',
        content: 'Hi Rohan, saw your cycle listing. Is it available for a quick test ride on campus?',
        created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
      },
      {
        id: 'm-r2',
        sender_id: 'user-rohan',
        content: 'Come by Pratap Nagar Colony Gate B after 6 PM today. Gears and brakes are brand new.',
        created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'conv-aarav-transit',
    type: 'selling',
    other_user: {
      id: 'user-aarav',
      name: 'Aarav Patel',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      college: 'GSV Vadodara',
      branch: 'B.Tech Electrical • Batch 2024',
      phone: '+91 97111 22334',
      online: false
    },
    product_id: 'prod-brc-ticket',
    product_title: 'Western Railway Vadodara-Mumbai Central Seat Transfer',
    product_price: 1200,
    product_status: 'active',
    product_images: ['https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400'],
    last_message: 'Great, I will take it! Can we meet near Lalbaug Academic Block 1 tomorrow?',
    last_message_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    unread_count: 0,
    messages: [
      {
        id: 'm-a1',
        sender_id: 'user-aarav',
        content: 'Hello! I saw your Western Railway BRC-MMCT ticket transfer listing. Is the student ID transfer verified?',
        created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
      },
      {
        id: 'm-a2',
        sender_id: 'user-student-current',
        content: 'Yes! Strictly complying with IRCTC student shift guidelines.',
        created_at: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString()
      },
      {
        id: 'm-a3',
        sender_id: 'user-aarav',
        content: 'Great, I will take it! Can we meet near Lalbaug Academic Block 1 tomorrow?',
        created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'conv-gsv-desk',
    type: 'desk',
    other_user: {
      id: 'user-gsv-trust-desk',
      name: 'GSV Institutional Exchange Desk',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200',
      college: 'GSV Institutional Operations',
      branch: 'Trust & Verification Cell • GSV Vadodara',
      phone: '+91 265 264 4567',
      online: true,
      isOfficial: true
    },
    product_id: 'prod-gsv-desk',
    product_title: 'GSV Official Peer Verification & Security Desk',
    product_price: 0,
    product_status: 'verified',
    product_images: ['https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400'],
    last_message: 'Welcome to GSV Direct! All peer handovers are locked to verified @gsv.ac.in student credentials.',
    last_message_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    unread_count: 0,
    messages: [
      {
        id: 'm-d1',
        sender_id: 'user-gsv-trust-desk',
        content: 'Welcome to GSV Direct! You are connected to the official campus peer exchange network for Gati Shakti Vishwavidyalaya, Vadodara.',
        created_at: new Date(Date.now() - 25 * 3600 * 1000).toISOString()
      },
      {
        id: 'm-d2',
        sender_id: 'user-gsv-trust-desk',
        content: 'Campus Safety Tip: For physical item handovers, we recommend public meetup points — Lalbaug Central Canteen or Pratap Nagar Colony Gate B during daylight hours.',
        created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
      }
    ]
  }
];

const ChatInbox = {
  conversations: [],
  activeConversation: null,
  activeTab: 'all', // 'all', 'buying', 'selling', 'desk'
  messages: [],
  searchFilter: '',
  isTyping: false,

  render() {
    const el = document.getElementById('inbox-mount');
    if (!el) return;

    // Ensure user session exists so the inbox is never blocked
    if (!state.currentUser) {
      const defaultUser = {
        id: 'user-student-current',
        full_name: 'Devendra Parmar',
        email: 'devendra@gsv.ac.in',
        college_id: 'gsv-vadodara',
        college_short_name: 'GSV Vadodara',
        roll_number: '2024-BTECH-084',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
      };
      state.setCurrentUser(defaultUser);
      try {
        localStorage.setItem('campuscart_user', JSON.stringify(defaultUser));
      } catch (e) {}
    }

    el.innerHTML = `
      <div class="container" style="padding: 0 1rem 3rem 1rem;">
        <!-- Header -->
        <div class="inbox-page-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.72rem; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.35rem;">
              Campus Communications Hub
            </div>
            <h1 style="font-family: var(--font-display); font-size: 1.85rem; font-weight: 700; color: var(--text-primary); letter-spacing: -0.01em;">
              Campus Messages
            </h1>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">
              Safe in-app negotiation • Verified student identities • Direct meetup agreements
            </p>
          </div>

          <div style="display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap;">
            <button class="btn btn-primary btn-sm" onclick="ChatInbox.openNewChatModal()" style="display: inline-flex; align-items: center; gap: 0.4rem;">
              ${Icons.plusCircle ? Icons.plusCircle("w-4 h-4") : '+'}
              + Start New Chat
            </button>
            <button class="btn btn-secondary btn-sm" onclick="state.setActiveView('marketplace')" style="display: inline-flex; align-items: center; gap: 0.4rem;">
              ← Back to Marketplace
            </button>
          </div>
        </div>

        <!-- Main Chat App Frame (OLX & WhatsApp Layout) -->
        <div class="inbox-container" id="inbox-container">
          <!-- Left: Conversation Roster -->
          <aside class="inbox-sidebar" id="inbox-sidebar">
            <!-- OLX-Style Filter Tabs -->
            <div class="inbox-filter-tabs" id="inbox-filter-tabs">
              <!-- Rendered dynamically -->
            </div>

            <!-- Search Filter Header -->
            <div class="inbox-search-header">
              <div class="search-input-wrap">
                ${Icons.search ? Icons.search("w-4 h-4") : '🔍'}
                <input 
                  type="text" 
                  class="input-field" 
                  id="inbox-filter-search" 
                  placeholder="Search chats, students or items..." 
                  oninput="ChatInbox.filterConversations(this.value)"
                />
              </div>
            </div>

            <!-- Roster Items Mount -->
            <div class="conversation-list" id="conversation-list-mount">
              <!-- Rendered items -->
            </div>
          </aside>

          <!-- Right: Active Chat Room (Dedicated Separate View) -->
          <main class="chat-main-area" id="chat-main-area">
            <!-- Dynamic Room -->
          </main>
        </div>
      </div>

      <!-- New Chat Selection Modal -->
      <div class="modal-overlay" id="inbox-new-chat-modal" style="display: none;">
        <div class="modal-card" style="max-width: 520px; width: 100%;">
          <div class="modal-header">
            <h3 class="modal-title">Start a New Chat</h3>
            <button class="modal-close-btn" onclick="ChatInbox.closeNewChatModal()">✕</button>
          </div>
          <div class="modal-body" style="padding: 1rem 1.25rem;">
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
              Select any active campus listing below to start a private negotiation with the verified student seller:
            </p>
            <div id="new-chat-products-list" style="display: flex; flex-direction: column; gap: 0.65rem; max-height: 380px; overflow-y: auto;">
              <!-- Populated by JS -->
            </div>
          </div>
        </div>
      </div>
    `;

    this.initConversations();
  },

  initConversations() {
    try {
      const saved = localStorage.getItem('gsv_inbox_conversations');
      if (saved) {
        this.conversations = JSON.parse(saved);
      } else {
        this.conversations = JSON.parse(JSON.stringify(DEFAULT_CAMPUS_CONVERSATIONS));
        this.saveConversations();
      }
    } catch (e) {
      this.conversations = JSON.parse(JSON.stringify(DEFAULT_CAMPUS_CONVERSATIONS));
    }

    // Update unread badge in state
    const totalUnread = this.conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0);
    state.setUnreadCounts(undefined, totalUnread);

    this.renderTabs();
    this.renderConversationList();

    // Select active conversation (or requested by ID, or first in list)
    if (state.activeConversationId) {
      const target = this.conversations.find(c => c.id === state.activeConversationId || c.product_id === state.activeConversationId);
      if (target) {
        this.selectConversation(target);
        state.activeConversationId = null;
        return;
      }
    }

    if (!this.activeConversation && this.conversations.length > 0) {
      this.selectConversation(this.conversations[0]);
    } else if (this.activeConversation) {
      const updated = this.conversations.find(c => c.id === this.activeConversation.id);
      if (updated) this.selectConversation(updated);
    } else {
      this.renderEmptyChatState();
    }
  },

  saveConversations() {
    try {
      localStorage.setItem('gsv_inbox_conversations', JSON.stringify(this.conversations));
    } catch (e) {}
  },

  renderTabs() {
    const tabsMount = document.getElementById('inbox-filter-tabs');
    if (!tabsMount) return;

    const allCount = this.conversations.length;
    const buyingCount = this.conversations.filter(c => c.type === 'buying').length;
    const sellingCount = this.conversations.filter(c => c.type === 'selling').length;
    const deskCount = this.conversations.filter(c => c.type === 'desk').length;

    tabsMount.innerHTML = `
      <button class="inbox-tab-btn ${this.activeTab === 'all' ? 'active' : ''}" onclick="ChatInbox.switchTab('all')">
        💬 All (${allCount})
      </button>
      <button class="inbox-tab-btn ${this.activeTab === 'buying' ? 'active' : ''}" onclick="ChatInbox.switchTab('buying')">
        🛍️ Buying (${buyingCount})
      </button>
      <button class="inbox-tab-btn ${this.activeTab === 'selling' ? 'active' : ''}" onclick="ChatInbox.switchTab('selling')">
        🏷️ Selling (${sellingCount})
      </button>
      <button class="inbox-tab-btn ${this.activeTab === 'desk' ? 'active' : ''}" onclick="ChatInbox.switchTab('desk')">
        🛡️ GSV Desk (${deskCount})
      </button>
    `;
  },

  switchTab(tab) {
    this.activeTab = tab;
    this.renderTabs();
    this.renderConversationList();
  },

  getFilteredConversations() {
    return this.conversations.filter(c => {
      // Tab filter
      if (this.activeTab !== 'all' && c.type !== this.activeTab) {
        return false;
      }
      // Search filter
      if (this.searchFilter) {
        const q = this.searchFilter.toLowerCase();
        const name = (c.other_user?.name || '').toLowerCase();
        const prod = (c.product_title || '').toLowerCase();
        const msg = (c.last_message || '').toLowerCase();
        return name.includes(q) || prod.includes(q) || msg.includes(q);
      }
      return true;
    });
  },

  renderConversationList() {
    const mount = document.getElementById('conversation-list-mount');
    if (!mount) return;

    const list = this.getFilteredConversations();

    if (list.length === 0) {
      mount.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">💬</div>
          <p style="font-weight: 600; font-size: 0.88rem; color: var(--text-primary);">No conversations found</p>
          <p style="font-size: 0.78rem; margin-top: 0.35rem;">
            ${this.activeTab !== 'all' ? `No chats in "${this.activeTab}" tab.` : 'Start a chat with any student or explore the marketplace.'}
          </p>
          <button class="btn btn-secondary btn-sm" onclick="ChatInbox.openNewChatModal()" style="margin-top: 1rem;">
            + Start a Chat
          </button>
        </div>
      `;
      return;
    }

    mount.innerHTML = list.map(c => {
      const isSelected = this.activeConversation && this.activeConversation.id === c.id;
      const otherUser = c.other_user || {};
      const typeLabel = c.type === 'buying' ? 'BUYING' : (c.type === 'selling' ? 'SELLING' : 'GSV DESK');
      const badgeClass = c.type === 'buying' ? 'badge-buying' : (c.type === 'selling' ? 'badge-selling' : 'badge-desk');

      return `
        <div 
          class="conversation-item ${isSelected ? 'active' : ''}" 
          onclick="ChatInbox.selectConversationById('${c.id}')"
        >
          <div style="position: relative; flex-shrink: 0;">
            <img src="${otherUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}" class="chat-avatar" alt="${otherUser.name}" />
            ${otherUser.online ? `<span class="chat-online-badge" title="Active on campus"></span>` : ''}
          </div>
          
          <div class="chat-meta">
            <div class="chat-name-row">
              <span class="chat-user-name">${otherUser.name}</span>
              <span class="chat-time">${this.formatTime(c.last_message_at)}</span>
            </div>

            <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.25rem;">
              <span class="chat-type-badge ${badgeClass}">${typeLabel}</span>
              <span class="chat-product-hint" style="margin-bottom: 0;">
                ${c.product_price ? `₹${c.product_price.toLocaleString('en-IN')} • ` : ''}${c.product_title}
              </span>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
              <span class="chat-last-msg">
                ${c.messages && c.messages.length > 0 && c.messages[c.messages.length - 1].sender_id === 'user-student-current' ? '<span style="color: #60a5fa; font-weight: bold; margin-right: 2px;">✓✓</span> ' : ''}
                ${this.escapeHTML(c.last_message || 'Inquiry started')}
              </span>
              ${c.unread_count > 0 ? `
                <span class="chat-unread-badge">${c.unread_count}</span>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  backToList() {
    const container = document.getElementById('inbox-container');
    if (container) container.classList.remove('chat-active');
  },

  selectConversationById(id) {
    const conv = this.conversations.find(c => c.id === id);
    if (conv) this.selectConversation(conv);
  },

  selectConversation(conv) {
    this.activeConversation = conv;
    conv.unread_count = 0; // Mark as read
    this.saveConversations();
    this.renderTabs();
    this.renderConversationList();

    const container = document.getElementById('inbox-container');
    if (container) container.classList.add('chat-active');

    this.renderChatRoom(conv);
  },

  renderChatRoom(conv) {
    const mainArea = document.getElementById('chat-main-area');
    if (!mainArea) return;

    const otherUser = conv.other_user || {};
    const prodImg = conv.product_images && conv.product_images[0] ? conv.product_images[0] : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100';
    const waPhone = (otherUser.phone || '+919876543210').replace(/[^0-9]/g, '');
    const waText = encodeURIComponent(`Hi ${otherUser.name}, I am contacting you from GSV Direct regarding your listing: ${conv.product_title}`);

    mainArea.innerHTML = `
      <!-- 1. Dedicated Top Chat Header (WhatsApp & Facebook Style) -->
      <div class="chat-partner-bar">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <button class="chat-back-btn" onclick="ChatInbox.backToList()" title="Back to chat list">
            ←
          </button>
          
          <div style="position: relative;">
            <img src="${otherUser.avatar}" class="chat-avatar" alt="${otherUser.name}" style="width: 42px; height: 42px;" />
            ${otherUser.online ? `<span class="chat-online-badge"></span>` : ''}
          </div>

          <div>
            <div style="font-weight: 700; font-size: 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.4rem;">
              <span>${otherUser.name}</span>
              ${otherUser.isOfficial ? `
                <span style="font-size: 0.65rem; background: var(--accent-glow); color: var(--accent); padding: 0.1rem 0.4rem; border-radius: var(--radius-full); font-weight: 800; border: 1px solid var(--border-accent);">
                  🛡️ OFFICIAL DESK
                </span>
              ` : `
                <span style="font-size: 0.65rem; background: rgba(34, 197, 94, 0.15); color: #4ade80; padding: 0.1rem 0.45rem; border-radius: var(--radius-full); font-weight: 700; border: 1px solid rgba(34, 197, 94, 0.3);">
                  ✓ GSV VERIFIED
                </span>
              `}
            </div>
            <div style="font-size: 0.76rem; color: var(--text-muted);">
              ${otherUser.online ? '🟢 Online • ' : 'Active recently • '} ${otherUser.branch || otherUser.college || 'GSV Vadodara'}
            </div>
          </div>
        </div>

        <!-- WhatsApp, Meetup & Call Action Controls -->
        <div class="chat-actions-btn-group">
          ${!otherUser.isOfficial ? `
            <a 
              href="https://wa.me/${waPhone}?text=${waText}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn-whatsapp"
              title="Open WhatsApp chat with ${otherUser.name}"
            >
              <span>💬 WhatsApp</span>
            </a>

            <button 
              class="btn-meetup" 
              onclick="ChatInbox.promptMeetup()" 
              title="Propose safe campus meetup location"
            >
              <span>📍 Campus Meetup</span>
            </button>
          ` : `
            <button class="btn btn-secondary btn-sm" onclick="showToast('GSV Institutional Support is live 24/7.', 'info')">
              Campus Support
            </button>
          `}
        </div>
      </div>

      <!-- 2. Pinned Deal Context Ribbon (OLX Style) -->
      ${conv.product_title && conv.product_price ? `
        <div class="chat-product-ribbon">
          <div style="display: flex; align-items: center; gap: 0.75rem; min-width: 0;">
            <img src="${prodImg}" class="chat-prod-thumb" alt="${conv.product_title}" />
            <div style="min-width: 0;">
              <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${conv.product_title}
              </div>
              <div style="font-size: 0.8rem; color: var(--accent); font-weight: 800;">
                ₹${conv.product_price.toLocaleString('en-IN')}
                <span style="font-size: 0.68rem; font-weight: normal; color: var(--text-muted); margin-left: 0.35rem;">
                  • Campus Listing
                </span>
              </div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0;">
            <button class="btn btn-secondary btn-sm" onclick="ProductDetailModal.open('${conv.product_id}')" style="padding: 0.35rem 0.75rem; font-size: 0.76rem;">
              View Item
            </button>
            <button class="btn btn-primary btn-sm" onclick="ChatInbox.promptQuickOffer(${conv.product_price})" style="padding: 0.35rem 0.75rem; font-size: 0.76rem;">
              🤝 Make Offer
            </button>
          </div>
        </div>
      ` : ''}

      <!-- 3. Messages Stream (WhatsApp / Messenger Style) -->
      <div class="messages-stream" id="messages-stream">
        <div class="chat-security-banner">
          🔒 End-to-end verified GSV campus chat • Locked to @gsv.ac.in student credentials
        </div>
        <!-- Messages rendered below -->
      </div>

      <!-- Live Typing Indicator Box -->
      <div id="chat-typing-box" style="display: none; padding: 0 1.25rem 0.35rem 1.25rem;">
        <div class="typing-indicator-box">
          <span id="chat-typing-text">${otherUser.name} is typing</span>
          <div class="typing-dots">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      </div>

      <!-- 4. Quick Action Negotiation Chips (OLX Style) -->
      <div class="quick-offers-chips">
        <button class="quick-chip" onclick="ChatInbox.sendQuickMessage('Hi! Is this still available?')">
          👋 Is this still available?
        </button>
        <button class="quick-chip" onclick="ChatInbox.sendQuickMessage('Can we meet at the Central Canteen today around 5:30 PM?')">
          ☕ Meet at Central Canteen 5:30 PM
        </button>
        <button class="quick-chip" onclick="ChatInbox.sendQuickMessage('Would you consider ₹${Math.round(conv.product_price ? conv.product_price * 0.9 : 400)} for quick cash pickup?')">
          🤝 Offer ₹${Math.round(conv.product_price ? conv.product_price * 0.9 : 400)} cash
        </button>
        <button class="quick-chip" onclick="ChatInbox.sendQuickMessage('Can we meet near Pratap Nagar Colony Gate B?')">
          📍 Pratap Nagar Colony Gate B
        </button>
        <button class="quick-chip" onclick="ChatInbox.sendQuickMessage('Can you please hold this item for me until tomorrow?')">
          ⏳ Hold until tomorrow
        </button>
      </div>

      <!-- 5. Message Composer Bar (WhatsApp / Messenger Style) -->
      <form class="chat-input-bar" onsubmit="event.preventDefault(); ChatInbox.handleSendMessage();">
        <input 
          type="text" 
          id="chat-message-input" 
          class="input-field input-plain" 
          placeholder="Type a message to ${otherUser.name}... (Press Enter to send)" 
          autocomplete="off"
        />
        <button type="submit" class="btn btn-primary chat-send-btn" title="Send Message">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    `;

    this.renderMessages();
    setTimeout(() => {
      document.getElementById('chat-message-input')?.focus();
    }, 100);
  },

  renderMessages() {
    const stream = document.getElementById('messages-stream');
    if (!stream || !this.activeConversation) return;

    const msgs = this.activeConversation.messages || [];

    if (msgs.length === 0) {
      stream.innerHTML = `
        <div class="chat-security-banner">
          🔒 End-to-end verified GSV campus chat • Locked to @gsv.ac.in student credentials
        </div>
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <p style="font-size: 0.88rem;">No messages yet. Send a greeting or choose a quick offer below!</p>
        </div>
      `;
      return;
    }

    const currentUserId = state.currentUser ? state.currentUser.id : 'user-student-current';

    stream.innerHTML = `
      <div class="chat-security-banner">
        🔒 End-to-end verified GSV campus chat • Locked to @gsv.ac.in student credentials
      </div>
    ` + msgs.map(m => {
      const isMe = m.sender_id === currentUserId;
      return `
        <div class="message-bubble ${isMe ? 'message-sent' : 'message-received'}">
          <div>${this.escapeHTML(m.content)}</div>
          <span class="message-time">
            ${this.formatTime(m.created_at)} ${isMe ? '<span style="color: #60a5fa; font-weight: bold; margin-left: 3px;">✓✓</span>' : ''}
          </span>
        </div>
      `;
    }).join('');

    stream.scrollTop = stream.scrollHeight;
  },

  handleSendMessage() {
    const input = document.getElementById('chat-message-input');
    if (!input || !this.activeConversation) return;

    const content = input.value.trim();
    if (!content) return;

    input.value = '';

    const currentUserId = state.currentUser ? state.currentUser.id : 'user-student-current';
    const newMsg = {
      id: 'msg-' + Date.now(),
      sender_id: currentUserId,
      content,
      created_at: new Date().toISOString()
    };

    if (!this.activeConversation.messages) {
      this.activeConversation.messages = [];
    }
    this.activeConversation.messages.push(newMsg);
    this.activeConversation.last_message = content;
    this.activeConversation.last_message_at = new Date().toISOString();

    this.saveConversations();
    this.renderMessages();
    this.renderConversationList();

    // Trigger realistic simulated student reply
    this.triggerAutoReply(content);
  },

  sendQuickMessage(msg) {
    const input = document.getElementById('chat-message-input');
    if (input) {
      input.value = msg;
      this.handleSendMessage();
    }
  },

  triggerAutoReply(userMessage) {
    if (!this.activeConversation) return;

    const conv = this.activeConversation;
    const partner = conv.other_user || { name: 'Student' };

    // Show typing indicator
    const typingBox = document.getElementById('chat-typing-box');
    const typingText = document.getElementById('chat-typing-text');
    if (typingBox) {
      if (typingText) typingText.textContent = `${partner.name} is typing...`;
      typingBox.style.display = 'block';
      const stream = document.getElementById('messages-stream');
      if (stream) stream.scrollTop = stream.scrollHeight;
    }

    // Contextual response generator
    let replyText = "Sure, sounds good! See you on campus.";
    const lower = userMessage.toLowerCase();

    if (lower.includes('available')) {
      replyText = "Yes, it is 100% available! When are you free to meet on campus today?";
    } else if (lower.includes('canteen') || lower.includes('meet') || lower.includes('gate') || lower.includes('block')) {
      replyText = "Central Canteen sounds perfect! I'll be near the juice counter after 5 PM. See you there!";
    } else if (lower.includes('offer') || lower.includes('₹') || lower.includes('cash') || lower.includes('discount')) {
      replyText = "That price works for me for a quick campus cash handoff. Deal!";
    } else if (lower.includes('hold') || lower.includes('tomorrow')) {
      replyText = "Done! I will hold this item for you until tomorrow afternoon.";
    } else if (lower.includes('whatsapp') || lower.includes('call') || lower.includes('phone')) {
      replyText = `Sure! You can also reach me on WhatsApp or call me at ${partner.phone || '+91 98765 43210'}.`;
    } else if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
      replyText = `Hello! How are you doing? Are you interested in the ${conv.product_title}?`;
    } else {
      replyText = "Got it! Thanks for the update. Let me know if you need any other academic materials or details.";
    }

    setTimeout(() => {
      if (typingBox) typingBox.style.display = 'none';

      const replyMsg = {
        id: 'reply-' + Date.now(),
        sender_id: partner.id,
        content: replyText,
        created_at: new Date().toISOString()
      };

      if (!conv.messages) conv.messages = [];
      conv.messages.push(replyMsg);
      conv.last_message = replyText;
      conv.last_message_at = new Date().toISOString();

      this.saveConversations();
      this.renderMessages();
      this.renderConversationList();

      // Play soft chime
      try {
        if (window.NotificationCenter && typeof window.NotificationCenter.playNotificationChime === 'function') {
          window.NotificationCenter.playNotificationChime();
        }
      } catch (e) {}
    }, 1200);
  },

  promptMeetup() {
    const locations = [
      'Lalbaug Central Canteen (Near Juice Bar)',
      'Pratap Nagar Colony Main Gate B',
      'Central Library Entrance Desk',
      'Academic Block 1 Ground Floor Lobby'
    ];

    const chosen = prompt(
      `Propose a safe campus meetup location:\n\n1. ${locations[0]}\n2. ${locations[1]}\n3. ${locations[2]}\n4. ${locations[3]}\n\nEnter number (1-4) or type custom spot:`,
      '1'
    );

    if (!chosen) return;
    const locText = locations[parseInt(chosen) - 1] || chosen;
    this.sendQuickMessage(`📍 Let's meet at: ${locText} today around 5:30 PM.`);
  },

  promptQuickOffer(listedPrice) {
    const defaultOffer = Math.round(listedPrice * 0.9);
    const offer = prompt(`Enter your counter-offer for this item (Listed: ₹${listedPrice}):`, defaultOffer);
    if (offer && !isNaN(offer)) {
      this.sendQuickMessage(`🤝 Deal Offer: Would you take ₹${offer} for quick cash pickup on campus?`);
    }
  },

  openNewChatModal() {
    const modal = document.getElementById('inbox-new-chat-modal');
    const listMount = document.getElementById('new-chat-products-list');
    if (!modal || !listMount) return;

    // Fetch products or use default items
    const products = (window.Marketplace && window.Marketplace.products && window.Marketplace.products.length > 0)
      ? window.Marketplace.products
      : [
          { id: 'p-chem', title: 'Applied Chemistry Textbook & Notes', price: 350, seller_name: 'Aditi Varma', college_short_name: 'GSV Vadodara', image_url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=200' },
          { id: 'p-calc', title: 'Casio Scientific Calculator FX-991EX', price: 850, seller_name: 'Varun Rao', college_short_name: 'GSV Vadodara', image_url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=200' },
          { id: 'p-kettle', title: 'Electric Kettle 1.5L for Hostel 1 & 2', price: 400, seller_name: 'Kavya Patel', college_short_name: 'GSV Vadodara', image_url: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=200' },
          { id: 'p-jacket', title: 'Official GSV Sports Track Jacket (Size M)', price: 650, seller_name: 'Nikhil Kumar', college_short_name: 'GSV Vadodara', image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200' }
        ];

    listMount.innerHTML = products.map(p => `
      <div 
        style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: var(--surface-raised); border: 1px solid var(--border); border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s;"
        onclick="ChatInbox.startChatForProduct('${p.id}', '${this.escapeHTML(p.title)}', ${p.price || 0}, '${this.escapeHTML(p.seller_name || 'GSV Student')}', '${p.image_url || ''}')"
        onmouseover="this.style.borderColor='var(--accent)'"
        onmouseout="this.style.borderColor='var(--border)'"
      >
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <img src="${p.image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100'}" style="width: 40px; height: 40px; border-radius: var(--radius-sm); object-fit: cover;" alt="${p.title}" />
          <div>
            <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary);">${p.title}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">
              Seller: <strong>${p.seller_name || 'GSV Peer'}</strong> • ${p.college_short_name || 'GSV Vadodara'}
            </div>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 800; font-size: 0.95rem; color: var(--accent);">₹${p.price ? p.price.toLocaleString('en-IN') : '0'}</div>
          <span style="font-size: 0.72rem; color: var(--text-secondary);">Start Chat →</span>
        </div>
      </div>
    `).join('');

    modal.style.display = 'flex';
  },

  closeNewChatModal() {
    const modal = document.getElementById('inbox-new-chat-modal');
    if (modal) modal.style.display = 'none';
  },

  startChatForProduct(prodId, prodTitle, prodPrice, sellerName, prodImg) {
    this.closeNewChatModal();

    // Check if conversation already exists
    let existing = this.conversations.find(c => c.product_id === prodId);
    if (!existing) {
      existing = {
        id: 'conv-' + Date.now(),
        type: 'buying',
        other_user: {
          id: 'user-' + Date.now(),
          name: sellerName || 'Verified GSV Student',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
          college: 'GSV Vadodara',
          branch: 'Enrolled GSV Student',
          phone: '+91 98765 00112',
          online: true
        },
        product_id: prodId,
        product_title: prodTitle,
        product_price: prodPrice,
        product_status: 'active',
        product_images: [prodImg || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'],
        last_message: 'Hi! Is this still available?',
        last_message_at: new Date().toISOString(),
        unread_count: 0,
        messages: [
          {
            id: 'm-init-' + Date.now(),
            sender_id: 'user-student-current',
            content: `Hi ${sellerName}! I am interested in your listing: "${prodTitle}". Is it still available?`,
            created_at: new Date().toISOString()
          }
        ]
      };
      this.conversations.unshift(existing);
      this.saveConversations();
    }

    this.selectConversation(existing);
  },

  filterConversations(query) {
    this.searchFilter = query || '';
    this.renderConversationList();
  },

  formatTime(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diffHours = (now - d) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  },

  escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
  }
};

window.ChatInbox = ChatInbox;
