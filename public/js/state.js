/**
 * CampusCart - Reactive Application State
 */
class StateManager {
  constructor() {
    this.currentUser = null;
    this.selectedCollege = null; // Will default to GSV
    this.colleges = [];
    this.exploreAllColleges = false;
    this.activeCategory = 'All';
    this.searchQuery = '';
    this.priceRange = { min: 0, max: 20000 };
    this.conditionFilter = 'All';
    this.sortBy = 'latest';
    this.activeView = 'marketplace'; // 'marketplace', 'inbox', 'seller-dashboard', 'admin'
    this.wishlistIds = new Set();
    this.unreadNotificationsCount = 0;
    this.unreadMessagesCount = 0;
    this.activeConversationId = null;

    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try {
          cb(data);
        } catch (e) {
          console.error(`Error in listener for event "${event}":`, e);
        }
      });
    }
  }

  setCurrentUser(user) {
    this.currentUser = user;
    if (user && user.college_id && !this.selectedCollege) {
      const match = this.colleges.find(c => c.id === user.college_id);
      if (match) this.setSelectedCollege(match);
    }
    this.emit('user_changed', user);
  }

  async logout() {
    try {
      if (window.API && typeof window.API.logout === 'function') {
        window.API.logout();
      }
    } catch (e) {
      console.warn('API logout warning:', e);
    }
    try {
      localStorage.removeItem('campuscart_token');
      localStorage.removeItem('campuscart_user');
      sessionStorage.clear();
    } catch (e) {}
    this.setCurrentUser(null);
    this.setActiveView('marketplace');
    if (window.showToast) {
      window.showToast('Signed out successfully.', 'info');
    }
    if (window.Navbar && typeof window.Navbar.render === 'function') {
      window.Navbar.render();
    }
    if (window.Marketplace && typeof window.Marketplace.loadProducts === 'function') {
      window.Marketplace.loadProducts();
    }
  }

  setColleges(colleges) {
    this.colleges = colleges;
    // Default to GSV if no college chosen
    if (!this.selectedCollege) {
      const gsv = colleges.find(c => c.id === 'gsv-vadodara') || colleges[0];
      this.setSelectedCollege(gsv);
    }
    this.emit('colleges_changed', colleges);
  }

  setSelectedCollege(college) {
    this.selectedCollege = college;
    localStorage.setItem('campuscart_college_id', college.id);
    this.emit('college_changed', college);
  }

  setExploreAllColleges(val) {
    this.exploreAllColleges = Boolean(val);
    this.emit('filter_changed');
  }

  setActiveCategory(category) {
    this.activeCategory = category;
    this.emit('filter_changed');
  }

  setSearchQuery(q) {
    this.searchQuery = q;
    this.emit('filter_changed');
  }

  setPriceRange(min, max) {
    this.priceRange = { min, max };
    this.emit('filter_changed');
  }

  setConditionFilter(condition) {
    this.conditionFilter = condition;
    this.emit('filter_changed');
  }

  setSortBy(sort) {
    this.sortBy = sort;
    this.emit('filter_changed');
  }

  setActiveView(view) {
    this.activeView = view;
    if (typeof document !== 'undefined' && document.body) {
      document.body.setAttribute('data-view', view);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    this.emit('view_changed', view);
  }

  setWishlist(items) {
    this.wishlistIds = new Set(items.map(i => i.id));
    this.emit('wishlist_changed', this.wishlistIds);
  }

  toggleWishlistId(productId, isAdded) {
    if (isAdded) {
      this.wishlistIds.add(productId);
    } else {
      this.wishlistIds.delete(productId);
    }
    this.emit('wishlist_changed', this.wishlistIds);
  }

  setUnreadCounts(notifCount, msgCount) {
    if (typeof notifCount === 'number') this.unreadNotificationsCount = notifCount;
    if (typeof msgCount === 'number') this.unreadMessagesCount = msgCount;
    this.emit('counts_changed', {
      notifications: this.unreadNotificationsCount,
      messages: this.unreadMessagesCount
    });
  }
}

const state = new StateManager();

// Categories Definition with specific metadata
const CATEGORIES = [
  { id: 'Railway Tickets', name: 'Railway Tickets', icon: 'train', count: 12, desc: 'Student ticket shifts strictly complying with Indian Railway transfer guidelines' },
  { id: 'Perfumes', name: 'Perfumes', icon: 'sparkles', count: 18, desc: 'Designer & Middle Eastern fragrances, partial bottles & decants' },
  { id: 'Books & Study Materials', name: 'Books & Notes', icon: 'book', count: 45, desc: 'Engineering textbooks, semester notes, GATE guides' },
  { id: 'Electronics & Gadgets', name: 'Electronics', icon: 'laptop', count: 29, desc: 'Calculators, headphones, keyboards, monitors' },
  { id: 'Cycles', name: 'Cycles & Bikes', icon: 'bike', count: 14, desc: 'Campus commute bicycles, locks, gear bikes' },
  { id: 'Hostel Essentials', name: 'Hostel Essentials', icon: 'home', count: 38, desc: 'Kettles, mattress, buckets, heaters, table lamps' },
  { id: 'Sports Equipment', name: 'Sports', icon: 'activity', count: 16, desc: 'Badminton rackets, cricket bats, footballs, gym gear' },
  { id: 'Fashion & Clothing', name: 'Fashion', icon: 'tag', count: 22, desc: 'Jackets, hoodies, formal blazers, sports jerseys' },
  { id: 'Accessories', name: 'Accessories', icon: 'shieldCheck', count: 19, desc: 'Backpacks, smartwatches, sunglasses' },
  { id: 'Others', name: 'Others', icon: 'shoppingBag', count: 11, desc: 'Miscellaneous student items' }
];

window.state = state;
