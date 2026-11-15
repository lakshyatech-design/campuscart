/**
 * GSV Direct — Master Navbar Component
 * Official Gati Shakti Vishwavidyalaya Student & Logistics Exchange
 * 
 * Includes GSV Brand Emblem, Navigation Cluster, Real-Time Notification Bell
 * with dynamic unread counter, Instant Search (⌘K), and Upload (+ List) CTA.
 */

const Navbar = {
  render() {
    const el = document.getElementById('navbar-mount');
    if (!el) return;

    const user = state.currentUser;
    const unreadMsgs = state.unreadMessagesCount;

    el.innerHTML = `
      <nav class="navbar">
        <div class="container navbar-inner">
          <!-- Left: GSV Brand Crest & Identity -->
          <a href="#" class="brand-logo gsv-brand-lockup" onclick="event.preventDefault(); state.setActiveView('marketplace');">
            <div class="gsv-emblem-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="3" width="16" height="15" rx="3"></rect>
                <path d="m9 18-3 3"></path>
                <path d="m15 18 3 3"></path>
                <line x1="8" y1="8" x2="8.01" y2="8"></line>
                <line x1="16" y1="8" x2="16.01" y2="8"></line>
                <line x1="4" y1="11" x2="20" y2="11"></line>
              </svg>
            </div>
            <div class="gsv-brand-text">
              <span class="gsv-brand-title">GSV Direct</span>
              <span class="gsv-brand-sub">Gati Shakti Vishwavidyalaya</span>
            </div>
          </a>

          <!-- Center: Navigation Links Cluster -->
          <ul class="nav-links-cluster">
            <li>
              <a class="nav-item-link ${state.activeView === 'marketplace' ? 'active' : ''}" onclick="state.setActiveView('marketplace')">
                Marketplace
              </a>
            </li>
            <li>
              <a class="nav-item-link" onclick="Navbar.filterTransit()">
                GSV Transit & Tickets
              </a>
            </li>
            <li>
              <a class="nav-item-link" onclick="document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' })">
                Categories
              </a>
            </li>
            <li>
              <a class="nav-item-link" onclick="document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' })">
                Safety Pledge
              </a>
            </li>
            <li>
              <a class="nav-item-link ${state.activeView === 'inbox' ? 'active' : ''}" onclick="Navbar.handleInboxClick()">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Inbox</span>
                ${unreadMsgs > 0 ? `<span class="nav-badge-pill">${unreadMsgs}</span>` : ''}
              </a>
            </li>
            ${user ? `
              <li>
                <a class="nav-item-link ${state.activeView === 'seller-dashboard' ? 'active' : ''}" onclick="state.setActiveView('seller-dashboard')">
                  My Listings
                </a>
              </li>
            ` : ''}
            ${user && user.is_admin ? `
              <li>
                <a class="nav-item-link ${state.activeView === 'admin' ? 'active' : ''}" onclick="state.setActiveView('admin')">
                  Admin Hub
                </a>
              </li>
            ` : ''}
          </ul>

          <!-- Right: Real-time Notification Bell + Actions -->
          <div class="nav-actions-group">
            <!-- Search Shortcut (⌘K) -->
            <button class="nav-search-trigger" onclick="Navbar.triggerSearchFocus()" title="Press Cmd+K or Ctrl+K to search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span>Search GSV...</span>
              <kbd>⌘K</kbd>
            </button>

            <!-- Real-Time Notification Center Bell -->
            <div class="gsv-notif-bell-container" style="position: relative;">
              <button class="gsv-notif-bell-btn" id="gsv-notif-trigger" onclick="window.NotificationCenter?.toggleDropdown()" title="Campus Listing Notifications">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span class="gsv-notif-badge" style="display: none;">0</span>
              </button>

              <!-- Dropdown Notification Center -->
              <div class="gsv-notif-dropdown" id="gsv-notif-dropdown">
                <div class="gsv-notif-header">
                  <div class="gsv-notif-header-title">
                    <span class="gsv-notif-header-label">Campus Activity</span>
                    <span class="gsv-notif-chip">LIVE</span>
                  </div>
                  <button class="gsv-notif-mark-all-btn" id="gsv-notif-mark-all">Mark all read</button>
                </div>
                <div class="gsv-notif-list" id="gsv-notif-list">
                  <!-- Populated dynamically by NotificationCenter.js -->
                </div>
                <div class="gsv-notif-footer">
                  <span>Connected to GSV Vadodara Realtime Feed</span>
                </div>
              </div>
            </div>

            <!-- List an Item CTA -->
            <button class="btn btn-primary btn-sm flex items-center gap-2" onclick="Navbar.handleSellClick()" style="padding: 0.45rem 1rem; font-weight: 800; letter-spacing: -0.01em;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span>+ List Item</span>
            </button>

            <!-- User Auth / Profile Dropdown -->
            ${user ? `
              <div class="relative" style="position: relative;">
                <button class="btn btn-secondary btn-sm flex items-center gap-2" id="nav-user-menu-btn" style="border-radius: var(--radius-full); padding: 0.3rem 0.75rem;">
                  <img src="${user.avatar_url}" class="chat-avatar" style="width: 26px; height: 26px; border-radius: 50%;" alt="Avatar" />
                  <span style="font-weight: 700; max-width: 90px;" class="truncate">${user.full_name.split(' ')[0]}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <div class="dropdown-menu hidden" id="user-dropdown-menu" style="position: absolute; right: 0; top: 120%; width: 230px; background: white; border: var(--border-hairline); border-radius: var(--radius-xl); box-shadow: var(--shadow-elevated); padding: 0.5rem; z-index: 100;">
                  <div style="padding: 0.6rem 0.85rem; border-bottom: 1px solid rgba(15,23,42,0.08); margin-bottom: 0.35rem;">
                    <div style="font-weight: 800; font-size: 0.92rem; color: var(--ink-display);">${user.full_name}</div>
                    <div style="font-size: 0.75rem; color: var(--ink-muted);">${user.email}</div>
                    <div style="font-size: 0.72rem; font-weight: 700; color: var(--cobalt); margin-top: 3px;">${user.college_short_name || 'GSV Vadodara'}</div>
                  </div>
                  <button class="btn btn-ghost w-full justify-start text-sm" style="width: 100%; text-align: left; padding: 0.5rem 0.75rem;" onclick="UserProfileModal.open(); Navbar.closeUserMenu();">
                    Profile & Settings
                  </button>
                  <button class="btn btn-ghost w-full justify-start text-sm" style="width: 100%; text-align: left; padding: 0.5rem 0.75rem;" onclick="state.setActiveView('seller-dashboard'); Navbar.closeUserMenu();">
                    My GSV Listings
                  </button>
                  <div style="height: 1px; background: rgba(15,23,42,0.08); margin: 0.25rem 0;"></div>
                  <button class="btn btn-ghost w-full justify-start text-sm text-danger" style="width: 100%; text-align: left; padding: 0.5rem 0.75rem; color: #dc2626;" onclick="state.logout(); Navbar.closeUserMenu();">
                    Sign Out
                  </button>
                </div>
              </div>
            ` : `
              <div class="flex items-center gap-2">
                <button class="btn btn-secondary btn-sm" onclick="AuthModal.open('login')" style="padding: 0.45rem 0.9rem; font-weight: 700;">
                  Sign In
                </button>
                <button class="btn btn-secondary btn-sm" onclick="Navbar.quickDemoLogin()" style="padding: 0.45rem 0.8rem; font-size: 0.75rem; font-weight: 800; color: var(--cobalt);">
                  Demo
                </button>
              </div>
            `}

            <!-- Mobile Hamburger Button -->
            <button class="mobile-menu-btn" onclick="Navbar.toggleMobileMenu()" title="Open Navigation Drawer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation Drawer -->
        <div class="mobile-nav-drawer hidden" id="mobile-nav-drawer">
          <div class="mobile-nav-inner">
            <div class="mobile-nav-campus-badge">
              <span class="badge-dot"></span>
              <span>Gati Shakti Vishwavidyalaya Verified Hub</span>
            </div>
            <a class="mobile-nav-item ${state.activeView === 'marketplace' ? 'active' : ''}" onclick="state.setActiveView('marketplace'); Navbar.toggleMobileMenu();">
              Explore All Marketplace
            </a>
            <a class="mobile-nav-item" onclick="Navbar.filterTransit(); Navbar.toggleMobileMenu();">
              GSV Transit & Tickets
            </a>
            <a class="mobile-nav-item" onclick="document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' }); Navbar.toggleMobileMenu();">
              Categories
            </a>
            <a class="mobile-nav-item" onclick="Navbar.handleInboxClick(); Navbar.toggleMobileMenu();">
              Inbox Messages ${unreadMsgs > 0 ? `(${unreadMsgs})` : ''}
            </a>
            ${user ? `
              <a class="mobile-nav-item" onclick="state.setActiveView('seller-dashboard'); Navbar.toggleMobileMenu();">
                Seller Dashboard
              </a>
              <a class="mobile-nav-item" onclick="UserProfileModal.open(); Navbar.toggleMobileMenu();">
                My Profile
              </a>
              <a class="mobile-nav-item" style="color: #dc2626;" onclick="state.logout(); Navbar.toggleMobileMenu();">
                Sign Out (${user.full_name})
              </a>
            ` : `
              <div class="mobile-nav-auth-buttons">
                <button class="btn btn-primary w-full" onclick="AuthModal.open('login'); Navbar.toggleMobileMenu();">Sign In</button>
                <button class="btn btn-secondary w-full" onclick="Navbar.quickDemoLogin(); Navbar.toggleMobileMenu();">1-Click Student Demo</button>
              </div>
            `}
          </div>
        </div>
      </nav>
    `;

    // Bind dropdown click listener
    const userMenuBtn = document.getElementById('nav-user-menu-btn');
    if (userMenuBtn) {
      userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const menu = document.getElementById('user-dropdown-menu');
        if (menu) menu.classList.toggle('hidden');
      });
    }

    document.addEventListener('click', (e) => {
      const menu = document.getElementById('user-dropdown-menu');
      if (menu && !menu.contains(e.target)) {
        menu.classList.add('hidden');
      }
    });

    // Initialize notification center badge & listeners
    if (window.NotificationCenter) {
      window.NotificationCenter.init();
    }
  },

  filterTransit() {
    state.setSelectedCategory('Railway Tickets');
    state.setActiveView('marketplace');
    document.getElementById('marketplace-feed')?.scrollIntoView({ behavior: 'smooth' });
  },

  handleSellClick() {
    if (!state.currentUser) {
      state.showToast('Please sign in with your GSV email to list items.', 'info');
      AuthModal.open('login');
      return;
    }
    SellItemModal.open();
  },

  handleInboxClick() {
    if (!state.currentUser) {
      state.showToast('Please sign in to view your GSV inbox.', 'info');
      AuthModal.open('login');
      return;
    }
    state.setActiveView('inbox');
  },

  triggerSearchFocus() {
    const searchInput = document.getElementById('market-search-input');
    if (searchInput) {
      searchInput.focus();
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      state.setActiveView('marketplace');
      setTimeout(() => {
        const inp = document.getElementById('market-search-input');
        if (inp) inp.focus();
      }, 150);
    }
  },

  closeUserMenu() {
    const menu = document.getElementById('user-dropdown-menu');
    if (menu) menu.classList.add('hidden');
  },

  toggleMobileMenu() {
    const drawer = document.getElementById('mobile-nav-drawer');
    if (drawer) drawer.classList.toggle('hidden');
  },

  async quickDemoLogin() {
    try {
      const res = await api.auth.switchDemo('user-aarav');
      state.setUser(res.user);
      state.showToast(`Logged in as Aarav Sharma (GSV B.Tech Student)`, 'success');
      Navbar.render();
    } catch (e) {
      state.showToast('Demo login failed: ' + e.message, 'error');
    }
  }
};
