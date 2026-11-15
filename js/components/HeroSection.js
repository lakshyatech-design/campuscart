/**
 * CampusCart - Landing Page Hero Section
 * Apple & Linear-inspired Editorial Craftsmanship
 */
const HeroSection = {
  render() {
    const el = document.getElementById('hero-mount');
    if (!el) return;

    const college = state.selectedCollege || { name: 'Gati Shakti Vishwavidyalaya', short_name: 'GSV Vadodara' };

    el.innerHTML = `
      <section class="hero-editorial-section">
        <div class="container">
          <!-- Top Campus Verification Badge -->
          <div class="hero-campus-pill-wrapper flex justify-center">
            <div class="hero-campus-pill" onclick="CollegeSelectorModal.open()">
              <span class="live-pulse-dot"></span>
              <span class="hero-pill-campus-name">Launch Campus: <strong>${college.short_name}</strong></span>
              <span class="hero-pill-divider">/</span>
              <span class="hero-pill-action">Switch Campus ▾</span>
            </div>
          </div>

          <!-- Monumental Editorial Heading -->
          <div class="hero-text-block text-center">
            <h1 class="hero-editorial-title">
              Buy & sell within <br class="hero-title-break">
              <span class="hero-editorial-gradient">your campus community.</span>
            </h1>
            <p class="hero-editorial-sub">
              India's verified student-to-student exchange. Zero platform fees, verified university credentials, and direct handovers right at your hostel gates.
            </p>
          </div>

          <!-- Apple-Style Omnibar Search -->
          <div class="hero-omnibar-wrapper">
            <form class="hero-omnibar" onsubmit="event.preventDefault(); HeroSection.handleOmnibarSearch();">
              <div class="hero-omnibar-icon">
                ${Icons.search("w-5 h-5")}
              </div>
              <input 
                type="text" 
                id="hero-omnibar-input" 
                class="hero-omnibar-input" 
                placeholder="Search engineering textbooks, bicycles, calculators, perfumes, train shifts..." 
                autocomplete="off"
              />
              <div class="hero-omnibar-shortcut">
                <kbd>⌘K</kbd>
              </div>
              <button type="submit" class="btn btn-primary hero-omnibar-btn">
                <span>Explore</span>
                ${Icons.arrowRight("w-4 h-4")}
              </button>
            </form>
          </div>

          <!-- Interactive 3D Dual Portals (Buy & Sell) -->
          <div class="hero-portals-grid">
            <!-- Portal 1: I Want to Buy -->
            <div class="hero-portal-card hero-portal-buy tilt-card" onclick="HeroSection.handleBuyClick()">
              <div class="specular-glare"></div>
              <div class="hero-portal-inner">
                <div class="hero-portal-top">
                  <div class="hero-portal-icon-wrap icon-buy">
                    ${Icons.shoppingBag("w-6 h-6")}
                  </div>
                  <span class="hero-portal-pill pill-buy">Campus Directory</span>
                </div>
                <h3 class="hero-portal-title">I Want to Buy</h3>
                <p class="hero-portal-desc">
                  Browse pre-loved semester textbooks, lab kits, bicycles, calculators, and verified travel shifts from trusted peers.
                </p>
                <div class="hero-portal-meta">
                  <div class="portal-chip">📚 Engineering Books</div>
                  <div class="portal-chip">🚲 Campus Cycles</div>
                  <div class="portal-chip">🚂 Railway Passes</div>
                </div>
                <div class="hero-portal-action action-buy">
                  <span>Enter Student Marketplace</span>
                  ${Icons.arrowRight("w-4 h-4")}
                </div>
              </div>
            </div>

            <!-- Portal 2: I Want to Sell -->
            <div class="hero-portal-card hero-portal-sell tilt-card" onclick="HeroSection.handleSellClick()">
              <div class="specular-glare"></div>
              <div class="hero-portal-inner">
                <div class="hero-portal-top">
                  <div class="hero-portal-icon-wrap icon-sell">
                    ${Icons.plusCircle("w-6 h-6")}
                  </div>
                  <span class="hero-portal-pill pill-sell">Instant Listing</span>
                </div>
                <h3 class="hero-portal-title">I Want to Sell</h3>
                <p class="hero-portal-desc">
                  Pass down what you've outgrown to freshers and juniors. Get paid instantly via UPI with zero commissions or shipping hassles.
                </p>
                <div class="hero-portal-meta">
                  <div class="portal-chip">⚡ 60s Quick Post</div>
                  <div class="portal-chip">🔒 Roll No. Protected</div>
                  <div class="portal-chip">₹0 Commission</div>
                </div>
                <div class="hero-portal-action action-sell">
                  <span>List a Product for Free</span>
                  ${Icons.arrowRight("w-4 h-4")}
                </div>
              </div>
            </div>
          </div>

          <!-- Real-Time Campus Pulse Ticker -->
          <div class="campus-pulse-bar">
            <div class="campus-pulse-label">
              <span class="pulse-indicator"></span>
              <span>LIVE ON CAMPUS</span>
            </div>
            <div class="campus-pulse-marquee">
              <div class="pulse-item">
                <span class="pulse-college">GSV Vadodara:</span> Hero Sprint 26T Cycle listed by Mechanical 3rd Year
              </div>
              <span class="pulse-dot-sep">•</span>
              <div class="pulse-item">
                <span class="pulse-college">IIT Bombay:</span> B.S. Grewal Math 44th Ed. claimed at Hostel 12
              </div>
              <span class="pulse-dot-sep">•</span>
              <div class="pulse-item">
                <span class="pulse-college">GSV Vadodara:</span> BRC ➔ NDLS 3AC Student Transfer Shift verified
              </div>
              <span class="pulse-dot-sep">•</span>
              <div class="pulse-item">
                <span class="pulse-college">BITS Pilani:</span> Casio FX-991CW Scientific Calculator available
              </div>
            </div>
          </div>

        </div>
      </section>
    `;

    // Re-initialize 3D tilt on newly rendered hero elements
    if (window.Interactions && Interactions.init3DTilt) {
      Interactions.init3DTilt();
    }
  },

  handleOmnibarSearch() {
    const input = document.getElementById('hero-omnibar-input');
    if (input) {
      const q = input.value.trim();
      state.setSearchQuery(q);
      const searchBox = document.getElementById('marketplace-search-input');
      if (searchBox) searchBox.value = q;
    }
    const marketEl = document.getElementById('marketplace-section');
    if (marketEl) marketEl.scrollIntoView({ behavior: 'smooth' });
    Marketplace.loadProducts();
  },

  handleBuyClick() {
    const marketEl = document.getElementById('marketplace-section');
    if (marketEl) {
      marketEl.scrollIntoView({ behavior: 'smooth' });
    }
  },

  handleSellClick() {
    Navbar.handleSellClick();
  }
};
