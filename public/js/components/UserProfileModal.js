/**
 * CampusCart - User Profile Modal Component
 */
const UserProfileModal = {
  activeTab: 'listings', // 'listings', 'wishlist'
  wishlistItems: [],

  open(initialTab = 'listings') {
    this.activeTab = initialTab;
    let modalEl = document.getElementById('user-profile-modal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'user-profile-modal';
      modalEl.className = 'modal-overlay';
      document.body.appendChild(modalEl);
    }

    modalEl.classList.add('open');
    this.render();
    this.loadUserData();
  },

  close() {
    const modalEl = document.getElementById('user-profile-modal');
    if (modalEl) modalEl.classList.remove('open'); modalEl.style.display = 'none';
  },

  async loadUserData() {
    try {
      const res = await API.getWishlist();
      this.wishlistItems = res.wishlist || [];
      state.setWishlist(this.wishlistItems);
      this.render();
    } catch (e) {
      //
    }
  },

  render() {
    const user = state.currentUser;
    if (!user) return;

    const modalEl = document.getElementById('user-profile-modal');

    modalEl.innerHTML = `
      <div class="modal-content" style="max-width: 760px;">
        <div class="modal-header">
          <h3 class="modal-title">Student Profile & Activity</h3>
          <button class="modal-close-btn" onclick="UserProfileModal.close()">
            ${Icons.x("w-5 h-5")}
          </button>
        </div>

        <div class="modal-body">
          <!-- Profile Header Card -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.5rem; background: var(--surface-raised); border: 1px solid var(--border); border-radius: var(--radius-lg); margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; align-items: center; gap: 1.25rem;">
              <img src="${user.avatar_url}" style="width: 72px; height: 72px; border-radius: 50%; border: 2px solid var(--accent); box-shadow: var(--shadow-sm);" alt="${user.full_name}" />
              <div>
                <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
                  ${user.full_name}
                  <span style="font-size: 0.72rem; font-weight: 700; background: var(--accent-glow); color: var(--accent); border: 1px solid var(--border-accent); padding: 0.15rem 0.5rem; border-radius: var(--radius-full);">
                    Verified Student
                  </span>
                </h2>
                <div style="font-size: 0.85rem; color: var(--color-text-muted); margin-top: 2px;">
                  ${user.college_name || 'Gati Shakti Vishwavidyalaya (GSV)'}
                </div>
                <div style="font-size: 0.8rem; color: var(--color-text-subtle); margin-top: 2px;">
                  Roll Number: <strong>${user.roll_number || 'GSV-STUDENT'}</strong> • Student Email: ${user.email}
                </div>
              </div>
            </div>

            <div>
              <button class="btn btn-sell btn-sm" onclick="UserProfileModal.close(); SellItemModal.open();">
                ${Icons.plusCircle("w-4 h-4")}
                Sell Item
              </button>
            </div>
          </div>

          <!-- Tabs -->
          <div style="display: flex; gap: 0.5rem; border-bottom: 1px solid var(--color-border); margin-bottom: 1.5rem;">
            <button class="btn btn-sm ${this.activeTab === 'listings' ? 'btn-primary' : 'btn-ghost'}" onclick="UserProfileModal.switchTab('listings')">
              My Active Listings
            </button>
            <button class="btn btn-sm ${this.activeTab === 'wishlist' ? 'btn-primary' : 'btn-ghost'}" onclick="UserProfileModal.switchTab('wishlist')">
              Saved Wishlist (${this.wishlistItems.length})
            </button>
          </div>

          <!-- Tab Contents -->
          <div id="profile-tab-content">
            ${this.activeTab === 'listings' ? `
              <div>
                <p style="font-size: 0.88rem; color: var(--color-text-muted); margin-bottom: 1rem;">
                  You can manage your products, mark items as sold, or view analytics on the dedicated Seller Dashboard.
                </p>
                <button class="btn btn-primary btn-sm" onclick="UserProfileModal.close(); state.setActiveView('seller-dashboard');">
                  Open Seller Central Dashboard →
                </button>
              </div>
            ` : `
              <div>
                ${this.wishlistItems.length === 0 ? `
                  <div style="text-align: center; padding: 2.5rem 1rem; color: var(--color-text-muted);">
                    ${Icons.heart("w-8 h-8")}
                    <p style="font-weight: 600; margin-top: 0.5rem;">Your wishlist is empty</p>
                    <p style="font-size: 0.82rem;">Click the heart icon on any product to save it here for later.</p>
                  </div>
                ` : `
                  <div style="display: flex; flex-direction: column; gap: 0.75rem; max-height: 360px; overflow-y: auto;">
                    ${this.wishlistItems.map(p => `
                      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-md);">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                          <img src="${p.images[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100'}" style="width: 50px; height: 50px; border-radius: 6px; object-fit: cover;" alt="${p.title}" />
                          <div>
                            <div style="font-weight: 700; font-size: 0.9rem; color: var(--color-navy);">${p.title}</div>
                            <div style="font-size: 0.8rem; color: var(--color-text-muted);">₹${p.price.toLocaleString('en-IN')} • ${p.college_short_name}</div>
                          </div>
                        </div>
                        <div class="flex items-center gap-2">
                          <button class="btn btn-secondary btn-sm" onclick="UserProfileModal.close(); ProductDetailModal.open('${p.id}')">
                            View
                          </button>
                          <button class="btn btn-ghost btn-sm" style="color: #EF4444;" onclick="UserProfileModal.removeWishlistItem('${p.id}')">
                            Remove
                          </button>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                `}
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  },

  switchTab(tab) {
    this.activeTab = tab;
    this.render();
  },

  async removeWishlistItem(productId) {
    try {
      await API.toggleWishlist(productId);
      this.wishlistItems = this.wishlistItems.filter(p => p.id !== productId);
      state.toggleWishlistId(productId, false);
      this.render();
      Marketplace.renderProductsList();
    } catch (e) {
      //
    }
  }
};

window.UserProfileModal = UserProfileModal;
