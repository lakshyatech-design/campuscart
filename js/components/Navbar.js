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
            ${user ? `
              <div class="apple-user-pill" onclick="UserProfileModal.open()">
                <div class="apple-avatar-dot">
                  ${(user.name && typeof user.name === 'string') ? user.name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
                </div>
                <span class="apple-user-name">${(user.name && typeof user.name === 'string' && user.name.trim()) ? user.name.trim().split(' ')[0] : (user.email ? user.email.split('@')[0] : 'Student')}</span>
                <span class="apple-user-caret">▾</span>
              </div>
            ` : `
              <button class="apple-signin-pill" onclick="AuthModal.open('login')">
                Sign In
              </button>
            `}
          </div>
        </div>
      </header>
    `;
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

window.Navbar = Navbar;
