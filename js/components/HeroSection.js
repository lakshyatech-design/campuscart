/**
 * CampusCart - Landing Page Hero Section
 */
const HeroSection = {
  render() {
    const el = document.getElementById('hero-mount');
    if (!el) return;

    const college = state.selectedCollege || { name: 'Gati Shakti Vishwavidyalaya', short_name: 'GSV Vadodara' };

    el.innerHTML = `
      <section class="hero-section">
        <div class="container text-center" style="text-align: center;">
          <!-- Launch Campus Tag -->
          <div class="hero-badge">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: var(--color-accent-emerald);"></span>
            <span>Launch Campus: <strong>${college.name}</strong></span>
            <span style="opacity: 0.5;">|</span>
            <a href="#" onclick="event.preventDefault(); CollegeSelectorModal.open();" style="text-decoration: underline; font-weight: 700;">Change</a>
          </div>

          <!-- Main Heading -->
          <h1 class="hero-title">
            Buy & Sell Within <span>Your Campus</span>
          </h1>

          <!-- Subtitle -->
          <p class="hero-subtitle">
            Discover amazing deals, sell what you don't need, and connect with trusted students around you. Zero commission, direct hostel handovers.
          </p>

          <!-- Large Interactive Dual Action Cards -->
          <div class="hero-action-cards">
            <!-- Option 1: I Want to Buy -->
            <div class="hero-card hero-card-buy" onclick="HeroSection.handleBuyClick()">
              <div class="hero-card-icon">
                ${Icons.shoppingBag("w-8 h-8")}
              </div>
              <h3 class="hero-card-title">I Want to Buy</h3>
              <p class="hero-card-desc">
                Explore textbooks, electronics, cycle commutes, hostel gear, confirmed train ticket shifts, and perfumes listed by fellow campus peers.
              </p>
              <div class="hero-card-cta">
                <span>Browse Student Marketplace</span>
                ${Icons.arrowRight("w-4 h-4")}
              </div>
            </div>

            <!-- Option 2: I Want to Sell -->
            <div class="hero-card hero-card-sell" onclick="HeroSection.handleSellClick()">
              <div class="hero-card-icon">
                ${Icons.plusCircle("w-8 h-8")}
              </div>
              <h3 class="hero-card-title">I Want to Sell</h3>
              <p class="hero-card-desc">
                Turn your pre-loved textbooks, bicycles, gadgets, or room supplies into quick cash. Upload photos and chat with interested student buyers in minutes.
              </p>
              <div class="hero-card-cta">
                <span>Post a Product for Free</span>
                ${Icons.arrowRight("w-4 h-4")}
              </div>
            </div>
          </div>

          <!-- Trust Metrics -->
          <div class="trust-metrics">
            <div class="trust-item">
              <div class="trust-num">100%</div>
              <div class="trust-label">Verified Student IDs</div>
            </div>
            <div class="trust-item">
              <div class="trust-num">₹0</div>
              <div class="trust-label">Zero Platform Fees</div>
            </div>
            <div class="trust-item">
              <div class="trust-num">Direct</div>
              <div class="trust-label">Hostel & Campus Handover</div>
            </div>
            <div class="trust-item">
              <div class="trust-num">Real-Time</div>
              <div class="trust-label">In-App Encrypted Chat</div>
            </div>
          </div>
        </div>
      </section>
    `;
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
