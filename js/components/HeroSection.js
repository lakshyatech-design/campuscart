/**
 * GSV Direct — Flagship Hero Section (Apple.com 2026 Keynote Edition)
 * Inspired by apple.com flagship product reveals (iPhone 16 Pro / Apple Vision Pro)
 * 100% Titanium Light Canvas • Interactive Studio Display Drone Telemetry • Zero External Iframe Dependencies
 */

const HeroSection = {
  activeViewAngle: 0,
  viewAngles: [
    { name: 'Academic Block 1 & 2', alt: '44.3m', speed: '28 km/h', lat: '22.2882° N', lon: '73.1974° E', status: 'Optimal Handover Conditions' },
    { name: 'Central Library Lawn', alt: '36.8m', speed: '19 km/h', lat: '22.2891° N', lon: '73.1982° E', status: 'Active Study Zone • 18 Handover Points' },
    { name: 'Hostel Quad & Canteen', alt: '52.1m', speed: '24 km/h', lat: '22.2875° N', lon: '73.1965° E', status: 'High Traffic Student Zone' },
    { name: 'Main Campus Boulevard', alt: '30.5m', speed: '15 km/h', lat: '22.2898° N', lon: '73.1990° E', status: 'Bicycle Exchange Zone Active' }
  ],
  animFrameId: null,

  render() {
    const el = document.getElementById('hero-mount');
    if (!el) return;

    const angle = this.viewAngles[this.activeViewAngle];

    el.innerHTML = `
      <section class="apple-hero-container" id="apple-hero-section">
        <!-- Floating Ambient Background Lighting -->
        <div class="apple-hero-ambient-glow"></div>

        <!-- Apple Keynote Centerpiece Header -->
        <div class="apple-hero-header">
          <div class="apple-eyebrow-pill">
            <span class="apple-eyebrow-dot"></span>
            <span>GSV Direct • Apple Visionary 2026 Experience</span>
          </div>

          <h1 class="apple-hero-title">
            Campus Commerce.<br>
            <span class="apple-hero-title-accent">Engineered for GSV.</span>
          </h1>

          <p class="apple-hero-subtitle">
            The university marketplace engineered with precision. 
            100% verified student credentials, direct peer-to-peer exchange, and zero commission.
          </p>

          <div class="apple-hero-actions">
            <button class="apple-btn-primary" onclick="HeroSection.handleExploreClick()">
              Explore Exchange
            </button>
            <button class="apple-btn-secondary" onclick="HeroSection.handleSellClick()">
              + List an Item
            </button>
          </div>

          <!-- Apple 3-Metric Glass Capsule -->
          <div class="apple-metrics-capsule">
            <div class="apple-metric-item">
              <span class="apple-metric-num">2,450+</span>
              <span class="apple-metric-txt">Verified Students</span>
            </div>
            <div class="apple-metric-sep"></div>
            <div class="apple-metric-item">
              <span class="apple-metric-num">Direct Meetup</span>
              <span class="apple-metric-txt">In-Chat Handover</span>
            </div>
            <div class="apple-metric-sep"></div>
            <div class="apple-metric-item">
              <span class="apple-metric-num">₹0</span>
              <span class="apple-metric-txt">Platform Fee</span>
            </div>
          </div>
        </div>

        <!-- Apple Studio Display Hardware Showcase (GSV 4K Drone Radar Theater) -->
        <div class="apple-display-theater">
          <div class="apple-display-bezel">
            <!-- macOS Window Controls (Traffic Lights) -->
            <div class="apple-window-bar">
              <div class="apple-traffic-lights">
                <span class="apple-traffic-dot dot-red"></span>
                <span class="apple-traffic-dot dot-yellow"></span>
                <span class="apple-traffic-dot dot-green"></span>
              </div>
              <div class="apple-window-title">
                <span class="apple-live-indicator"></span>
                GSV Drone Telemetry • Vadodara Campus Flyover
              </div>
              <div class="apple-window-actions">
                <span class="apple-badge-4k">4K 60FPS</span>
              </div>
            </div>

            <!-- Canvas Viewport -->
            <div class="apple-screen-viewport">
              <canvas id="apple-drone-radar-canvas"></canvas>

              <!-- Futuristic HUD Telemetry Overlay -->
              <div class="apple-hud-overlay">
                <div class="apple-hud-top">
                  <div class="apple-hud-data-block">
                    <span class="hud-label">CAMPUS NODE</span>
                    <span class="hud-value" id="hud-angle-name">${angle.name}</span>
                  </div>
                  <div class="apple-hud-data-block">
                    <span class="hud-label">ALTITUDE</span>
                    <span class="hud-value" id="hud-alt">${angle.alt}</span>
                  </div>
                  <div class="apple-hud-data-block">
                    <span class="hud-label">VELOCITY</span>
                    <span class="hud-value" id="hud-speed">${angle.speed}</span>
                  </div>
                </div>

                <div class="apple-hud-bottom">
                  <div class="apple-hud-coords">
                    <span id="hud-coords">${angle.lat} • ${angle.lon}</span>
                    <span class="hud-status" id="hud-status">${angle.status}</span>
                  </div>
                  <div class="apple-hud-switcher">
                    <button class="apple-hud-switch-btn" onclick="HeroSection.cycleCameraView()">
                      🔄 Switch Camera Angle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    setTimeout(() => {
      this.initRadarCanvas();
    }, 50);
  },

  cycleCameraView() {
    this.activeViewAngle = (this.activeViewAngle + 1) % this.viewAngles.length;
    const angle = this.viewAngles[this.activeViewAngle];

    const nameEl = document.getElementById('hud-angle-name');
    const altEl = document.getElementById('hud-alt');
    const speedEl = document.getElementById('hud-speed');
    const coordsEl = document.getElementById('hud-coords');
    const statusEl = document.getElementById('hud-status');

    if (nameEl) nameEl.textContent = angle.name;
    if (altEl) altEl.textContent = angle.alt;
    if (speedEl) speedEl.textContent = angle.speed;
    if (coordsEl) coordsEl.textContent = `${angle.lat} • ${angle.lon}`;
    if (statusEl) statusEl.textContent = angle.status;
  },

  initRadarCanvas() {
    const canvas = document.getElementById('apple-drone-radar-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.parentElement.clientWidth || 900;
    let height = canvas.height = canvas.parentElement.clientHeight || 450;

    window.addEventListener('resize', () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || 900;
      height = canvas.height = canvas.parentElement.clientHeight || 450;
    });

    // Campus flight simulation nodes
    const nodes = [
      { name: 'Admin Complex', x: 0.25, y: 0.35, pulse: 0 },
      { name: 'Central Library', x: 0.5, y: 0.28, pulse: 1.2 },
      { name: 'Academic Block 1', x: 0.35, y: 0.65, pulse: 2.4 },
      { name: 'Academic Block 2', x: 0.65, y: 0.62, pulse: 0.8 },
      { name: 'Hostel Quad', x: 0.78, y: 0.4, pulse: 1.8 },
      { name: 'Sports Complex', x: 0.18, y: 0.75, pulse: 3.1 }
    ];

    let sweepAngle = 0;
    let droneX = 0.5;
    let droneY = 0.5;
    let droneAngle = 0;

    const renderFrame = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Beautiful Apple Blueprint Grid
      ctx.strokeStyle = 'rgba(0, 113, 227, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Concentric Radar Rings
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const maxRadius = Math.max(width, height) * 0.45;

      for (let r = 80; r < maxRadius; r += 70) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 113, 227, 0.12)';
        ctx.stroke();
      }

      // 3. Radar Sweep Line
      sweepAngle += 0.015;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(sweepAngle);
      const gradient = ctx.createLinearGradient(0, 0, maxRadius, 0);
      gradient.addColorStop(0, 'rgba(0, 113, 227, 0.4)');
      gradient.addColorStop(1, 'rgba(0, 113, 227, 0.0)');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(maxRadius, 0);
      ctx.stroke();
      ctx.restore();

      // 4. Campus Handover Hub Nodes
      nodes.forEach((node, idx) => {
        const nx = width * node.x;
        const ny = height * node.y;
        node.pulse += 0.03;

        // Pulse wave
        const pSize = 6 + Math.sin(node.pulse) * 4;
        ctx.beginPath();
        ctx.arc(nx, ny, pSize * 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 113, 227, 0.12)';
        ctx.fill();

        // Node center
        ctx.beginPath();
        ctx.arc(nx, ny, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#0071e3';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Node label
        ctx.font = '500 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
        ctx.fillStyle = '#1d1d1f';
        ctx.fillText(node.name, nx + 10, ny + 4);
      });

      // 5. Connecting Telemetry Flight Paths
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 113, 227, 0.25)';
      ctx.setLineDash([4, 6]);
      ctx.lineWidth = 1.5;
      nodes.forEach((n, i) => {
        const next = nodes[(i + 1) % nodes.length];
        ctx.moveTo(width * n.x, height * n.y);
        ctx.lineTo(width * next.x, height * next.y);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      // 6. Drone Icon Position (Smooth Figure-8 Flight)
      droneAngle += 0.01;
      droneX = 0.5 + Math.cos(droneAngle) * 0.22;
      droneY = 0.5 + Math.sin(droneAngle * 2) * 0.15;
      const dx = width * droneX;
      const dy = height * droneY;

      ctx.save();
      ctx.translate(dx, dy);
      ctx.rotate(droneAngle + Math.PI / 2);

      // Drone shadow
      ctx.beginPath();
      ctx.ellipse(0, 12, 10, 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fill();

      // Drone body
      ctx.fillStyle = '#0071e3';
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Rotors
      [-8, 8].forEach(rx => {
        [-8, 8].forEach(ry => {
          ctx.beginPath();
          ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(0, 113, 227, 0.7)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
      });

      ctx.restore();

      HeroSection.animFrameId = requestAnimationFrame(renderFrame);
    };

    renderFrame();
  },

  handleExploreClick() {
    const target = document.getElementById('marketplace-section') || document.getElementById('categories-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  handleSellClick() {
    Navbar.handleSellClick();
  }
};

window.HeroSection = HeroSection;
