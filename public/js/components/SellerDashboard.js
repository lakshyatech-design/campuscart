/**
 * CampusCart - Seller Experience & Dashboard Component
 */
const SellerDashboard = {
  myProducts: [],
  activeTab: 'active', // 'active', 'sold', 'all'

  render() {
    const el = document.getElementById('seller-dashboard-mount');
    if (!el) return;

    const user = state.currentUser;
    if (!user) {
      el.innerHTML = `
        <div class="container" style="padding: 4rem 1rem; text-align: center;">
          <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--color-navy); margin-bottom: 0.5rem;">Seller Dashboard</h2>
          <p style="color: var(--color-text-muted); margin-bottom: 1.5rem;">Please sign in to manage your campus listings and transactions.</p>
          <button class="btn btn-primary" onclick="AuthModal.open('login')">Sign In</button>
        </div>
      `;
      return;
    }

    el.innerHTML = `
      <div class="container" style="padding-top: 1.5rem; padding-bottom: 4rem;">
        <!-- Welcome Banner -->
        <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); border-radius: var(--radius-xl); padding: 2rem; color: white; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.25rem;">
          <div>
            <div style="font-size: 0.82rem; font-weight: 700; color: #60A5FA; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.35rem;">
              CampusCart Seller Central
            </div>
            <h1 style="font-size: 1.85rem; font-weight: 800; color: white; margin-bottom: 0.35rem;">
              Welcome back, ${user.full_name}! 👋
            </h1>
            <p style="font-size: 0.9rem; color: #94A3B8;">
              Campus: <strong>${user.college_short_name || 'GSV Vadodara'}</strong> • Student ID: ${user.roll_number || 'Verified'}
            </p>
          </div>

          <div class="flex items-center gap-3">
            <button class="btn btn-sell" onclick="SellItemModal.open()">
              ${Icons.plusCircle("w-4 h-4")}
              Add New Product
            </button>
            <button class="btn btn-secondary btn-sm" onclick="state.setActiveView('inbox')">
              ${Icons.messageSquare("w-4 h-4")}
              My Inbox
            </button>
          </div>
        </div>

        <!-- Metric Statistics Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 1.25rem; margin-bottom: 2.5rem;" id="seller-stats-mount">
          <!-- Rendered below -->
        </div>

        <!-- Listings Management Tabs -->
        <div style="background: white; border: 1px solid var(--color-border); border-radius: var(--radius-xl); padding: 1.5rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: 1rem; margin-bottom: 1.5rem;">
            <div class="flex items-center gap-2">
              <button class="btn btn-sm ${this.activeTab === 'active' ? 'btn-primary' : 'btn-ghost'}" onclick="SellerDashboard.switchTab('active')">
                Active Listings
              </button>
              <button class="btn btn-sm ${this.activeTab === 'sold' ? 'btn-primary' : 'btn-ghost'}" onclick="SellerDashboard.switchTab('sold')">
                Sold Items
              </button>
              <button class="btn btn-sm ${this.activeTab === 'all' ? 'btn-primary' : 'btn-ghost'}" onclick="SellerDashboard.switchTab('all')">
                All Listings
              </button>
            </div>
          </div>

          <!-- Listings Table / Grid -->
          <div id="seller-listings-mount">
            <!-- Rendered below -->
          </div>
        </div>
      </div>
    `;

    this.loadSellerData();
  },

  async loadSellerData() {
    if (!state.currentUser) return;

    try {
      const res = await API.getProducts({ sellerId: state.currentUser.id });
      this.myProducts = res.products || [];
      this.renderStats();
      this.renderListings();
    } catch (err) {
      console.error('Failed to load seller listings:', err);
    }
  },

  renderStats() {
    const statsMount = document.getElementById('seller-stats-mount');
    if (!statsMount) return;

    const activeCount = this.myProducts.filter(p => p.status === 'active').length;
    const soldCount = this.myProducts.filter(p => p.status === 'sold').length;
    const totalViews = this.myProducts.reduce((sum, p) => sum + (p.views_count || 0), 0);

    statsMount.innerHTML = `
      <div style="background: white; border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.25rem; box-shadow: var(--shadow-sm);">
        <div style="font-size: 0.8rem; font-weight: 600; color: var(--color-text-muted); margin-bottom: 0.25rem;">Active Listings</div>
        <div style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: var(--color-primary);">${activeCount}</div>
        <div style="font-size: 0.72rem; color: var(--color-accent-emerald); font-weight: 600; margin-top: 0.2rem;">● Visible to buyers</div>
      </div>

      <div style="background: white; border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.25rem; box-shadow: var(--shadow-sm);">
        <div style="font-size: 0.8rem; font-weight: 600; color: var(--color-text-muted); margin-bottom: 0.25rem;">Sold Items</div>
        <div style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: var(--color-navy);">${soldCount}</div>
        <div style="font-size: 0.72rem; color: var(--color-text-muted); margin-top: 0.2rem;">Successful campus deals</div>
      </div>

      <div style="background: white; border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.25rem; box-shadow: var(--shadow-sm);">
        <div style="font-size: 0.8rem; font-weight: 600; color: var(--color-text-muted); margin-bottom: 0.25rem;">Total Views</div>
        <div style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: #D97706;">${totalViews}</div>
        <div style="font-size: 0.72rem; color: var(--color-text-muted); margin-top: 0.2rem;">Student impressions</div>
      </div>

      <div style="background: white; border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.25rem; box-shadow: var(--shadow-sm);">
        <div style="font-size: 0.8rem; font-weight: 600; color: var(--color-text-muted); margin-bottom: 0.25rem;">Inquiries</div>
        <div style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: var(--color-accent-emerald);">
          ${state.unreadMessagesCount > 0 ? state.unreadMessagesCount + ' New' : 'Active'}
        </div>
        <div style="font-size: 0.72rem; color: var(--color-primary); cursor: pointer; margin-top: 0.2rem;" onclick="state.setActiveView('inbox')">
          Open conversations →
        </div>
      </div>
    `;
  },

  renderListings() {
    const mount = document.getElementById('seller-listings-mount');
    if (!mount) return;

    let filtered = this.myProducts;
    if (this.activeTab === 'active') {
      filtered = this.myProducts.filter(p => p.status === 'active');
    } else if (this.activeTab === 'sold') {
      filtered = this.myProducts.filter(p => p.status === 'sold');
    }

    if (filtered.length === 0) {
      mount.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--color-text-muted);">
          <div style="width: 56px; height: 56px; margin: 0 auto 1rem; border-radius: 50%; background: #F1F5F9; display: flex; align-items: center; justify-content: center;">
            ${Icons.tag("w-6 h-6")}
          </div>
          <p style="font-weight: 700; font-size: 1.1rem; color: var(--color-navy); margin-bottom: 0.35rem;">No ${this.activeTab} products found</p>
          <p style="font-size: 0.85rem; margin-bottom: 1.25rem;">Ready to sell textbooks, cycles, perfumes or hostel essentials?</p>
          <button class="btn btn-primary btn-sm" onclick="SellItemModal.open()">
            ${Icons.plusCircle("w-4 h-4")}
            Post an Item Now
          </button>
        </div>
      `;
      return;
    }

    mount.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${filtered.map(p => {
          const firstImg = p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200';
          const isSold = p.status === 'sold';

          return `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-lg); flex-wrap: wrap; gap: 1rem; transition: background var(--transition-fast);">
              <div style="display: flex; align-items: center; gap: 1rem; min-width: 260px;">
                <img src="${firstImg}" style="width: 70px; height: 70px; border-radius: var(--radius-md); object-fit: cover; border: 1px solid var(--color-border);" alt="${p.title}" />
                <div>
                  <div style="font-weight: 700; font-size: 1rem; color: var(--color-navy); margin-bottom: 0.2rem;">
                    ${p.title}
                  </div>
                  <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: var(--color-text-muted);">
                    <strong style="color: var(--color-navy); font-size: 0.95rem;">₹${p.price.toLocaleString('en-IN')}</strong>
                    <span>•</span>
                    <span>${p.category}</span>
                    <span>•</span>
                    <span style="font-weight: 700; color: ${isSold ? '#EF4444' : '#10B981'};">
                      ${isSold ? 'Sold' : 'Active'}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Action Controls -->
              <div class="flex items-center gap-2">
                <button class="btn btn-secondary btn-sm" onclick="ProductDetailModal.open('${p.id}')">
                  Preview
                </button>
                <button class="btn btn-secondary btn-sm" onclick="SellItemModal.open('${p.id}')">
                  ${Icons.edit("w-4 h-4")}
                  Edit
                </button>
                <button class="btn btn-sm ${isSold ? 'btn-outline' : 'btn-secondary'}" onclick="SellerDashboard.handleToggleSold('${p.id}')">
                  ${isSold ? 'Relist as Active' : 'Mark as Sold'}
                </button>
                <button class="btn btn-ghost btn-sm" style="color: #EF4444;" onclick="SellerDashboard.handleDeleteProduct('${p.id}')">
                  ${Icons.trash("w-4 h-4")}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  switchTab(tab) {
    this.activeTab = tab;
    this.render();
  },

  async handleToggleSold(productId) {
    try {
      const res = await API.markAsSold(productId);
      showToast(res.message, 'success');
      this.loadSellerData();
      Marketplace.loadProducts();
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async handleDeleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this listing from CampusCart?')) return;
    try {
      await API.deleteProduct(productId);
      showToast('Product listing removed successfully', 'success');
      this.loadSellerData();
      Marketplace.loadProducts();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }
};
