/**
 * GSV Direct — Master Hero Section Component
 * Split-Screen Editorial Composition with Interactive 3D Bullet Train Stage
 */

const HeroSection = {
  render() {
    const el = document.getElementById('hero-mount');
    if (!el) return;

    el.innerHTML = `
      <section class="hero-master-section">
        <div class="container">
          <div class="hero-master-grid">
            
            <!-- Left: GSV Editorial Narrative Column -->
            <div class="hero-copy-column">
              <div class="hero-editorial-kicker">
                <span class="kicker-pulse"></span>
                <span>🚆 Gati Shakti Vishwavidyalaya • Verified Campus Exchange</span>
              </div>

              <h1 class="hero-headline-master">
                Campus Commerce at <br>
                <span class="headline-gradient-text">High-Speed Velocity.</span>
              </h1>

              <p class="hero-narrative-sub">
                The official student-to-student exchange engine for Gati Shakti Vishwavidyalaya (Vadodara). Direct Lalbaug campus and Pratap Nagar hostel handovers, verified student domain credentials, and zero platform commission.
              </p>

              <!-- CTA Deck -->
              <div class="hero-cta-deck">
                <button class="btn btn-primary btn-lg flex items-center gap-2" onclick="HeroSection.handleExploreClick()">
                  <span>Explore GSV Listings</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
                <button class="btn btn-secondary btn-lg flex items-center gap-2" onclick="HeroSection.handleSellClick()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  <span>+ List an Item</span>
                </button>
              </div>

              <!-- GSV University Badges & Metrics Row -->
              <div class="hero-metrics-bar">
                <div class="metric-item">
                  <div class="metric-value">2,450+</div>
                  <div class="metric-label">GSV Students Active</div>
                </div>
                <div class="metric-divider"></div>
                <div class="metric-item">
                  <div class="metric-value">Lalbaug & PN</div>
                  <div class="metric-label">Campus Handover Hubs</div>
                </div>
                <div class="metric-divider"></div>
                <div class="metric-item">
                  <div class="metric-value">₹0 Commission</div>
                  <div class="metric-label">100% Student-to-Student</div>
                </div>
              </div>

              <!-- Campus Ring Guarantee -->
              <div class="hero-trust-row">
                <div class="trust-check-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0052cc" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>@gsv.ac.in Verified Domain</span>
                </div>
                <div class="trust-check-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0052cc" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>IRCTC Passenger Compliance</span>
                </div>
                <div class="trust-check-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0052cc" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>Real-Time Broadcast</span>
                </div>
              </div>
            </div>

            <!-- Right: Interactive 3D GSV Locomotive & Transit Stage -->
            <div class="hero-stage-column">
              <div class="gsv-3d-stage-wrapper">
                
                <!-- 3D Stage Top HUD Bar -->
                <div class="gsv-3d-hud">
                  <div class="gsv-3d-hud-title">
                    <span class="hud-dot"></span>
                    <span>GSV HIGH-SPEED TRANSIT ENGINE 3D</span>
                  </div>
                  <div class="gsv-3d-speed-badge" id="gsv-speed-indicator" onclick="HeroSection.toggleSpeed()">
                    160 KM/H (CRUISE)
                  </div>
                </div>

                <!-- Three.js Canvas Mount -->
                <div id="gsv-3d-container" class="gsv-3d-canvas-mount" title="Click or Drag to Rotate the GSV Locomotive">
                  <!-- Three.js WebGL canvas is injected here by gsv-3d-scene.js -->
                </div>

                <!-- 3D Interactive Controls Toolbar -->
                <div class="gsv-3d-controls-bar">
                  <div class="camera-views-cluster">
                    <button class="cam-btn active" onclick="HeroSection.setAngle('front', this)">Front 3/4</button>
                    <button class="cam-btn" onclick="HeroSection.setAngle('side', this)">Profile</button>
                    <button class="cam-btn" onclick="HeroSection.setAngle('cockpit', this)">Cab</button>
                    <button class="cam-btn" onclick="HeroSection.setAngle('orbit', this)">Orbit</button>
                  </div>
                  <div class="camera-actions-cluster">
                    <button class="stage-hud-btn" onclick="HeroSection.toggleLights()" title="Toggle Day/Night Illumination">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                      <span>Day / Night</span>
                    </button>
                    <button class="stage-hud-btn highlight" onclick="HeroSection.boostSpeed()" title="Trigger High-Speed Acceleration">
                      ⚡ <span>320 km/h Boost</span>
                    </button>
                  </div>
                </div>

                <!-- Live Student Listing Micro-Card Overlay -->
                <div class="stage-floating-listing" onclick="ProductDetailModal.open('prod-1')">
                  <div class="floating-badge">Verified Ticket Handover</div>
                  <div class="floating-listing-row">
                    <div class="floating-info">
                      <div class="floating-title">Vadodara (BRC) → New Delhi (NDLS) 3AC</div>
                      <div class="floating-meta">Aarav Sharma • GSV Hostel Block B</div>
                    </div>
                    <div class="floating-price tabular-nums">₹1,350</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    `;

    // Initialize 3D scene if Three.js is loaded
    if (window.GSV3D && typeof window.GSV3D.init === 'function') {
      setTimeout(() => window.GSV3D.init(), 100);
    }
  },

  setAngle(view, btn) {
    if (window.GSV3D) {
      window.GSV3D.setCameraView(view);
    }
    const btns = document.querySelectorAll('.cam-btn');
    btns.forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  },

  toggleSpeed() {
    if (window.GSV3D) {
      const mode = window.GSV3D.toggleSpeed();
      const indicator = document.getElementById('gsv-speed-indicator');
      if (indicator) indicator.textContent = mode.toUpperCase() + ' MODE';
    }
  },

  boostSpeed() {
    if (window.GSV3D) {
      window.GSV3D.setCameraView('orbit');
      const indicator = document.getElementById('gsv-speed-indicator');
      if (indicator) indicator.textContent = '320 KM/H (MAX VELOCITY)';
      setTimeout(() => {
        if (indicator) indicator.textContent = '160 KM/H (CRUISE)';
      }, 3000);
    }
  },

  toggleLights() {
    if (window.GSV3D) {
      const mode = window.GSV3D.toggleLighting();
      state.showToast(`Switched 3D stage to ${mode}`, 'info');
    }
  },

  handleExploreClick() {
    document.getElementById('marketplace-feed')?.scrollIntoView({ behavior: 'smooth' });
  },

  handleSellClick() {
    Navbar.handleSellClick();
  }
};
