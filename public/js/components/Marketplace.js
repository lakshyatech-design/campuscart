/**
 * CampusCart - Master Rebuilt Marketplace Feed
 */
const Marketplace = {
  products: [],
  isLoading: false,

  render() {
    const el = document.getElementById('marketplace-mount');
    if (!el) return;

    const currentCollege = state.selectedCollege;

    el.innerHTML = `
      <section id="marketplace-section" class="container" style="padding-top: 1rem; padding-bottom: 5rem;">
        
        <!-- Mobile Search & Filter Toolbar -->
        <div class="mobile-filter-toolbar">
          <div class="search-input-wrap" style="flex-grow: 1;">
            ${Icons.search("w-4 h-4")}
            <input 
              type="text" 
              class="input-field" 
              id="mobile-search-input" 
              placeholder="Search campus listings..." 
              value="${state.searchQuery}"
              oninput="Marketplace.handleMobileSearch(this.value)"
            />
          </div>
          <button class="mobile-filter-btn" onclick="Marketplace.openMobileFilter()">
            ${Icons.filter("w-4 h-4 text-primary")}
            <span>Filters</span>
            ${(state.activeCategory !== 'All' || state.conditionFilter !== 'All' || state.priceRange.min > 0 || state.priceRange.max < 20000) ? `
              <span class="mobile-filter-badge">●</span>
            ` : ''}
          </button>
        </div>

        <!-- Filter Header Bar -->
        <div class="marketplace-filter-header-bar" style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1rem 1.25rem; margin-bottom: 1.5rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem;">
          <div class="flex items-center gap-3">
            <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--ink-display);">
              ${state.activeCategory === 'All' ? 'Campus Marketplace' : state.activeCategory}
            </h2>
          </div>

          <!-- Sort dropdown & Quick Count -->
          <div class="flex items-center gap-4">
            <span style="font-size: 0.85rem; color: var(--ink-muted);" id="product-count-label">
              Loading listings...
            </span>
            <div class="flex items-center gap-2">
              <span style="font-size: 0.85rem; font-weight: 600; color: var(--ink-secondary);">Sort by:</span>
              <select class="input-field input-plain" id="marketplace-sort-select" style="width: auto; padding: 0.45rem 1.75rem 0.45rem 0.75rem; border-radius: var(--radius-md);" onchange="Marketplace.handleSortChange(this.value)">
                <option value="latest" ${state.sortBy === 'latest' ? 'selected' : ''}>Recently Added</option>
                <option value="price_asc" ${state.sortBy === 'price_asc' ? 'selected' : ''}>Price: Low to High</option>
                <option value="price_desc" ${state.sortBy === 'price_desc' ? 'selected' : ''}>Price: High to Low</option>
                <option value="popular" ${state.sortBy === 'popular' ? 'selected' : ''}>Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        <div class="marketplace-layout">
          <!-- Sidebar Filters -->
          <aside class="filter-card filter-card-desktop">
            <div class="filter-header">
              <span class="filter-title">
                ${Icons.filter("w-4 h-4 text-primary")}
                Filters
              </span>
              <button class="btn btn-ghost btn-sm" onclick="Marketplace.resetFilters()" style="color: var(--cobalt); font-size: 0.78rem;">
                Reset All
              </button>
            </div>

            <!-- Search Field -->
            <div class="filter-group">
              <label class="filter-label">Search Keywords</label>
              <div class="search-input-wrap">
                ${Icons.search("w-4 h-4")}
                <input 
                  type="text" 
                  class="input-field" 
                  id="marketplace-search-input" 
                  placeholder="Search for anything..." 
                  value="${state.searchQuery}"
                />
              </div>
            </div>

            <!-- Category Filter Dropdown -->
            <div class="filter-group">
              <label class="filter-label">Category</label>
              <select class="input-field input-plain" id="marketplace-cat-select" onchange="Marketplace.handleCategoryChange(this.value)">
                <option value="All" ${state.activeCategory === 'All' ? 'selected' : ''}>All Categories</option>
                ${CATEGORIES.map(c => `
                  <option value="${c.id}" ${state.activeCategory === c.id ? 'selected' : ''}>${c.name}</option>
                `).join('')}
              </select>
            </div>

            <!-- Price Range -->
            <div class="filter-group">
              <label class="filter-label">Price Range (₹)</label>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.6rem;">
                <input type="number" id="filter-min-price" class="input-field input-plain" placeholder="Min ₹" value="${state.priceRange.min || ''}" />
                <input type="number" id="filter-max-price" class="input-field input-plain" placeholder="Max ₹" value="${state.priceRange.max < 20000 ? state.priceRange.max : ''}" />
              </div>
              <button class="btn btn-secondary btn-sm w-full" style="width: 100%;" onclick="Marketplace.applyPriceFilter()">
                Apply Price
              </button>
            </div>

            <!-- Condition Filter -->
            <div class="filter-group">
              <label class="filter-label">Condition</label>
              <div style="display: flex; flex-direction: column; gap: 0.4rem;">
                ${['All', 'Brand New', 'Like New', 'Good', 'Fair'].map(cond => `
                  <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--ink-primary); cursor: pointer;">
                    <input type="radio" name="filter-condition" value="${cond}" ${state.conditionFilter === cond ? 'checked' : ''} onchange="Marketplace.handleConditionChange('${cond}')" />
                    <span>${cond === 'All' ? 'Any Condition' : cond}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          </aside>

          <!-- Main Listings Grid -->
          <main>
            <div id="products-grid-mount" class="products-grid">
              <!-- Rendered dynamically -->
            </div>
          </main>
        </div>
      </section>
    `;

    const searchInput = document.getElementById('marketplace-search-input');
    if (searchInput) {
      let debounceTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          state.setSearchQuery(e.target.value.trim());
          Marketplace.loadProducts();
        }, 300);
      });
    }

    this.loadProducts();
  },

  async loadProducts() {
    this.isLoading = true;
    const gridEl = document.getElementById('products-grid-mount');
    if (gridEl) {
      gridEl.innerHTML = Array(6).fill(0).map(() => `
        <div class="product-card" style="opacity: 0.6;">
          <div class="product-image-container" style="background: #E2E8F0; animation: pulse 1.5s infinite;"></div>
          <div class="product-details">
            <div style="height: 20px; background: #E2E8F0; margin-bottom: 8px; border-radius: 4px;"></div>
            <div style="height: 16px; background: #E2E8F0; width: 60%; border-radius: 4px;"></div>
          </div>
        </div>
      `).join('');
    }

    try {
      const params = {
        category: state.activeCategory,
        q: state.searchQuery,
        minPrice: state.priceRange.min > 0 ? state.priceRange.min : null,
        maxPrice: state.priceRange.max < 20000 ? state.priceRange.max : null,
        condition: state.conditionFilter,
        sort: state.sortBy,
        exploreAll: state.exploreAllColleges,
        collegeId: state.selectedCollege ? state.selectedCollege.id : null
      };

      const res = await API.getProducts(params);
      this.products = res.products || [];
      this.renderProductsList();
    } catch (err) {
      console.error('Failed to load products:', err);
      if (gridEl) {
        gridEl.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
            <p style="color: var(--rose); font-weight: 600;">Failed to load marketplace listings.</p>
            <button class="btn btn-secondary btn-sm" style="margin-top: 1rem;" onclick="Marketplace.loadProducts()">Try Again</button>
          </div>
        `;
      }
    } finally {
      this.isLoading = false;
    }
  },

  renderProductsList() {
    const gridEl = document.getElementById('products-grid-mount');
    const countLabel = document.getElementById('product-count-label');
    if (!gridEl) return;

    if (countLabel) {
      countLabel.textContent = `${this.products.length} listing${this.products.length === 1 ? '' : 's'} found`;
    }

    if (this.products.length === 0) {
      gridEl.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4.5rem 1.5rem; background: var(--surface-raised); border: 1px dashed var(--border-accent); border-radius: var(--radius-lg);">
          <div style="width: 64px; height: 64px; margin: 0 auto 1.25rem; border-radius: 50%; background: var(--surface); border: 1px solid var(--border-accent); color: var(--accent); display: flex; align-items: center; justify-content: center;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          </div>
          <h3 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem;">Campus Marketplace</h3>
          <p style="font-size: 0.9rem; color: var(--text-muted); max-width: 440px; margin: 0 auto 1.75rem; line-height: 1.5;">
            No matching listings found. List your textbooks, cycles, railway tickets, or hostel essentials now.
          </p>
          <div style="display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap;">
            <button class="btn btn-secondary btn-sm" onclick="Marketplace.resetFilters()">
              Clear Filters
            </button>
            <button class="btn btn-primary btn-sm" onclick="Navbar.handleSellClick()">
              ${Icons.plusCircle("w-4 h-4")}
              + List an Item
            </button>
          </div>
        </div>
      `;
      return;
    }

    gridEl.innerHTML = this.products.map(p => {
      const isFav = state.wishlistIds.has(p.id);
      let firstImg = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600';
      if (Array.isArray(p.images) && p.images.length > 0) {
        firstImg = p.images[0];
      } else if (typeof p.images === 'string') {
        try {
          const parsed = JSON.parse(p.images);
          if (Array.isArray(parsed) && parsed.length > 0) firstImg = parsed[0];
          else if (p.images.startsWith('http')) firstImg = p.images;
        } catch (e) {
          if (p.images.startsWith('http')) firstImg = p.images;
        }
      }
      const isSpecialTicket = p.category === 'Railway Tickets';

      return `
        <div class="product-card tilt-card" onclick="ProductDetailModal.open('${p.id}')" style="cursor: pointer;">
          <div class="specular-glare"></div>
          
          <!-- Image Viewport -->
          <div class="product-image-container">
            <img src="${firstImg}" alt="${p.title}" class="product-img" loading="lazy" />
            <span class="product-badge-condition">${p.condition}</span>
            <button 
              class="product-wishlist-btn ${isFav ? 'active' : ''}" 
              title="Save item" 
              onclick="event.stopPropagation(); Marketplace.toggleWishlist('${p.id}')"
            >
              ${Icons.heart("w-4 h-4", isFav)}
            </button>
          </div>

          <!-- Product Details -->
          <div class="product-details">
            <div class="product-price-row">
              <span class="product-price tabular-nums">₹${p.price.toLocaleString('en-IN')}</span>
              <span class="product-category-tag">${p.category}</span>
            </div>

            <h3 class="product-title">
              ${p.title}
            </h3>

            <!-- Railway Ticket Pass Route -->
            ${isSpecialTicket && p.dynamic_attributes ? `
              <div style="font-size: 0.74rem; background: #FFFBEB; border: 1px solid #FDE68A; color: #92400E; padding: 0.25rem 0.5rem; border-radius: 4px; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.35rem;">
                ${Icons.train("w-3 h-3")}
                <span>${p.dynamic_attributes.from_station || 'Vadodara'} ➔ ${p.dynamic_attributes.to_station || 'Destination'}</span>
              </div>
            ` : ''}

            <!-- Campus Location -->
            <div class="product-meta-row">
              <div class="product-college-badge">
                ${Icons.mapPin("w-3 h-3 text-muted")}
                <span>${p.campus_location || 'Campus Handover'}</span>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="product-actions">
              <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); ProductDetailModal.open('${p.id}')">
                Details
              </button>
              <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); Marketplace.handleContactSeller('${p.id}', '${p.seller_id}')">
                ${Icons.messageSquare("w-3 h-3")}
                Chat
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.Interactions && Interactions.init3DTilt) {
      Interactions.init3DTilt();
    }
  },

  handleMobileSearch(val) {
    state.setSearchQuery(val.trim());
    clearTimeout(this._searchTimer);
    this._searchTimer = setTimeout(() => this.loadProducts(), 300);
  },

  openMobileFilter() {
    let sheet = document.getElementById('mobile-filter-modal');
    if (!sheet) {
      sheet = document.createElement('div');
      sheet.id = 'mobile-filter-modal';
      sheet.className = 'modal-overlay';
      document.body.appendChild(sheet);
    }
    sheet.innerHTML = `
      <div class="modal-content" style="max-width: 480px;">
        <div class="modal-grab-bar"></div>
        <div class="modal-header">
          <h3 class="modal-title flex items-center gap-2">
            ${Icons.filter("w-5 h-5 text-primary")} Filter Listings
          </h3>
          <button class="modal-close-btn" onclick="Marketplace.closeMobileFilter()">
            ${Icons.x("w-5 h-5")}
          </button>
        </div>
        <div class="modal-body">
          <div class="filter-group">
            <label class="filter-label">Category</label>
            <select class="input-field input-plain" id="mob-filter-cat" onchange="state.setActiveCategory(this.value); Marketplace.loadProducts();">
              <option value="All" ${state.activeCategory === 'All' ? 'selected' : ''}>All Categories</option>
              ${CATEGORIES.map(c => `<option value="${c.id}" ${state.activeCategory === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">Price Range (₹)</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.5rem;">
              <input type="number" id="mob-filter-min" class="input-field input-plain" placeholder="Min ₹" value="${state.priceRange.min || ''}" />
              <input type="number" id="mob-filter-max" class="input-field input-plain" placeholder="Max ₹" value="${state.priceRange.max < 20000 ? state.priceRange.max : ''}" />
            </div>
            <div style="display: flex; gap: 0.4rem; overflow-x: auto; padding: 0.25rem 0;">
              <button class="quick-chip" onclick="document.getElementById('mob-filter-max').value = '500';">Under ₹500</button>
              <button class="quick-chip" onclick="document.getElementById('mob-filter-min').value = '500'; document.getElementById('mob-filter-max').value = '2000';">₹500 - ₹2k</button>
              <button class="quick-chip" onclick="document.getElementById('mob-filter-min').value = '2000'; document.getElementById('mob-filter-max').value = '10000';">₹2k - ₹10k</button>
            </div>
          </div>

          <div class="filter-group">
            <label class="filter-label">Condition</label>
            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
              ${['All', 'Brand New', 'Like New', 'Good', 'Fair'].map(cond => `
                <button class="quick-chip ${state.conditionFilter === cond ? 'active' : ''}" style="${state.conditionFilter === cond ? 'background: var(--cobalt); color: white; border-color: var(--cobalt);' : ''}" onclick="state.setConditionFilter('${cond}'); Marketplace.loadProducts(); Marketplace.openMobileFilter();">
                  ${cond}
                </button>
              `).join('')}
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
            <button class="btn btn-secondary w-full" onclick="Marketplace.resetFilters(); Marketplace.closeMobileFilter();">
              Reset
            </button>
            <button class="btn btn-primary w-full" onclick="
              const min = Number(document.getElementById('mob-filter-min').value) || 0;
              const max = Number(document.getElementById('mob-filter-max').value) || 20000;
              state.setPriceRange(min, max);
              Marketplace.loadProducts();
              Marketplace.closeMobileFilter();
            ">
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    `;
    sheet.classList.add('open');
  },

  closeMobileFilter() {
    const sheet = document.getElementById('mobile-filter-modal');
    if (sheet) sheet.classList.remove('open');
  },

  async toggleWishlist(productId) {
    if (!state.currentUser) {
      showToast('Please sign in to save favorite items', 'info');
      AuthModal.open('login');
      return;
    }

    try {
      const res = await API.toggleWishlist(productId);
      state.toggleWishlistId(productId, res.isFavorited);
      showToast(res.message, 'success');
      this.renderProductsList();
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  handleContactSeller(productId, sellerId) {
    if (!state.currentUser) {
      showToast('Please sign in to message this student seller', 'info');
      AuthModal.open('login');
      return;
    }

    if (state.currentUser.id === sellerId) {
      showToast('This is your own listing! You can manage it from Seller Dashboard.', 'info');
      state.setActiveView('seller-dashboard');
      return;
    }

    API.startConversation(productId)
      .then(res => {
        state.activeConversationId = res.conversation.id;
        state.setActiveView('inbox');
      })
      .catch(err => {
        showToast(err.message, 'error');
      });
  },

  handleSortChange(val) {
    state.setSortBy(val);
    this.loadProducts();
  },

  handleCategoryChange(val) {
    state.setActiveCategory(val);
    PopularCategories.render();
    this.loadProducts();
  },

  handleConditionChange(val) {
    state.setConditionFilter(val);
    this.loadProducts();
  },

  applyPriceFilter() {
    const min = Number(document.getElementById('filter-min-price').value) || 0;
    const max = Number(document.getElementById('filter-max-price').value) || 20000;
    state.setPriceRange(min, max);
    this.loadProducts();
  },

  resetFilters() {
    state.setActiveCategory('All');
    state.setSearchQuery('');
    state.setPriceRange(0, 20000);
    state.setConditionFilter('All');
    state.setSortBy('latest');

    const searchInput = document.getElementById('marketplace-search-input');
    if (searchInput) searchInput.value = '';
    const minInput = document.getElementById('filter-min-price');
    if (minInput) minInput.value = '';
    const maxInput = document.getElementById('filter-max-price');
    if (maxInput) maxInput.value = '';

    PopularCategories.render();
    this.render();
  }
};

window.Marketplace = Marketplace;
