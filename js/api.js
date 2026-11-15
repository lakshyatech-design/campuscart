/**
 * CampusCart - Client API Layer & Real-time SSE Connection
 */
const API = {
  baseUrl: window.location.origin,

  getToken() {
    return localStorage.getItem('campuscart_token');
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('campuscart_token', token);
    } else {
      localStorage.removeItem('campuscart_token');
    }
  },

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `HTTP error ${response.status}`);
      }

      return data;
    } catch (err) {
      console.error(`API Error on ${endpoint}:`, err);
      throw err;
    }
  },

  // Auth Endpoints
  async register(formData) {
    const data = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    if (data.token) this.setToken(data.token);
    return data;
  },

  async login(email, password) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.token) this.setToken(data.token);
    return data;
  },

  async getMe() {
    return await this.request('/api/auth/me');
  },

  async switchDemoUser(userId) {
    const data = await this.request('/api/auth/switch-demo', {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
    if (data.token) this.setToken(data.token);
    return data;
  },

  logout() {
    this.setToken(null);
  },

  // Colleges
  async getColleges() {
    return await this.request('/api/colleges');
  },

  async requestNewCollege(data) {
    return await this.request('/api/colleges/request', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    Object.keys(params).forEach(k => {
      if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
        query.append(k, params[k]);
      }
    });
    return await this.request(`/api/products?${query.toString()}`);
  },

  async getProduct(id) {
    return await this.request(`/api/products/${id}`);
  },

  async createProduct(data) {
    return await this.request('/api/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateProduct(id, data) {
    return await this.request(`/api/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  async deleteProduct(id) {
    return await this.request(`/api/products/${id}`, {
      method: 'DELETE'
    });
  },

  async markAsSold(id) {
    return await this.request(`/api/products/${id}/mark-sold`, {
      method: 'POST'
    });
  },

  // Conversations & Real-Time Chat
  async getConversations() {
    return await this.request('/api/conversations');
  },

  async startConversation(productId, initialMessage) {
    return await this.request('/api/conversations', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, initial_message: initialMessage })
    });
  },

  async getMessages(conversationId) {
    return await this.request(`/api/conversations/${conversationId}/messages`);
  },

  async sendMessage(conversationId, content) {
    return await this.request(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content })
    });
  },

  // Wishlist
  async getWishlist() {
    return await this.request('/api/wishlist');
  },

  async toggleWishlist(productId) {
    return await this.request('/api/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId })
    });
  },

  // Reports
  async submitReport(data) {
    return await this.request('/api/reports', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Notifications
  async getNotifications() {
    return await this.request('/api/notifications');
  },

  async markNotificationsRead() {
    return await this.request('/api/notifications/mark-read', {
      method: 'POST'
    });
  },

  // Image Upload
  async uploadImage(dataUrl, filename) {
    return await this.request('/api/upload', {
      method: 'POST',
      body: JSON.stringify({ dataUrl, filename })
    });
  },

  // Admin
  async getAdminStats() {
    return await this.request('/api/admin/stats');
  },

  async getAdminCollegeRequests() {
    return await this.request('/api/admin/college-requests');
  },

  async approveCollegeRequest(id) {
    return await this.request('/api/admin/college-requests/approve', {
      method: 'POST',
      body: JSON.stringify({ id })
    });
  },

  async toggleCollegeActive(id, is_active) {
    return await this.request('/api/admin/colleges/toggle', {
      method: 'POST',
      body: JSON.stringify({ id, is_active })
    });
  },

  async getAdminReports() {
    return await this.request('/api/admin/reports');
  },

  async resolveReport(id, action) {
    return await this.request('/api/admin/reports/resolve', {
      method: 'POST',
      body: JSON.stringify({ id, action })
    });
  },

  async getAdminUsers() {
    return await this.request('/api/admin/users');
  },

  async toggleUserSuspension(userId, is_suspended) {
    return await this.request('/api/admin/users/toggle-suspend', {
      method: 'POST',
      body: JSON.stringify({ userId, is_suspended })
    });
  },

  async getSupabaseConfig() {
    return await this.request('/api/config/supabase');
  },

  // Realtime EventSource Stream
  connectRealtime(userId, onEvent) {
    const streamUrl = `${this.baseUrl}/api/realtime/stream?userId=${encodeURIComponent(userId || '')}`;
    const eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (onEvent) onEvent(payload);
      } catch (err) {
        // Heartbeat or parse error
      }
    };

    eventSource.onerror = () => {
      // Reconnects automatically by browser
    };

    return eventSource;
  }
};
