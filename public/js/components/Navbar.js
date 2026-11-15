/**
 * CampusCart - Master Rebuilt Navbar Component
 * Linear & Apple Inspired Minimalist Architecture
 * NO UNNECESSARY LAUNCH CAMPUS CLUTTER
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
          <!-- Left: Clean Geometric Brand Identity -->
          <a href="#" class="brand-logo" onclick="event.preventDefault(); state.setActiveView('marketplace');">
            <div class="brand-icon-wrapper">
              ${Icons.shoppingBag("w-5 h-5")}
            </div>
            <span>CampusCart</span>
          </a>

          <!-- Center: Reorganized Navigation Cluster -->
          <ul class="nav-links-cluster">
            <li>
              <a class="nav-item-link ${state.activeView === 'marketplace' ? 'active' : ''}" onclick="state.setActiveView('marketplace')">
                Explore
              </a>
            </li>
            <li>
              <a class="nav-item-link" onclick="document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' })">
                Categories
              </a>
            </li>
            <li>
              <a class="nav-item-link" onclick="document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' })">
                How It Works
              </a>
            </li>
            <li>
              <a class="nav-item-link" onclick="CollegeSelectorModal.open()">
                Campuses
              </a>
            </li>
            <li>
              <a class="nav-item-link ${state.activeView === 'inbox' ? 'active' : ''}" onclick="Navbar.handleInboxClick()">
                ${Icons.messageSquare("w-4 h-4")}
                Inbox
                ${unreadMsgs > 0 ? `<span class="nav-badge-pill">${unreadMsgs}</span>` : ''}
              </a>
            </li>
            ${user ? `
              <li>
                <a class="nav-item-link ${state.activeView === 'seller-dashboard' ? 'active' : ''}" onclick="state.setActiveView('seller-dashboard')">
                  Dashboard
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

          <!-- Right: Action & Profile Group -->
          <div class="nav-actions-group">
            <!-- Search Omnibar Trigger -->
            <button class="nav-search-trigger" onclick="Navbar.triggerSearchFocus()" title="Press Cmd+K to search">
              ${Icons.search("w-4 h-4")}
              <span>Search listings...</span>
              <kbd>⌘K</kbd>
            </button>

            <!-- Post an Item CTA -->
            <button class="btn btn-primary btn-sm flex items-center gap-2" onclick="Navbar.handleSellClick()" style="padding: 0.45rem 0.95rem; font-weight: 700;">
              ${Icons.plusCircle("w-4 h-4")}
              <span>Sell</span>
            </button>

            <!-- User Auth / Profile Menu -->
            ${user ? `
              <div class="relative" style="position: relative;">
                <button class="btn btn-secondary btn-sm flex items-center gap-2" id="nav-user-menu-btn" style="border-radius: var(--radius-full); padding: 0.3rem 0.75rem;">
                  <img src="${user.avatar_url}" class="chat-avatar" style="width: 26px; height: 26px;" alt="Avatar" />
                  <span style="font-weight: 700; max-width: 90px;" class="truncate">${user.full_name.split(' ')[0]}</span>
                  ${Icons.chevronDown("w-3 h-3 text-muted")}
                </button>
                <div class="dropdown-menu hidden" id="user-dropdown-menu" style="position: absolute; right: 0; top: 120%; width: 220px; background: white; border: var(--border-hairline); border-radius: var(--radius-xl); box-shadow: var(--shadow-elevated); padding: 0.5rem; z-index: 100;">
                  <div style="padding: 0.6rem 0.85rem; border-bottom: 1px solid rgba(15,23,42,0.08); margin-bottom: 0.35rem;">
                    <div style="font-weight: 800; font-size: 0.92rem; color: var(--ink-display);">${user.full_name}</div>
                    <div style="font-size: 0.75rem; color: var(--ink-muted);">${user.email}</div>
                    <div style="font-size: 0.72rem; font-weight: 700; color: var(--cobalt); margin-top: 3px;">${user.college_short_name || 'GSV Vadodara'}</div>
                  </div>
                  <button class="btn btn-ghost w-full justify-start text-sm" style="width: 100%; text-align: left;" onclick="UserProfileModal.open(); Navbar.closeUserMenu();">
                    ${Icons.user("w-4 h-4")} Profile & Listings
                  </button>
                  <button class="btn btn-ghost w-full justify-start text-sm" style="width: 100%; text-align: left;" onclick="state.setActiveView('seller-dashboard'); Navbar.closeUserMenu();">
                    ${Icons.shoppingBag("w-4 h-4")} Seller Dashboard
                  </button>
                  <button class="btn btn-ghost w-full justify-start text-sm" style="width: 100%; text-align: left;" onclick="Navbar.openWishlistView(); Navbar.closeUserMenu();">
                    ${Icons.heart("w-4 h-4")} Saved Items
                  </button>
                  ${user.is_admin ? `
                    <button class="btn btn-ghost w-full justify-start text-sm" style="width: 100%; text-align: left; color: #0062FF;" onclick="state.setActiveView('admin'); Navbar.closeUserMenu();">
                      ${Icons.shieldCheck("w-4 h-4")} Admin Control Center
                    </button>
                  ` : ''}
                  <div style="border-top: 1px solid rgba(15,23,42,0.08); margin-top: 0.35rem; padding-top: 0.35rem;">
                    <button class="btn btn-ghost w-full justify-start text-sm" style="width: 100%; text-align: left; color: #F43F5E;" onclick="Navbar.handleLogout()">
                      ${Icons.logOut("w-4 h-4")} Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ` : `
              <button class="btn btn-secondary btn-sm" onclick="AuthModal.open('login')">
                Sign In
              </button>
            `}
          </div>
        </div>
      </nav>
    `;

    const userMenuBtn = document.getElementById('nav-user-menu-btn');
    if (userMenuBtn) {
      userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const menu = document.getElementById('user-dropdown-menu');
        menu.classList.toggle('hidden');
      });
      document.addEventListener('click', () => Navbar.closeUserMenu());
    }
  },

  closeUserMenu() {
    const menu = document.getElementById('user-dropdown-menu');
    if (menu) menu.classList.add('hidden');
  },

  triggerSearchFocus() {
    const searchInput = document.getElementById('marketplace-search-input') || 
                        document.getElementById('mobile-search-input');
    if (searchInput) {
      searchInput.focus();
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },

  handleMobileProfileClick() {
    if (!state.currentUser) {
      AuthModal.open('login');
    } else {
      UserProfileModal.open();
    }
  },

  handleInboxClick() {
    if (!state.currentUser) {
      showToast('Please login to access your internal inbox', 'info');
      AuthModal.open('login');
      return;
    }
    state.setActiveView('inbox');
  },

  handleSellClick() {
    if (!state.currentUser) {
      showToast('Please sign in or register to list a product', 'info');
      AuthModal.open('register');
      return;
    }
    SellItemModal.open();
  },

  handleLogout() {
    API.logout();
    state.setCurrentUser(null);
    state.setActiveView('marketplace');
    showToast('Signed out successfully. See you soon!', 'info');
  },

  openWishlistView() {
    state.setActiveView('marketplace');
    UserProfileModal.open('wishlist');
  }
};
