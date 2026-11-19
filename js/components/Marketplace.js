/**
 * CampusCart - Apple Store Marketplace Grid & Showcase
 * Flagship Apple.com bento cards, clean search, segmented tabs, and guaranteed seed product rendering
 */

const Marketplace = {
  products: [],
  isLoading: false,

  // Guaranteed Apple-quality seed listings for GSV Direct
  fallbackSeedProducts: [
    {
      id: 'prod-cycle-01',
      title: 'Hero Sprint 21-Speed Gear Bicycle (Alloy Frame)',
      price: 3200,
      originalPrice: 7500,
      category: 'Cycles',
      condition: 'Like New',
      location: 'Hostel Block B Handover',
      description: 'Superbly maintained Shimano 21-speed gear bicycle. Dual mechanical disc brakes, alloy rims, night reflector, and heavy-duty steel U-lock included. Used 1 academic year on GSV campus.',
      images: [
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80'
      ],
      seller: { name: 'Kumar Harsh', rollNo: 'GSV-BTECH-25', department: 'BTech Civil', verified: true },
      isSold: false
    },
    {
      id: 'prod-rail-01',
      title: 'Confirmed 3AC Railway Ticket (Vadodara -> New Delhi)',
      price: 1450,
      originalPrice: 1650,
      category: 'Railway Tickets',
      condition: 'Brand New',
      location: 'Academic Block 1 Handover',
      description: 'Confirmed IRCTC 3AC berth on 12951 Mumbai-Delhi Rajdhani Express. Valid student exchange handover via IRCTC traveler transfer form.',
      journeyDate: '28/11/2026',
      images: [
        'https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80'
      ],
      seller: { name: 'Prashant Gupta', rollNo: 'GSV-BTECH-25', department: 'BTech Rail Engineering', verified: true },
      isSold: false
    },
    {
      id: 'prod-book-01',
      title: 'Higher Engineering Mathematics by B.S. Grewal (44th Ed)',
      price: 450,
      originalPrice: 1100,
      category: 'Books & Study Materials',
      condition: 'Like New',
      location: 'Central Library Lawn Handover',
      description: 'Standard textbook for Semester 1-4 Mathematics. Pristine condition with chapter tabs and solved tutorial questions.',
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
      ],
      seller: { name: 'Ananya Sharma', rollNo: 'GSV-BTECH-26', department: 'BTech AI & DS', verified: true },
      isSold: false
    },
    {
      id: 'prod-tech-01',
      title: 'Casio fx-991EX ClassWiz Advanced Scientific Calculator',
      price: 850,
      originalPrice: 1795,
      category: 'Electronics & Gadgets',
      condition: 'Like New',
      location: 'Academic Block 2 Handover',
      description: 'Official calculator permitted for university semester examinations. 552 functions, high-resolution natural textbook display, solar + battery.',
      images: [
        'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?auto=format&fit=crop&w=800&q=80'
      ],
      seller: { name: 'Rohan Verma', rollNo: 'GSV-BTECH-24', department: 'BTech Mechanical', verified: true },
      isSold: false
    },
    {
      id: 'prod-perfume-01',
      title: 'Afnan 9PM Eau de Parfum (100ml Bottle, 95ml Remaining)',
      price: 1850,
      originalPrice: 3200,
      category: 'Perfumes',
      condition: 'Like New',
      location: 'Hostel Block A Handover',
      description: 'Mass-pleasing winter and evening fragrance with apple, cinnamon, vanilla, and amber notes. Exceptional 8+ hour performance.',
      images: [
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80'
      ],
      seller: { name: 'Aman Patel', rollNo: 'GSV-MBA-25', department: 'MBA Supply Chain', verified: true },
      isSold: false
    },
    {
      id: 'prod-hostel-01',
      title: 'Pigeon Induction Cooktop (1800W) + Steel Saucepan',
      price: 1200,
      originalPrice: 2800,
      category: 'Hostel Essentials',
      condition: 'Good',
      location: 'Hostel Block C Handover',
      description: 'Crucial hostel survival appliance for midnight noodles, milk boiling, and coffee. 7 preset Indian cooking menus.',
      images: [
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
      ],
      seller: { name: 'Vikram Singh', rollNo: 'GSV-BTECH-25', department: 'BTech Electrical', verified: true },
      isSold: false
    },
    {
      id: 'prod-tech-02',
      title: 'Logitech MX Master 2S Wireless Ergonomic Mouse',
      price: 2600,
      originalPrice: 6995,
      category: 'Electronics & Gadgets',
      condition: 'Good',
      location: 'Computer Lab Handover',
      description: 'Productivity powerhouse for CAD modeling and code editing. Cross-computer control, rechargeable battery, gesture button.',
      images: [
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'
      ],
      seller: { name: 'Divyansh Joshi', rollNo: 'GSV-BTECH-24', department: 'BTech Rail Engineering', verified: true },
      isSold: false
    },
    {
      id: 'prod-sports-01',
      title: 'Quechua 50L Waterproof Trekking Rucksack Backpack',
      price: 1400,
      originalPrice: 3499,
      category: 'Sports',
      condition: 'Like New',
      location: 'Student Activity Center',
      description: 'Used for one college excursion trip to Pavagadh. Ergonomic back suspension, rain cover included.',
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
      ],
      seller: { name: 'Sneha Kulkarni', rollNo: 'GSV-BBA-26', department: 'BBA Logistics', verified: true },
      isSold: false
    }
  ],

  render() {
    const el = document.getElementById('marketplace-mount');
    if (!el) return;

    el.innerHTML = `
      <section id="marketplace-section" class="apple-marketplace-container">
        <!-- Apple Store Filter Strip -->
        <div class="apple-store-toolbar">
          <div class="apple-toolbar-left">
            <h3 class="apple-toolbar-title">
              ${state.activeCategory === 'All' ? 'All Campus Listings' : state.activeCategory}
            </h3>
            <span class="apple-toolbar-count" id="apple-product-count">
              Loading listings...
            </span>
          </div>

          <div class="apple-toolbar-right">
            <!-- Search Capsule -->
            <div class="apple-search-capsule">
              ${Icons.search("w-4 h-4 text-apple-gray")}
              <input 
                type="text" 
                class="apple-search-input" 
                placeholder="Search products, sellers, roll nos..." 
                value="${state.searchQuery || ''}"
                oninput="Marketplace.handleSearchInput(this.value)"
              />
            </div>

            <!-- Sort Segment -->
            <div class="apple-sort-segment">
              <span class="apple-sort-label">Sort:</span>
              <select class="apple-sort-select" onchange="Marketplace.handleSortChange(this.value)">
                <option value="latest" ${state.sortBy === 'latest' ? 'selected' : ''}>Recently Added</option>
                <option value="price_asc" ${state.sortBy === 'price_asc' ? 'selected' : ''}>Price: Low to High</option>
                <option value="price_desc" ${state.sortBy === 'price_desc' ? 'selected' : ''}>Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Apple Product Cards Grid -->
        <div id="apple-products-grid" class="apple-products-grid">
          <!-- Rendered dynamically -->
        </div>
      </section>
    `;

    this.loadProducts();
  },

  async loadProducts() {
    const gridEl = document.getElementById('apple-products-grid');
    const countEl = document.getElementById('apple-product-count');
    if (!gridEl) return;

    gridEl.innerHTML = `
      <div class="apple-grid-loader">
        <div class="apple-spinner"></div>
        <span>Curating verified campus items...</span>
      </div>
    `;

    try {
      const res = await API.getProducts({
        category: state.activeCategory,
        sort: state.sortBy,
        collegeId: 'gsv-vadodara'
      });

      if (res && res.products && res.products.length > 0) {
        this.products = res.products;
      } else {
        // Fallback to rich seed products if API is offline or returns empty
        this.products = this.fallbackSeedProducts.filter(p => {
          if (state.activeCategory !== 'All' && p.category !== state.activeCategory) return false;
          if (state.searchQuery && !p.title.toLowerCase().includes(state.searchQuery.toLowerCase()) && !p.description.toLowerCase().includes(state.searchQuery.toLowerCase())) return false;
          return true;
        });
      }
    } catch (e) {
      this.products = this.fallbackSeedProducts.filter(p => {
        if (state.activeCategory !== 'All' && p.category !== state.activeCategory) return false;
        if (state.searchQuery && !p.title.toLowerCase().includes(state.searchQuery.toLowerCase())) return false;
        return true;
      });
    }

    if (countEl) {
      countEl.textContent = `${this.products.length} verified listings on campus`;
    }

    this.renderCards(this.products);
  },

  renderCards(products) {
    const gridEl = document.getElementById('apple-products-grid');
    if (!gridEl) return;

    if (!products || products.length === 0) {
      gridEl.innerHTML = `
        <div class="apple-empty-state">
          <div class="apple-empty-icon">📦</div>
          <h4>No listings found in this category</h4>
          <p>Be the first GSV student to list an item in ${state.activeCategory}!</p>
          <button class="apple-btn-primary" onclick="Navbar.handleSellClick()">+ List an Item</button>
        </div>
      `;
      return;
    }

    gridEl.innerHTML = products.map(p => {
      const img = (p.images && p.images.length > 0) ? p.images[0] : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800';
      const savings = (p.originalPrice && p.originalPrice > p.price) ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;

      return `
        <div class="apple-product-card" onclick="Marketplace.openProductModal('${p.id}')">
          <!-- Card Image Frame -->
          <div class="apple-card-media-wrap">
            <img src="${img}" alt="${p.title}" class="apple-card-img" loading="lazy" />
            <div class="apple-card-badges">
              <span class="apple-badge-cat">${p.category}</span>
              ${savings > 0 ? `<span class="apple-badge-save">${savings}% OFF</span>` : ''}
            </div>
            ${p.journeyDate ? `<div class="apple-card-journey-badge">🚆 Date: ${p.journeyDate}</div>` : ''}
          </div>

          <!-- Card Content -->
          <div class="apple-card-body">
            <div class="apple-card-meta-top">
              <span class="apple-card-seller">
                <span class="apple-seller-dot"></span>
                ${p.seller ? p.seller.name : 'GSV Student'}
              </span>
              <span class="apple-card-condition">${p.condition || 'Verified'}</span>
            </div>

            <h4 class="apple-card-title">${p.title}</h4>

            <div class="apple-card-price-row">
              <div class="apple-price-wrap">
                <span class="apple-card-price">₹${p.price.toLocaleString('en-IN')}</span>
                ${p.originalPrice ? `<span class="apple-card-original-price">₹${p.originalPrice.toLocaleString('en-IN')}</span>` : ''}
              </div>
              <button class="apple-card-cta-btn" onclick="event.stopPropagation(); Marketplace.openProductModal('${p.id}')">
                Details
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  handleSearchInput(val) {
    state.searchQuery = val;
    this.loadProducts();
  },

  handleSortChange(val) {
    state.sortBy = val;
    this.loadProducts();
  },

  openProductModal(id) {
    const prod = this.products.find(p => p.id === id) || this.fallbackSeedProducts.find(p => p.id === id);
    if (prod && window.ProductDetailModal) {
      ProductDetailModal.open(prod);
    }
  }
};

window.Marketplace = Marketplace;
