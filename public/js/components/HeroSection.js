/**
 * GSV Direct — Hero Section (Forge Automotive Inspired)
 * Cinematic, centered editorial serif headline with no 3D model
 */

const HeroSection = {
  render() {
    const el = document.getElementById('hero-mount');
    if (!el) return;

    el.innerHTML = `
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-kicker">
            <span class="kicker-dot"></span>
            <span>Verified Campus Exchange</span>
          </div>

          <h1 class="hero-headline">
            For Those Who<br>
            <em>Refuse Ordinary</em>
          </h1>

          <p class="hero-sub">
            The official student-to-student marketplace for Gati Shakti Vishwavidyalaya. 
            Direct campus handovers, verified credentials, zero commission.
          </p>

          <div class="hero-cta-row">
            <button class="btn btn-primary btn-lg" onclick="HeroSection.handleExploreClick()">
              Explore Listings
            </button>
            <button class="btn btn-secondary btn-lg" onclick="HeroSection.handleSellClick()">
              + List an Item
            </button>
          </div>

          <div class="hero-metrics">
            <div class="hero-metric">
              <div class="hero-metric-value">2,450+</div>
              <div class="hero-metric-label">Verified Students</div>
            </div>
            <div class="hero-metric-divider"></div>
            <div class="hero-metric">
              <div class="hero-metric-value">Lalbaug & PN</div>
              <div class="hero-metric-label">Campus Hubs</div>
            </div>
            <div class="hero-metric-divider"></div>
            <div class="hero-metric">
              <div class="hero-metric-value">₹0</div>
              <div class="hero-metric-label">Commission</div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  handleExploreClick() {
    const marketEl = document.getElementById('marketplace-section') || document.getElementById('categories-section');
    if (marketEl) marketEl.scrollIntoView({ behavior: 'smooth' });
  },

  handleSellClick() {
    Navbar.handleSellClick();
  }
};
