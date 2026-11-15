/**
 * CampusCart - Buyer Experience & Marketplace Feed
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
        <!-- Filter Header Bar -->
        <div style="background: white; border: 1px solid var(--color-border); border-radius: var(--radius-xl); padding: 1.25rem 1.5rem; margin-bottom: 2rem; box-shadow: var(--shadow-sm); display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem;">
          <div class="flex items-center gap-3">
            <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--color-navy);">
              ${state.activeCategory === 'All' ? 'Campus Marketplace' : state.activeCategory}
            </h2>
            <span class="product-category-tag" style="font-size: 0.8rem;">
              ${state.exploreAllColleges ? 'All Campuses (India)' : (currentCollege ? currentCollege.short_name : 'GSV Vadodara')}
            </span>
          </div>

          <!-- Sort dropdown & Quick Count -->
          <div class="flex items-center gap-4">
            <span style="font-size: 0.85rem; color: var(--color-text-muted);" id="product-count-label">
              Loading listings...
            </span>
            <div class="flex items-center gap-2">
              <span style="font-size: 0.85rem; font-weight: 600; color: var(--color-text-muted);">Sort by:</span>
              <select class="input-field input-plain" id="marketplace-sort-select" style="width: auto; padding: 0.45rem 1.75rem 0.45rem 0.75rem; border-radius: var(--radius-md);" onchange="Marketplace.handleSortChange(this.value)">
                <option value="latest" ${state.sortBy === 'latest' ? 'selected' : ''}>Recently Added</option>
                <option value="price_asc" ${state.sortBy === 'price_asc' ? 'selected' : ''}>Price: Low to High</option>
                <option value="price_desc" ${state.sortBy === 'price_desc' ? 'selected' : ''}>Price: High to Low</option>
                <option value="popular" ${state.sortBy === 'popular' ? 'selected' : ''}>Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        
        <!-- Mobile Search & Filter Toolbar -->
        <div class="mobile-filter-toolbar">
          <div class="search-input-wrap" style="flex-grow: 1;">
            ${Icons.search("w-4 h-4")}
            <input 
              type="text" 
              class="input-field" 
              id="mobile-search-input" 
              placeholder="Search ${currentCollege ? currentCollege.short_name : 'campus'} listings..." 
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

        <div class="marketplace-layout">
          <!-- Sidebar Filters -->
          <aside class="filter-card filter-card-desktop">
            <div class="filter-header">
              <span class="filter-title">
                ${Icons.filter("w-4 h-4 text-primary")}
                Filters
              </span>
              <button class="btn btn-ghost btn-sm" onclick="Marketplace.resetFilters()" style="color: var(--color-primary); font-size: 0.78rem;">
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
                  <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--color-navy); cursor: pointer;">
                    <input type="radio" name="filter-condition" value="${cond}" ${state.conditionFilter === cond ? 'checked' : ''} onchange="Marketplace.handleConditionChange('${cond}')" />
                    <span>${cond === 'All' ? 'Any Condition' : cond}</span>
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- Campus Filter Notice -->
            <div style="margin-top: 1.5rem; padding: 0.85rem; background: #F8FAFC; border-radius: var(--radius-md); font-size: 0.78rem; color: var(--color-text-muted);">
              <div style="font-weight: 700; color: var(--color-navy); margin-bottom: 0.2rem;">Showing Campus:</div>
              <div>${state.exploreAllColleges ? 'All Campuses' : (currentCollege ? currentCollege.name : 'GSV Vadodara')}</div>
              <a href="#" onclick="event.preventDefault(); CollegeSelectorModal.open();" style="color: var(--color-primary); font-weight: 600; display: inline-block; margin-top: 0.35rem;">
                Change Campus →
              </a>
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

    // Search input listener
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
            <p style="color: var(--color-accent-rose); font-weight: 600;">Failed to load marketplace listings.</p>
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
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: white; border: 1px dashed var(--color-border); border-radius: var(--radius-xl);">
          <div style="width: 64px; height: 64px; margin: 0 auto 1.25rem; border-radius: 50%; background: #EFF6FF; color: var(--color-primary); display: flex; align-items: center; justify-content: center;">
            ${Icons.search("w-8 h-8")}
          </div>
          <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--color-navy); margin-bottom: 0.4rem;">No student listings found</h3>
          <p style="font-size: 0.9rem; color: var(--color-text-muted); max-width: 420px; margin: 0 auto 1.5rem;">
            Try adjusting your search keywords, clear category filters, or toggle "Explore All Campuses" to see items across other universities.
          </p>
          <div class="flex justify-center gap-3">
            <button class="btn btn-secondary btn-sm" onclick="Marketplace.resetFilters()">
              Clear Filters
            </button>
            <button class="btn btn-primary btn-sm" onclick="Navbar.handleSellClick()">
              ${Icons.plusCircle("w-4 h-4")}
              Be the first to list here
            </button>
          </div>
        </div>
      `;
      return;
    }

    gridEl.innerHTML = this.products.map(p => {
      const isFav = state.wishlistIds.has(p.id);
      const firstImg = p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600';
      const isSpecialTicket = p.category === 'Railway Tickets';

      return `
        <div class="product-card tilt-card">
          <div class="specular-glare"></div>
          <!-- Thumbnail & Badges -->
          <div class="product-image-container" onclick="ProductDetailModal.open('${p.id}')" style="cursor: pointer;">
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

            <h3 class="product-title" onclick="ProductDetailModal.open('${p.id}')" style="cursor: pointer;">
              ${p.title}
            </h3>

            <!-- Dynamic Category Specific Preview -->
            ${isSpecialTicket && p.dynamic_attributes ? `
              <div style="font-size: 0.74rem; background: #FFFBEB; border: 1px solid #FDE68A; color: #92400E; padding: 0.25rem 0.5rem; border-radius: 4px; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.35rem;">
                ${Icons.train("w-3 h-3")}
                <span>${p.dynamic_attributes.from_station || 'Vadodara'} → ${p.dynamic_attributes.to_station || 'Destination'}</span>
              </div>
            ` : ''}

            <!-- Seller & Campus Meta -->
            <div class="product-meta-row">
              <div class="product-college-badge" title="${p.college_name}">
                ${Icons.mapPin("w-3 h-3 text-muted")}
                <span>${p.college_short_name}</span>
              </div>
              <span style="font-size: 0.75rem; color: var(--color-text-muted);">
                ${p.campus_location || 'Campus'}
              </span>
            </div>

            <!-- Action buttons -->
            <div class="product-actions">
              <button class="btn btn-secondary btn-sm" onclick="ProductDetailModal.open('${p.id}')">
                View Details
              </button>
              <button class="btn btn-primary btn-sm" onclick="Marketplace.handleContactSeller('${p.id}', '${p.seller_id}')">
                ${Icons.messageSquare("w-3 h-3")}
                Chat
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
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

  async handleContactSeller(productId, sellerId) {
    if (!state.currentUser) {
      showToast('Please sign in to contact the seller directly', 'info');
      AuthModal.open('login');
      return;
    }

    if (state.currentUser.id === sellerId) {
      showToast('You are the seller of this product!', 'info');
      return;
    }

    try {
      const res = await API.startConversation(productId);
      state.activeConversationId = res.conversation.id;
      state.setActiveView('inbox');
      showToast('Conversation ready in your inbox', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  handleSortChange(val) {
    state.setSortBy(val);
    this.loadProducts();
  },

  handleCategoryChange(cat) {
    state.setActiveCategory(cat);
    PopularCategories.render();
    this.loadProducts();
  },

  handleConditionChange(cond) {
    state.setConditionFilter(cond);
    this.loadProducts();
  },

  applyPriceFilter() {
    const min = parseInt(document.getElementById('filter-min-price').value || '0', 10);
    const maxVal = document.getElementById('filter-max-price').value;
    const max = maxVal ? parseInt(maxVal, 10) : 20000;
    state.setPriceRange(min, max);
    this.loadProducts();
  },

  resetFilters() {
    state.setActiveCategory('All');
    state.setSearchQuery('');
    state.setPriceRange(0, 20000);
    state.setConditionFilter('All');
    state.setSortBy('latest');
    this.render();
    PopularCategories.render();
  }
};
