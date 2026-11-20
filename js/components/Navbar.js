/**
 * CampusCart - Apple Visionary Global Navigation Bar
 * Sleek 48px frosted titanium glass, clean Apple layout, and instant responsive controls
 */

const Navbar = {
  render() {
    const mount = document.getElementById('navbar-mount');
    if (!mount) return;

    const user = state.currentUser;

    mount.innerHTML = `
      <header class="apple-nav-header">
        <div class="apple-nav-container">
          <!-- Left: Brand Logo & Title -->
          <div class="apple-nav-brand" onclick="state.setActiveView('marketplace')">
            <div class="apple-brand-symbol">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <rect x="4" y="3" width="16" height="15" rx="3"></rect>
                <path d="m9 18-3 3"></path>
                <path d="m15 18 3 3"></path>
              </svg>
            </div>
            <div class="apple-brand-text">
              <span class="apple-brand-title">GSV Direct</span>
              <span class="apple-brand-tag">CAMPUS COMMERCE</span>
            </div>
          </div>

          <!-- Center: Apple Navigation Links -->
          <nav class="apple-nav-links">
            <a href="javascript:void(0)" class="apple-nav-link ${state.currentView === 'marketplace' ? 'active' : ''}" onclick="state.setActiveView('marketplace')">Exchange</a>
            <a href="javascript:void(0)" class="apple-nav-link" onclick="PopularCategories.selectCategory('Cycles')">Cycles</a>
            <a href="javascript:void(0)" class="apple-nav-link" onclick="PopularCategories.selectCategory('Railway Tickets')">Railway</a>
            <a href="javascript:void(0)" class="apple-nav-link" onclick="PopularCategories.selectCategory('Books & Study Materials')">Textbooks</a>
            <a href="javascript:void(0)" class="apple-nav-link" onclick="PopularCategories.selectCategory('Electronics & Gadgets')">Tech</a>
            <a href="javascript:void(0)" class="apple-nav-link ${state.currentView === 'inbox' ? 'active' : ''}" onclick="Navbar.handleInboxClick()">Inbox</a>
          </nav>

          <!-- Right: Actions & User Capsule -->
          <div class="apple-nav-actions">
            <!-- Sell Button -->
            <button class="apple-nav-sell-btn" onclick="Navbar.handleSellClick()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span>List Item</span>
            </button>

            <!-- User Profile / Sign In Pill -->
            ${user ? (() => {
              const displayName = (user.full_name && typeof user.full_name === 'string' && user.full_name.trim()) 
                ? user.full_name.trim() 
                : ((user.name && typeof user.name === 'string' && user.name.trim()) 
                    ? user.name.trim() 
                    : (user.email ? user.email.split('@')[0] : 'Student'));
              const shortName = displayName.split(' ')[0] || displayName;
              const avatarInitial = displayName.charAt(0).toUpperCase();

              return `
                <div class="apple-user-menu-wrapper" style="position: relative;">
                  <button class="apple-user-pill" id="apple-user-pill-btn" onclick="Navbar.toggleUserDropdown(event)" aria-haspopup="true" aria-expanded="false" title="Student Account Menu">
                    <div class="apple-avatar-dot">
                      ${avatarInitial}
                    </div>
                    <span class="apple-user-name">${shortName}</span>
                    <span class="apple-user-caret">▾</span>
                  </button>

                  <div class="apple-user-dropdown-menu" id="apple-user-dropdown" style="display: none;">
                    <div class="apple-dropdown-header">
                      <div class="apple-dropdown-avatar">
                        ${avatarInitial}
                      </div>
                      <div class="apple-dropdown-user-info">
                        <div class="apple-dropdown-name">${displayName}</div>
                        <div class="apple-dropdown-email">${user.email || ''}</div>
                        ${user.roll_number ? `<div class="apple-dropdown-meta">Roll: ${user.roll_number}</div>` : ''}
                        <span class="apple-dropdown-verified">✓ Verified GSV Student</span>
                      </div>
                    </div>
                    <div class="apple-dropdown-divider"></div>
                    <div class="apple-dropdown-items">
                      <button class="apple-dropdown-item" onclick="Navbar.closeUserDropdown(); UserProfileModal.open('account');">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        <span>Manage Details & Account</span>
                      </button>
                      <button class="apple-dropdown-item" onclick="Navbar.closeUserDropdown(); state.setActiveView('seller-dashboard');">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                        <span>My Active Listings</span>
                      </button>
                      <button class="apple-dropdown-item" onclick="Navbar.closeUserDropdown(); UserProfileModal.open('wishlist');">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        <span>Saved Wishlist</span>
                      </button>
                      <div class="apple-dropdown-divider"></div>
                      <button class="apple-dropdown-item apple-dropdown-logout" onclick="Navbar.closeUserDropdown(); state.logout();">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        <span>Sign Out / Log Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              `;
            })() : `
              <button class="apple-signin-pill" onclick="AuthModal.open('login')">
                Sign In
              </button>
            `}
          </div>
        </div>
      </header>
    `;
  },

  toggleUserDropdown(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const dropdown = document.getElementById('apple-user-dropdown');
    if (!dropdown) return;
    const isVisible = dropdown.style.display === 'block';
    if (isVisible) {
      this.closeUserDropdown();
    } else {
      this.openUserDropdown();
    }
  },

  openUserDropdown() {
    const dropdown = document.getElementById('apple-user-dropdown');
    const pill = document.getElementById('apple-user-pill-btn');
    if (!dropdown) return;
    dropdown.style.display = 'block';
    if (pill) pill.setAttribute('aria-expanded', 'true');
  },

  closeUserDropdown() {
    const dropdown = document.getElementById('apple-user-dropdown');
    const pill = document.getElementById('apple-user-pill-btn');
    if (!dropdown) return;
    dropdown.style.display = 'none';
    if (pill) pill.setAttribute('aria-expanded', 'false');
  },

  handleSellClick() {
    if (!state.currentUser) {
      if (window.AuthModal) AuthModal.open('login');
      return;
    }
    if (window.SellItemModal) SellItemModal.open();
  },

  handleInboxClick() {
    if (!state.currentUser) {
      if (window.AuthModal) AuthModal.open('login');
      return;
    }
    state.setActiveView('inbox');
  },

  handleMobileProfileClick() {
    if (!state.currentUser) {
      if (window.AuthModal) AuthModal.open('login');
      return;
    }
    if (window.UserProfileModal) UserProfileModal.open();
  }
};

// Dismiss dropdown when clicking outside
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('apple-user-dropdown');
  const pill = document.getElementById('apple-user-pill-btn');
  if (dropdown && dropdown.style.display === 'block') {
    if (!dropdown.contains(e.target) && !pill?.contains(e.target)) {
      if (window.Navbar && typeof window.Navbar.closeUserDropdown === 'function') {
        window.Navbar.closeUserDropdown();
      }
    }
  }
});

window.Navbar = Navbar;
