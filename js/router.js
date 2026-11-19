/**
 * CampusCart - Intelligent SPA History & Back-Button Router
 * Ensures pressing the browser/hardware back button navigates backwards 1 step at a time
 * (closes active modals, closes mobile drawer, returns to marketplace view, or resets filters)
 * instead of abruptly exiting the entire website.
 */

const Router = {
  _modalStack: [],
  _isInternalPop: false,
  _initialized: false,

  init() {
    if (this._initialized) return;
    this._initialized = true;

    // 1. Establish initial baseline history state
    this._parseInitialHash();

    if (!window.history.state) {
      window.history.replaceState({
        type: 'view',
        view: (typeof state !== 'undefined' && state.activeView) || 'marketplace',
        category: (typeof state !== 'undefined' && state.activeCategory) || 'All'
      }, '', window.location.pathname + window.location.search + (window.location.hash || ''));
    }

    // 2. Wrap all modal open/close functions dynamically
    this._wrapModals();

    // 3. Listen to state view changes to keep history synchronized
    this._bindStateEvents();

    // 4. Handle popstate (Hardware / Browser back and forward buttons)
    window.addEventListener('popstate', (e) => this._handlePopState(e));

    // 5. Global backdrop click listener to close modals
    this._bindBackdropClicks();

    console.log('🧭 Router: Single-step back-navigation & history management active.');
  },

  _parseInitialHash() {
    const hash = window.location.hash;
    if (!hash || typeof state === 'undefined') return;

    if (hash.startsWith('#view=')) {
      const v = hash.replace('#view=', '');
      if (['marketplace', 'inbox', 'seller-dashboard', 'admin'].includes(v)) {
        state.activeView = v;
      }
    } else if (hash.startsWith('#category=')) {
      const cat = decodeURIComponent(hash.replace('#category=', ''));
      state.activeCategory = cat;
    }
  },

  _wrapModals() {
    const modalDefinitions = [
      { name: 'product-detail', getObj: () => (typeof window !== 'undefined' && window.ProductDetailModal) },
      { name: 'college-selector', getObj: () => (typeof window !== 'undefined' && window.CollegeSelectorModal) },
      { name: 'sell-item', getObj: () => (typeof window !== 'undefined' && window.SellItemModal) },
      { name: 'auth', getObj: () => (typeof window !== 'undefined' && window.AuthModal) },
      { name: 'user-profile', getObj: () => (typeof window !== 'undefined' && window.UserProfileModal) },
      { name: 'report', getObj: () => (typeof window !== 'undefined' && window.ReportModal) }
    ];

    modalDefinitions.forEach(def => {
      const obj = def.getObj();
      if (!obj || obj._routerWrapped) return;
      obj._routerWrapped = true;

      const origOpen = obj.open ? obj.open.bind(obj) : null;
      const origClose = obj.close ? obj.close.bind(obj) : null;

      if (origOpen) {
        obj.open = (...args) => {
          Router.pushModal(def.name, () => {
            if (origClose) origClose();
          });
          return origOpen(...args);
        };
      }

      if (origClose) {
        obj.close = (...args) => {
          Router.onModalClosed(def.name);
          return origClose(...args);
        };
      }
    });

    // Also wrap mobile drawer menu
    if (typeof window !== 'undefined' && window.Navbar && !window.Navbar._routerWrapped) {
      window.Navbar._routerWrapped = true;
      const origToggle = window.Navbar.toggleMobileMenu ? window.Navbar.toggleMobileMenu.bind(window.Navbar) : null;
      if (origToggle) {
        window.Navbar.toggleMobileMenu = () => {
          const drawer = document.getElementById('mobile-nav-drawer');
          const isOpening = drawer && drawer.classList.contains('hidden');
          origToggle();
          if (isOpening) {
            Router.pushModal('mobile-drawer', () => {
              const d = document.getElementById('mobile-nav-drawer');
              if (d && !d.classList.contains('hidden')) d.classList.add('hidden');
            });
          } else {
            Router.onModalClosed('mobile-drawer');
          }
        };
      }
    }
  },

  pushModal(name, closeFn) {
    // Prevent duplicate push for the same modal
    if (this._modalStack.length > 0 && this._modalStack[this._modalStack.length - 1].name === name) {
      return;
    }

    this._modalStack.push({ name, close: closeFn });
    const currentView = (typeof state !== 'undefined' && state.activeView) || 'marketplace';
    
    window.history.pushState({
      type: 'modal',
      name: name,
      view: currentView
    }, '', window.location.pathname + window.location.search + `#modal=${name}`);
  },

  onModalClosed(name) {
    const idx = this._modalStack.findIndex(m => m.name === name);
    if (idx !== -1) {
      this._modalStack.splice(idx, 1);
      // If browser history has this modal on top, pop it cleanly
      if (window.history.state && window.history.state.type === 'modal' && window.history.state.name === name) {
        this._isInternalPop = true;
        window.history.back();
      }
    }
  },

  _bindStateEvents() {
    if (typeof state === 'undefined') return;

    const origSetActiveView = state.setActiveView.bind(state);
    state.setActiveView = (view, fromPop = false) => {
      const prevView = state.activeView;
      origSetActiveView(view);

      if (!fromPop && view !== prevView) {
        const hash = view === 'marketplace' ? '' : `#view=${view}`;
        window.history.pushState({
          type: 'view',
          view: view,
          category: state.activeCategory
        }, '', window.location.pathname + window.location.search + hash);
      }
    };

    const origSetActiveCategory = state.setActiveCategory.bind(state);
    state.setActiveCategory = (category, fromPop = false) => {
      const prevCategory = state.activeCategory;
      origSetActiveCategory(category);

      if (!fromPop && category !== prevCategory && category !== 'All') {
        window.history.pushState({
          type: 'category',
          category: category,
          view: state.activeView
        }, '', window.location.pathname + window.location.search + `#category=${encodeURIComponent(category)}`);
      }
    };
  },

  _handlePopState(e) {
    // If popstate was triggered by our own in-app close calling history.back(), skip
    if (this._isInternalPop) {
      this._isInternalPop = false;
      return;
    }

    // 1. If any modal or mobile drawer is in the modal stack, close it!
    if (this._modalStack.length > 0) {
      const modal = this._modalStack.pop();
      try {
        if (typeof modal.close === 'function') {
          modal.close();
        }
      } catch (err) {
        console.warn('Error closing modal on back:', err);
      }
      return; // Handled! User stays on the page.
    }

    // Fallback: check DOM elements directly in case one was opened outside wrapper
    const openModals = [
      { id: 'product-detail-modal', close: () => window.ProductDetailModal?.close() },
      { id: 'college-modal', close: () => window.CollegeSelectorModal?.close() },
      { id: 'sell-item-modal', close: () => window.SellItemModal?.close() },
      { id: 'auth-modal', close: () => window.AuthModal?.close() },
      { id: 'user-profile-modal', close: () => window.UserProfileModal?.close() },
      { id: 'report-modal', close: () => window.ReportModal?.close() }
    ];

    for (const m of openModals) {
      const el = document.getElementById(m.id);
      if (el && (el.classList.contains('open') || el.style.display === 'flex' || el.style.display === 'block')) {
        m.close();
        return; // Handled!
      }
    }

    // Check mobile drawer
    const drawer = document.getElementById('mobile-nav-drawer');
    if (drawer && !drawer.classList.contains('hidden')) {
      drawer.classList.add('hidden');
      return; // Handled!
    }

    // 2. If category in history state differs from current category, restore category
    const targetCategory = (e.state && e.state.category) || 'All';
    if (typeof state !== 'undefined' && state.activeCategory !== targetCategory) {
      state.setActiveCategory(targetCategory, true /* fromPop */);
      if (window.PopularCategories) window.PopularCategories.render();
      if (window.Marketplace) window.Marketplace.loadProducts();
      return; // Handled!
    }

    // 3. If view in history state differs from current view, switch view
    const targetView = (e.state && e.state.view) || 'marketplace';
    if (typeof state !== 'undefined' && state.activeView !== targetView) {
      state.setActiveView(targetView, true /* fromPop */);
      return; // Handled!
    }

    // 4. If currently in a non-marketplace view (e.g. inbox, seller-dashboard), return to marketplace
    if (typeof state !== 'undefined' && state.activeView !== 'marketplace') {
      state.setActiveView('marketplace', true /* fromPop */);
      return; // Handled!
    }

    // 5. If a category filter is active other than 'All', reset to All
    if (typeof state !== 'undefined' && state.activeCategory && state.activeCategory !== 'All') {
      state.setActiveCategory('All', true /* fromPop */);
      if (window.PopularCategories) window.PopularCategories.render();
      if (window.Marketplace) window.Marketplace.loadProducts();
      return; // Handled!
    }

    // 5. If at root of marketplace with no modals and no active filters,
    // let browser proceed normally (return to previous site).
  },

  _bindBackdropClicks() {
    document.addEventListener('click', (e) => {
      // Check if user clicked on modal overlay backdrop (outside modal-card / modal-content)
      const isOverlay = e.target.classList && (
        e.target.classList.contains('modal-overlay') || 
        e.target.classList.contains('modal-backdrop') ||
        e.target.id === 'product-detail-modal' ||
        e.target.id === 'college-modal' ||
        e.target.id === 'sell-item-modal' ||
        e.target.id === 'auth-modal' ||
        e.target.id === 'user-profile-modal' ||
        e.target.id === 'report-modal'
      );
      if (isOverlay) {
        if (e.target.id === 'product-detail-modal') window.ProductDetailModal?.close();
        else if (e.target.id === 'college-modal') window.CollegeSelectorModal?.close();
        else if (e.target.id === 'sell-item-modal') window.SellItemModal?.close();
        else if (e.target.id === 'auth-modal') window.AuthModal?.close();
        else if (e.target.id === 'user-profile-modal') window.UserProfileModal?.close();
        else if (e.target.id === 'report-modal') window.ReportModal?.close();
      }
    });
  }
};

window.Router = Router;
