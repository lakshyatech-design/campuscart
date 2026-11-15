/**
 * CampusCart - Premium Interactions & 3D Depth Engine
 * Inspired by Apple, Stripe, and Linear's interaction design philosophy.
 * Ultra-smooth 60 FPS performance, mobile-optimized, respects prefers-reduced-motion.
 */

const Interactions = {
  isTouchDevice: false,
  prefersReducedMotion: false,

  init() {
    this.isTouchDevice = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.initScrollReveals();
    this.initKeyboardShortcuts();
    
    if (!this.isTouchDevice && !this.prefersReducedMotion) {
      this.init3DTilt();
    }
  },

  /**
   * Scroll-triggered reveals for editorial sections
   */
  initScrollReveals() {
    if (this.prefersReducedMotion) {
      document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
  },

  /**
   * Subtle 3D Card Tilt with Specular Glare (Apple Product Stage style)
   */
  init3DTilt() {
    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest('.tilt-card');
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle, refined angles (max 5 degrees)
      const rotateX = ((y - centerY) / centerY) * -4.5;
      const rotateY = ((x - centerX) / centerX) * 4.5;

      requestAnimationFrame(() => {
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(4px)`;
        
        // Dynamic specular highlight reflection
        const glare = card.querySelector('.specular-glare');
        if (glare) {
          const glareX = (x / rect.width) * 100;
          const glareY = (y / rect.height) * 100;
          glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%)`;
          glare.style.opacity = '1';
        }
      });
    });

    document.addEventListener('mouseout', (e) => {
      const card = e.target.closest('.tilt-card');
      if (!card || card.contains(e.relatedTarget)) return;

      requestAnimationFrame(() => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        const glare = card.querySelector('.specular-glare');
        if (glare) glare.style.opacity = '0';
      });
    });
  },

  /**
   * Universal keyboard shortcuts (Cmd+K / Ctrl+K search, Esc to close modals)
   */
  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Cmd+K or Ctrl+K opens omnibar
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('hero-omnibar-input') || 
                            document.getElementById('marketplace-search-input') ||
                            document.getElementById('mobile-search-input');
        if (searchInput) {
          searchInput.focus();
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }

      // Escape closes modals
      if (e.key === 'Escape') {
        ProductDetailModal.close();
        CollegeSelectorModal.close();
        AuthModal.close();
        SellItemModal.close();
        UserProfileModal.close();
        ReportModal.close();
        Marketplace.closeMobileFilter();
      }
    });
  }
};

window.Interactions = Interactions;
