/**
 * CampusCart - Navbar Component
 */
const Navbar = {
  render() {
    const el = document.getElementById('navbar-mount');
    if (!el) return;

    const user = state.currentUser;
    const college = state.selectedCollege;
    const unreadMsgs = state.unreadMessagesCount;

    el.innerHTML = `
      <nav class="navbar">
        <div class="container navbar-inner">
          <!-- Logo & Brand -->
          <div class="flex items-center gap-4">
            <a href="#" class="brand-logo" onclick="event.preventDefault(); state.setActiveView('marketplace');">
              <div class="brand-icon-wrapper">
                ${Icons.shoppingBag("w-6 h-6")}
              </div>
              <span>CampusCart</span>
              <span class="brand-tagline-pill">Pan-India</span>
            </a>

            <!-- Selected College Badge Button -->
            <button class="college-picker-btn" id="nav-college-btn" title="Click to change your university">
              <span class="college-dot"></span>
              <span class="truncate" style="max-width: 170px;">
                ${college ? college.short_name : 'Select Campus'}
              </span>
              ${Icons.chevronDown("w-4 h-4 text-muted")}
            </button>
          </div>

          <!-- Navigation Links -->
          <ul class="nav-links">
            <li>
              <a class="nav-link ${state.activeView === 'marketplace' ? 'active' : ''}" onclick="state.setActiveView('marketplace')">
                Explore
              </a>
            </li>
            <li>
              <a class="nav-link" onclick="document.getElementById('categories-section').scrollIntoView({ behavior: 'smooth' })">
                Categories
              </a>
            </li>
            <li>
              <a class="nav-link ${state.activeView === 'inbox' ? 'active' : ''}" onclick="Navbar.handleInboxClick()">
                ${Icons.messageSquare("w-4 h-4")}
                Inbox
                ${unreadMsgs > 0 ? `<span class="nav-badge">${unreadMsgs}</span>` : ''}
              </a>
            </li>
            ${user ? `
              <li>
                <a class="nav-link ${state.activeView === 'seller-dashboard' ? 'active' : ''}" onclick="state.setActiveView('seller-dashboard')">
                  My Dashboard
                </a>
              </li>
            ` : ''}
            ${user && user.is_admin ? `
              <li>
                <a class="nav-link ${state.activeView === 'admin' ? 'active' : ''}" onclick="state.setActiveView('admin')">
                  Admin Panel
                </a>
              </li>
            ` : ''}
          </ul>

          <!-- Action Buttons -->
          <div class="flex items-center gap-3">
            <!-- Sell Item CTA -->
            <button class="btn btn-sell" onclick="Navbar.handleSellClick()">
              ${Icons.plusCircle("w-4 h-4")}
              Sell an Item
            </button>

            <!-- User Auth / Profile Menu -->
            ${user ? `
              <div class="relative" style="position: relative;">
                <button class="btn btn-secondary btn-sm flex items-center gap-2" id="nav-user-menu-btn" style="border-radius: var(--radius-full); padding: 0.35rem 0.75rem;">
                  <img src="${user.avatar_url}" class="chat-avatar" style="width: 28px; height: 28px;" alt="Avatar" />
                  <span style="font-weight: 600; max-width: 100px;" class="truncate">${user.full_name.split(' ')[0]}</span>
                  ${Icons.chevronDown("w-3 h-3 text-muted")}
                </button>
                <div class="dropdown-menu hidden" id="user-dropdown-menu" style="position: absolute; right: 0; top: 115%; width: 220px; background: white; border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); padding: 0.5rem; z-index: 100;">
                  <div style="padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--color-border); margin-bottom: 0.35rem;">
                    <div style="font-weight: 700; font-size: 0.9rem;">${user.full_name}</div>
                    <div style="font-size: 0.75rem; color: var(--color-text-muted);">${user.email}</div>
                    <div style="font-size: 0.7rem; font-weight: 600; color: var(--color-primary); margin-top: 2px;">${user.college_short_name || 'GSV Vadodara'}</div>
                  </div>
                  <button class="btn btn-ghost w-full justify-start text-sm" style="width: 100%; text-align: left;" onclick="UserProfileModal.open(); Navbar.closeUserMenu();">
                    ${Icons.user("w-4 h-4")} My Profile & Listings
                  </button>
                  <button class="btn btn-ghost w-full justify-start text-sm" style="width: 100%; text-align: left;" onclick="state.setActiveView('seller-dashboard'); Navbar.closeUserMenu();">
                    ${Icons.shoppingBag("w-4 h-4")} Seller Dashboard
                  </button>
                  <button class="btn btn-ghost w-full justify-start text-sm" style="width: 100%; text-align: left;" onclick="Navbar.openWishlistView(); Navbar.closeUserMenu();">
                    ${Icons.heart("w-4 h-4")} Saved Items
                  </button>
                  ${user.is_admin ? `
                    <button class="btn btn-ghost w-full justify-start text-sm" style="width: 100%; text-align: left; color: #2563EB;" onclick="state.setActiveView('admin'); Navbar.closeUserMenu();">
                      ${Icons.shieldCheck("w-4 h-4")} Admin Control Center
                    </button>
                  ` : ''}
                  <div style="border-top: 1px solid var(--color-border); margin-top: 0.35rem; padding-top: 0.35rem;">
                    <button class="btn btn-ghost w-full justify-start text-sm" style="width: 100%; text-align: left; color: #F43F5E;" onclick="Navbar.handleLogout()">
                      ${Icons.logOut("w-4 h-4")} Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ` : `
              <button class="btn btn-primary btn-sm" onclick="AuthModal.open('login')">
                Login / Sign Up
              </button>
            `}
          </div>
        </div>
      </nav>
    `;

    // Attach listeners
    document.getElementById('nav-college-btn')?.addEventListener('click', () => {
      CollegeSelectorModal.open();
    });

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
    // Trigger saved items filter or user profile
    UserProfileModal.open('wishlist');
  }
};
