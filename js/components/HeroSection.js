/**
 * CampusCart - Master Rebuilt Hero Section
 * Split-Screen Composition with Interactive 3D Spatial Deck
 */
const HeroSection = {
  render() {
    const el = document.getElementById('hero-mount');
    if (!el) return;

    el.innerHTML = `
      <section class="hero-master-section">
        <div class="container">
          <div class="hero-master-grid">
            
            <!-- Left: Editorial Narrative Column -->
            <div class="hero-copy-column">
              <div class="hero-editorial-kicker">
                <span>⚡ Verified Peer-to-Peer Campus Commerce</span>
              </div>

              <h1 class="hero-headline-master">
                One Platform. <br>
                <span class="headline-gradient-text">Every Campus.</span>
              </h1>

              <p class="hero-narrative-sub">
                Buy, sell, and negotiate textbooks, bicycles, calculators, and verified campus essentials with verified peers. Zero platform commissions, direct hostel gate handovers.
              </p>

              <!-- CTA Deck -->
              <div class="hero-cta-deck">
                <button class="btn btn-primary btn-lg flex items-center gap-2" onclick="HeroSection.handleBuyClick()">
                  <span>Browse Student Marketplace</span>
                  ${Icons.arrowRight("w-4 h-4")}
                </button>
                <button class="btn btn-secondary btn-lg flex items-center gap-2" onclick="HeroSection.handleSellClick()">
                  ${Icons.plusCircle("w-4 h-4 text-amber")}
                  <span>Post a Product for Free</span>
                </button>
              </div>

              <!-- Trust Highlights Row -->
              <div class="hero-trust-row">
                <div class="trust-check-item">
                  ${Icons.checkCircle("w-4 h-4")}
                  <span>100% Student ID Verified</span>
                </div>
                <div class="trust-check-item">
                  ${Icons.checkCircle("w-4 h-4")}
                  <span>₹0 Platform Fees</span>
                </div>
                <div class="trust-check-item">
                  ${Icons.checkCircle("w-4 h-4")}
                  <span>Direct Hostel Handover</span>
                </div>
              </div>
            </div>

            <!-- Right: 3D Spatial Product Stage -->
            <div class="hero-stage-column">
              <div class="stage-spatial-deck">
                
                <!-- Main Featured Product Card -->
                <div class="stage-card-featured tilt-card" onclick="ProductDetailModal.open('prod-1')">
                  <div class="specular-glare"></div>
                  <div class="stage-img-wrap">
                    <img src="https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800" class="stage-img" alt="Hero Sprint Cycle" />
                    <span class="stage-tag-floating">Like New • Mint</span>
                  </div>
                  <div class="stage-card-body">
                    <div class="stage-price-row">
                      <span class="stage-price tabular-nums">₹2,800</span>
                      <span class="stage-badge-status">● Live Listing</span>
                    </div>
                    <h3 class="stage-title">Hero Sprint 26T 21-Speed Cycle</h3>
                    <div class="stage-location">
                      ${Icons.mapPin("w-4 h-4 text-muted")}
                      <span>GSV Vadodara • Hostel 2 Pickup</span>
                    </div>
                    <button class="btn btn-primary stage-chat-cta" onclick="event.stopPropagation(); ProductDetailModal.open('prod-1')">
                      View Listing & Chat with Seller →
                    </button>
                  </div>
                </div>

                <!-- Floating Layered Study Card -->
                <div class="stage-card-backdrop tilt-card" onclick="ProductDetailModal.open('prod-2')">
                  <div class="specular-glare"></div>
                  <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200" class="backdrop-thumb" alt="Textbook" />
                  <div>
                    <div class="backdrop-title">Higher Eng. Mathematics</div>
                    <div class="backdrop-price">₹350 <span style="font-size: 0.72rem; color: #166534; font-weight: 700;">(75% off)</span></div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    `;

    if (window.Interactions && Interactions.init3DTilt) {
      Interactions.init3DTilt();
    }
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
