/**
 * GSV Direct — Hero Section (Apple Visionary 2026 Edition)
 * Featuring 4K Drone Aerial Telemetry of Gati Shakti Vishwavidyalaya
 * 
 * Design:
 * - Apple Keynote presentation theater layout
 * - Precision-machined Apple Pro Display Hardware Frame for Drone Flyover
 * - Pure obsidian headlines with SF Pro typography
 * - Floating Frosted Glass Telemetry HUD
 * - Seamless Ambient 60 FPS Drone Canvas in Apple Blue & Silver
 * - Automatic IntersectionObserver optimization
 */

const HeroSection = {
  droneVideos: [
    {
      id: 'WBp23sW33yQ',
      title: 'GSV Vadodara • 4K Campus Aerial',
      start: 5
    },
    {
      id: 'O9JHRjcw1kE',
      title: 'GSV Heritage Grounds • Drone Tour',
      start: 10
    },
    {
      id: 'GMKSPZPyGHY',
      title: 'GSV Vadodara • Campus Flyover',
      start: 3
    }
  ],
  currentVideoIdx: 0,
  isPlaying: true,
  animFrameId: null,
  observer: null,

  render() {
    const el = document.getElementById('hero-mount');
    if (!el) return;

    const currentVideo = this.droneVideos[this.currentVideoIdx];

    el.innerHTML = `
      <section class="hero-section" id="hero-section">
        <!-- Foreground Hero Content (Apple Keynote Style) -->
        <div class="hero-content">
          <div class="hero-kicker">
            <span class="kicker-dot"></span>
            <span>GSV Direct • Next-Gen Campus Commerce</span>
          </div>

          <h1 class="hero-headline">
            Campus Commerce.<br>
            <em>Engineered Forward.</em>
          </h1>

          <p class="hero-sub">
            The university marketplace engineered with precision. 
            100% verified student credentials, direct peer-to-peer exchange, and zero commission.
          </p>

          <div class="hero-cta-row">
            <button class="btn btn-primary btn-lg" onclick="HeroSection.handleExploreClick()">
              Explore Marketplace
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
              <div class="hero-metric-value">Direct Meetup</div>
              <div class="hero-metric-label">In-Chat Handover</div>
            </div>
            <div class="hero-metric-divider"></div>
            <div class="hero-metric">
              <div class="hero-metric-value">₹0</div>
              <div class="hero-metric-label">Commission Fee</div>
            </div>
          </div>
        </div>

        <!-- Apple Pro Theater Hardware Frame (GSV 4K Drone View) -->
        <div class="hero-theater-container">
          <div class="hero-theater-hardware-bezel">
            <!-- Camera / Sensor Notch Dot -->
            <div class="theater-camera-dot"></div>

            <!-- Drone Video Viewport -->
            <div class="hero-theater-screen">
              <canvas id="hero-drone-canvas"></canvas>

              <iframe 
                id="gsv-drone-video" 
                src="https://www.youtube-nocookie.com/embed/${currentVideo.id}?autoplay=1&mute=1&loop=1&playlist=${currentVideo.id}&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&start=${currentVideo.start}&enablejsapi=1" 
                allow="autoplay; encrypted-media" 
                title="Gati Shakti Vishwavidyalaya Campus Drone View"
                loading="lazy"
              ></iframe>

              <!-- Fallback Poster when iframe is offline / sandboxed -->
              <div class="hero-theater-fallback-poster"></div>

              <!-- Floating Apple Frosted Glass Drone HUD Badge -->
              <div class="hero-drone-hud">
                <div class="drone-hud-live-tag">
                  <span class="drone-pulse-dot"></span>
                  <span>LIVE 4K</span>
                </div>
                <div class="drone-hud-title" id="drone-hud-title">${currentVideo.title}</div>
                <div class="drone-hud-controls">
                  <button class="drone-btn" id="drone-toggle-btn" onclick="HeroSection.toggleVideoPlay()" title="Toggle Video Playback">
                    <span id="drone-play-icon">${this.isPlaying ? '⏸' : '▶'}</span>
                  </button>
                  <button class="drone-btn" id="drone-cam-btn" onclick="HeroSection.cycleCameraView()" title="Switch Drone Angle">
                    🔄 Switch Cam
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    // Initialize Drone Canvas & Video Transition
    setTimeout(() => {
      this.initDroneCanvas();
      this.setupObserver();
    }, 100);
  },

  cycleCameraView() {
    this.currentVideoIdx = (this.currentVideoIdx + 1) % this.droneVideos.length;
    const currentVideo = this.droneVideos[this.currentVideoIdx];
    const iframe = document.getElementById('gsv-drone-video');
    const titleEl = document.getElementById('drone-hud-title');
    if (titleEl) titleEl.textContent = currentVideo.title;

    if (iframe) {
      iframe.src = `https://www.youtube-nocookie.com/embed/${currentVideo.id}?autoplay=1&mute=1&loop=1&playlist=${currentVideo.id}&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&start=${currentVideo.start}&enablejsapi=1`;
    }
  },

  toggleVideoPlay() {
    this.isPlaying = !this.isPlaying;
    const iframe = document.getElementById('gsv-drone-video');
    const icon = document.getElementById('drone-play-icon');
    if (icon) icon.textContent = this.isPlaying ? '⏸' : '▶';

    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: this.isPlaying ? 'playVideo' : 'pauseVideo'
          }),
          '*'
        );
      } catch (e) {
        console.warn('Could not postMessage to drone iframe:', e);
      }
    }
  },

  initDroneCanvas() {
    const canvas = document.getElementById('hero-drone-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    window.addEventListener('resize', () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    });

    // Particle nodes representing aerial campus survey points
    const particles = Array.from({ length: 32 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.4 + 0.15
    }));

    let telemetryTick = 0;

    const renderFrame = () => {
      telemetryTick++;
      ctx.clearRect(0, 0, width, height);

      // 1. Subtle Drone Horizon Scan Line (Apple Blue Tint)
      const horizonY = height * 0.55 + Math.sin(telemetryTick * 0.015) * 12;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(width, horizonY);
      ctx.strokeStyle = 'rgba(0, 113, 227, 0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. Drone Targeting Reticle
      const centerX = width * 0.5;
      const centerY = height * 0.45;
      ctx.strokeStyle = 'rgba(0, 113, 227, 0.22)';
      ctx.lineWidth = 1.2;

      // Outer Target Reticle
      ctx.beginPath();
      ctx.arc(centerX, centerY, 34, 0, Math.PI * 2);
      ctx.stroke();

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX - 44, centerY);
      ctx.lineTo(centerX - 10, centerY);
      ctx.moveTo(centerX + 10, centerY);
      ctx.lineTo(centerX + 44, centerY);
      ctx.moveTo(centerX, centerY - 44);
      ctx.lineTo(centerX, centerY - 10);
      ctx.moveTo(centerX, centerY + 10);
      ctx.lineTo(centerX, centerY + 44);
      ctx.stroke();

      // 3. Drone Telemetry Watermark Coordinates
      ctx.font = '10px -apple-system, BlinkMacSystemFont, "SF Pro Text", monospace';
      ctx.fillStyle = 'rgba(0, 113, 227, 0.6)';
      ctx.fillText(`LAT 22.2882° N • LON 73.1974° E • ALT ${(45 + Math.sin(telemetryTick * 0.02) * 4).toFixed(1)}M`, 16, height - 16);
      ctx.fillText(`GSV VADODARA HERITAGE SURVEY • 4K DRONE`, Math.max(16, width - 260), height - 16);

      // 4. Floating Ambient Particles & Grid Connections
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 113, 227, ${p.alpha})`;
        ctx.fill();
      });

      // Connect nearby particles with delicate filament lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 85) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 113, 227, ${0.15 * (1 - dist / 85)})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      this.animFrameId = requestAnimationFrame(renderFrame);
    };

    renderFrame();
  },

  setupObserver() {
    const heroEl = document.getElementById('hero-section');
    if (!heroEl || !window.IntersectionObserver) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const iframe = document.getElementById('gsv-drone-video');
        if (entry.isIntersecting) {
          if (this.isPlaying && iframe && iframe.contentWindow) {
            try {
              iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
            } catch (e) {}
          }
        } else {
          if (iframe && iframe.contentWindow) {
            try {
              iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo' }), '*');
            } catch (e) {}
          }
        }
      });
    }, { threshold: 0.1 });

    this.observer.observe(heroEl);
  },

  handleExploreClick() {
    const marketEl = document.getElementById('marketplace-section') || document.getElementById('categories-section');
    if (marketEl) marketEl.scrollIntoView({ behavior: 'smooth' });
  },

  handleSellClick() {
    Navbar.handleSellClick();
  }
};

window.HeroSection = HeroSection;
