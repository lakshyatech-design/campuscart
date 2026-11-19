/**
 * GSV Direct — Navbar (Forge Automotive Inspired)
 * Minimal: Logo Left | Links Center | Actions Right
 * Full-screen navigation overlay on mobile (serif menu items)
 */

const Navbar = {
  _scrollBound: false,

  render() {
    const el = document.getElementById('navbar-mount');
    if (!el) return;

    const user = state.currentUser;
    const unreadMsgs = state.unreadMessagesCount;
    const isSubPage = state.activeView && state.activeView !== 'marketplace';

    if (typeof document !== 'undefined' && document.body) {
      document.body.setAttribute('data-view', state.activeView || 'marketplace');
    }

    el.innerHTML = `
      <nav class="navbar ${isSubPage ? 'navbar-solid scrolled' : ''}" id="main-navbar">
        <div class="container navbar-inner">
          <!-- Brand -->
          <a href="#" class="brand-logo" onclick="event.preventDefault(); state.setActiveView('marketplace');">
            <div class="gsv-emblem-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="4" y="3" width="16" height="15" rx="3"></rect>
                <path d="m9 18-3 3"></path>
                <path d="m15 18 3 3"></path>
              </svg>
            </div>
            <div class="gsv-brand-text">
              <span class="gsv-brand-title">GSV Direct</span>
              <span class="gsv-brand-sub">Gati Shakti Vishwavidyalaya</span>
            </div>
          </a>

          <!-- Center Navigation -->
          <ul class="nav-links-cluster">
            <li>
              <a class="nav-item-link ${state.activeView === 'marketplace' ? 'active' : ''}" onclick="state.setActiveView('marketplace')">
                Marketplace
              </a>
            </li>
            <li>
              <a class="nav-item-link" onclick="Navbar.filterTransit()">
                Transit
              </a>
            </li>
            <li>
              <a class="nav-item-link" onclick="document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' })">
                Categories
              </a>
            </li>
            <li>
              <a class="nav-item-link ${state.activeView === 'inbox' ? 'active' : ''}" onclick="Navbar.handleInboxClick()">
                Inbox
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
                  Admin
                </a>
              </li>
            ` : ''}
          </ul>

          <!-- Right Actions -->
          <div class="nav-actions-group">
            <!-- Search -->
            <button class="nav-search-trigger" onclick="Navbar.triggerSearchFocus()" title="Search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span>Search</span>
              <kbd>⌘K</kbd>
            </button>

            <!-- Notification Bell -->
            <div class="gsv-notif-bell-container" style="position: relative;">
              <button class="gsv-notif-bell-btn" id="gsv-notif-trigger" onclick="window.NotificationCenter?.toggleDropdown()" title="Notifications">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span class="gsv-notif-badge" style="display: none;">0</span>
              </button>

              <div class="gsv-notif-dropdown" id="gsv-notif-dropdown">
                <div class="gsv-notif-header">
                  <div class="gsv-notif-header-title">
                    <span class="gsv-notif-header-label">Activity</span>
                    <span class="gsv-notif-chip">LIVE</span>
                  </div>
                  <button class="gsv-notif-mark-all-btn" id="gsv-notif-mark-all">Mark all read</button>
                </div>
                <div class="gsv-notif-list" id="gsv-notif-list"></div>
                <div class="gsv-notif-footer">
                  <span>Connected to GSV Vadodara Realtime Feed</span>
                </div>
              </div>
            </div>

            <!-- List Item CTA -->
            <button class="btn btn-primary btn-sm nav-list-item-btn" onclick="Navbar.handleSellClick()" style="padding: 0.45rem 1rem;">
              + List Item
            </button>

            <!-- User Auth / Profile -->
            ${user ? `
              <div class="relative nav-user-menu-desktop" style="position: relative;">
                <button class="btn btn-secondary btn-sm nav-user-menu-btn" id="nav-user-menu-btn" style="border-radius: var(--radius-full); padding: 0.3rem 0.75rem; align-items: center; gap: 0.4rem;">
                  <img src="${user.avatar_url}" class="chat-avatar" style="width: 24px; height: 24px; border-radius: 50%;" alt="Avatar" />
                  <span style="font-weight: 700; max-width: 80px;" class="truncate">${user.full_name.split(' ')[0]}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <div class="dropdown-menu hidden" id="user-dropdown-menu" style="position: absolute; right: 0; top: 120%; width: 220px;">
                  <div style="padding: 0.6rem 0.85rem; border-bottom: 1px solid var(--border); margin-bottom: 0.35rem;">
                    <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary);">${user.full_name}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">${user.email}</div>
                    <div style="font-size: 0.68rem; font-weight: 700; color: var(--accent); margin-top: 3px;">${user.college_short_name || 'GSV Vadodara'}</div>
                  </div>
                  <button class="btn btn-ghost w-full" style="width: 100%; text-align: left; padding: 0.5rem 0.75rem; justify-content: flex-start;" onclick="UserProfileModal.open(); Navbar.closeUserMenu();">
                    Profile & Settings
                  </button>
                  <button class="btn btn-ghost w-full" style="width: 100%; text-align: left; padding: 0.5rem 0.75rem; justify-content: flex-start;" onclick="state.setActiveView('seller-dashboard'); Navbar.closeUserMenu();">
                    My Listings
                  </button>
                  <div style="height: 1px; background: var(--border); margin: 0.25rem 0;"></div>
                  <button class="btn btn-ghost w-full text-danger" style="width: 100%; text-align: left; padding: 0.5rem 0.75rem; justify-content: flex-start; color: var(--danger);" onclick="Navbar.handleLogout();">
                    Sign Out
                  </button>
                </div>
              </div>
            ` : `
              <div class="nav-auth-desktop flex items-center gap-2">
                <button class="btn btn-secondary btn-sm" onclick="AuthModal.open('login')">
                  Sign In
                </button>
              </div>
            `}

            <!-- Mobile Hamburger -->
            <button class="mobile-menu-btn" onclick="Navbar.toggleMobileMenu()" title="Navigate">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Full-Screen Navigation Drawer -->
        <div class="mobile-nav-drawer hidden" id="mobile-nav-drawer">
          <div style="position: absolute; top: 1rem; right: 1.25rem;">
            <button onclick="Navbar.toggleMobileMenu()" style="color: var(--text-primary); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; display: flex; align-items: center; gap: 0.5rem; background: none; border: none; cursor: pointer;">
              Close
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div class="mobile-nav-inner">
            <div class="mobile-nav-campus-badge">
              <span class="badge-dot"></span>
              <span>Gati Shakti Vishwavidyalaya</span>
            </div>
            <a class="mobile-nav-item ${state.activeView === 'marketplace' ? 'active' : ''}" onclick="state.setActiveView('marketplace'); Navbar.toggleMobileMenu();">
              Marketplace
            </a>
            <a class="mobile-nav-item" onclick="Navbar.filterTransit(); Navbar.toggleMobileMenu();">
              Transit & Tickets
            </a>
            <a class="mobile-nav-item" onclick="document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' }); Navbar.toggleMobileMenu();">
              Categories
            </a>
            <a class="mobile-nav-item" onclick="Navbar.handleInboxClick(); Navbar.toggleMobileMenu();">
              Inbox ${unreadMsgs > 0 ? '(' + unreadMsgs + ')' : ''}
            </a>
            ${user ? `
              <a class="mobile-nav-item" onclick="state.setActiveView('seller-dashboard'); Navbar.toggleMobileMenu();">
                My Listings
              </a>
              <a class="mobile-nav-item" onclick="UserProfileModal.open(); Navbar.toggleMobileMenu();">
                Profile
              </a>
              <a class="mobile-nav-item" style="color: var(--danger);" onclick="Navbar.handleLogout();">
                Sign Out
              </a>
            ` : `
              <div class="mobile-nav-auth-buttons">
                <button class="btn btn-primary w-full" onclick="AuthModal.open('login'); Navbar.toggleMobileMenu();">Sign In</button>
              </div>
            `}
          </div>
        </div>
      </nav>
    `;

    // User dropdown toggle
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

    // Scroll listener for navbar background
    if (!this._scrollBound) {
      this._scrollBound = true;
      window.addEventListener('scroll', () => {
        const nav = document.getElementById('main-navbar');
        if (nav) {
          const isSub = state.activeView && state.activeView !== 'marketplace';
          if (isSub || window.scrollY > 40) {
            nav.classList.add('scrolled');
            if (isSub) nav.classList.add('navbar-solid');
          } else {
            nav.classList.remove('scrolled');
            nav.classList.remove('navbar-solid');
          }
        }
      }, { passive: true });
    }

    // Init notification center
    if (window.NotificationCenter) {
      window.NotificationCenter.init();
    }
  },

  filterTransit() {
    state.setActiveCategory('Railway Tickets');
    state.setActiveView('marketplace');
    document.getElementById('marketplace-feed')?.scrollIntoView({ behavior: 'smooth' });
  },

  handleSellClick() {
    if (!state.currentUser) {
      showToast('Please sign in with your GSV email to list items.', 'info');
      AuthModal.open('login');
      return;
    }
    SellItemModal.open();
  },

  handleInboxClick() {
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
    state.setActiveView('inbox');
  },

  handleMobileProfileClick() {
    if (!state.currentUser) {
      AuthModal.open('login');
      return;
    }
    UserProfileModal.open();
  },

  triggerSearchFocus() {
    const searchInput = document.getElementById('marketplace-search-input') || document.getElementById('mobile-search-input');
    if (searchInput) {
      searchInput.focus();
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      state.setActiveView('marketplace');
      setTimeout(() => {
        const inp = document.getElementById('marketplace-search-input') || document.getElementById('mobile-search-input');
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

  handleLogout() {
    this.closeUserMenu();
    const drawer = document.getElementById('mobile-nav-drawer');
    if (drawer && !drawer.classList.contains('hidden')) {
      drawer.classList.add('hidden');
    }
    if (window.state && typeof window.state.logout === 'function') {
      window.state.logout();
    }
  }
};

window.Navbar = Navbar;
