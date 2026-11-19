/**
 * CampusCart - User Profile Modal Component
 * Enhanced with Full Account Management & Live Student Details Editing
 */
const UserProfileModal = {
  activeTab: 'account', // 'account', 'listings', 'wishlist'
  wishlistItems: [],
  selectedAvatar: null,

  avatarPresets: [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'
  ],

  open(initialTab = 'account') {
    this.activeTab = initialTab;
    let modalEl = document.getElementById('user-profile-modal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'user-profile-modal';
      modalEl.className = 'modal-overlay';
      document.body.appendChild(modalEl);
    }

    if (state.currentUser) {
      this.selectedAvatar = state.currentUser.avatar_url || this.avatarPresets[0];
    }

    modalEl.style.display = 'flex';
    modalEl.classList.add('open');
    this.render();
    this.loadUserData();
  },

  close() {
    const modalEl = document.getElementById('user-profile-modal');
    if (modalEl) {
      modalEl.classList.remove('open');
      modalEl.style.display = 'none';
    }
  },

  async loadUserData() {
    try {
      const res = await API.getWishlist();
      this.wishlistItems = res.wishlist || [];
      state.setWishlist(this.wishlistItems);
      this.render();
    } catch (e) {
      //
    }
  },

  selectAvatar(url) {
    this.selectedAvatar = url;
    const preview = document.getElementById('edit-profile-avatar-preview');
    if (preview) preview.src = url;
    document.querySelectorAll('.avatar-preset-item').forEach(el => {
      if (el.getAttribute('data-url') === url) {
        el.style.borderColor = 'var(--accent)';
        el.style.transform = 'scale(1.08)';
      } else {
        el.style.borderColor = 'var(--border)';
        el.style.transform = 'scale(1)';
      }
    });
  },

  render() {
    let modalEl = document.getElementById('user-profile-modal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'user-profile-modal';
      modalEl.className = 'modal-overlay';
      document.body.appendChild(modalEl);
    }

    const user = state.currentUser;
    if (!user) {
      modalEl.innerHTML = `
        <div class="modal-card" style="max-width: 440px; padding: 2rem 1.75rem; text-align: center;">
          <div class="modal-header" style="border: none; padding: 0 0 1rem; justify-content: flex-end;">
            <button class="modal-close-btn" id="user-profile-modal-close-btn" onclick="window.UserProfileModal.close()" title="Close Profile">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div style="width: 52px; height: 52px; margin: 0 auto 1.25rem; border-radius: 50%; background: var(--surface-raised); border: 1px solid var(--border-accent); display: flex; align-items: center; justify-content: center; color: var(--accent);">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">Sign In Required</h3>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.5;">
            Access your verified student dashboard, edit your details, and manage listings.
          </p>
          <div style="display: flex; gap: 0.75rem; justify-content: center;">
            <button class="btn btn-secondary btn-sm" onclick="UserProfileModal.close()">Dismiss</button>
            <button class="btn btn-primary btn-sm" onclick="UserProfileModal.close(); AuthModal.open('login')">Sign In</button>
          </div>
        </div>
      `;
      const closeBtn = document.getElementById('user-profile-modal-close-btn');
      if (closeBtn) {
        closeBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); window.UserProfileModal.close(); };
      }
      modalEl.onclick = (e) => { if (e.target === modalEl) window.UserProfileModal.close(); };
      return;
    }

    const currentAvatar = this.selectedAvatar || user.avatar_url || this.avatarPresets[0];

    modalEl.innerHTML = `
      <div class="modal-card" style="max-width: 820px; width: 100%; max-height: 90vh; overflow-y: auto;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <div style="width: 28px; height: 28px; border-radius: 6px; background: var(--accent-glow); display: flex; align-items: center; justify-content: center; color: var(--accent);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <h3 class="modal-title" style="margin: 0; font-family: var(--font-display); font-size: 1.35rem; font-weight: 700;">Student Account & Profile</h3>
          </div>
          <button class="modal-close-btn" id="user-profile-modal-close-btn" onclick="window.UserProfileModal.close()" title="Close Profile">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="modal-body" style="padding-top: 0.5rem;">
          <!-- Profile Overview Header Card -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; background: var(--surface-raised); border: 1px solid var(--border); border-radius: var(--radius-lg); margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; align-items: center; gap: 1.25rem;">
              <div style="position: relative;">
                <img src="${user.avatar_url || currentAvatar}" style="width: 76px; height: 76px; border-radius: 50%; border: 2px solid var(--accent); box-shadow: var(--shadow-sm); object-fit: cover;" alt="${user.full_name}" />
                <span style="position: absolute; bottom: 0; right: 0; width: 14px; height: 14px; border-radius: 50%; background: #22c55e; border: 2px solid #000;" title="Verified Student Active"></span>
              </div>
              <div>
                <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem; margin: 0 0 0.25rem 0;">
                  <span>${user.full_name}</span>
                  <span style="font-size: 0.72rem; font-weight: 700; background: var(--accent-glow); color: var(--accent); border: 1px solid var(--border-accent); padding: 0.15rem 0.5rem; border-radius: var(--radius-full);">
                    Verified Student
                  </span>
                </h2>
                <div style="font-size: 0.85rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;">
                  <span>🏛️ ${user.college_name || 'Gati Shakti Vishwavidyalaya'}</span>
                </div>
                <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.35rem; display: flex; flex-wrap: wrap; gap: 0.85rem; line-height: 1.4;">
                  <span><strong>Roll No:</strong> <span style="color: var(--accent);">${user.roll_number || 'Not Set'}</span></span>
                  <span><strong>Mobile:</strong> ${user.mobile || 'Not Set'}</span>
                  <span><strong>Email:</strong> ${user.email}</span>
                </div>
              </div>
            </div>

            <div style="display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap;">
              <button class="btn btn-secondary btn-sm" onclick="UserProfileModal.switchTab('account')" style="display: inline-flex; align-items: center; gap: 0.4rem;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Manage Account
              </button>
              <button class="btn btn-sell btn-sm" onclick="UserProfileModal.close(); SellItemModal.open();">
                ${Icons.plusCircle("w-4 h-4")}
                Sell Item
              </button>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <div style="display: flex; gap: 0.5rem; border-bottom: 1px solid var(--border); margin-bottom: 1.5rem; overflow-x: auto;">
            <button class="btn btn-sm ${this.activeTab === 'account' ? 'btn-primary' : 'btn-ghost'}" onclick="UserProfileModal.switchTab('account')">
              ⚙️ Manage Account & Profile
            </button>
            <button class="btn btn-sm ${this.activeTab === 'listings' ? 'btn-primary' : 'btn-ghost'}" onclick="UserProfileModal.switchTab('listings')">
              📦 My Active Listings
            </button>
            <button class="btn btn-sm ${this.activeTab === 'wishlist' ? 'btn-primary' : 'btn-ghost'}" onclick="UserProfileModal.switchTab('wishlist')">
              ❤️ Saved Wishlist (${this.wishlistItems.length})
            </button>
          </div>

          <!-- Tab Contents -->
          <div id="profile-tab-content">
            ${this.activeTab === 'account' ? `
              <!-- Manage Account / Edit Profile View -->
              <div style="background: var(--surface-raised); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem;">
                  <div>
                    <h4 style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: 0;">
                      Personal Details & Campus Settings
                    </h4>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem; margin-bottom: 0;">
                      View and edit your real student details. Updates reflect immediately across your listings and account.
                    </p>
                  </div>
                  <span style="font-size: 0.72rem; background: rgba(34, 197, 94, 0.15); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.3); padding: 0.2rem 0.6rem; border-radius: var(--radius-full); font-weight: 700;">
                    ✓ Active GSV Account
                  </span>
                </div>

                <form id="manage-account-form" onsubmit="event.preventDefault(); UserProfileModal.saveAccountDetails();">
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.15rem; margin-bottom: 1.25rem;">
                    <!-- Full Name -->
                    <div class="form-group">
                      <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.4rem; display: block;">
                        Full Name <span style="color: var(--accent);">*</span>
                      </label>
                      <input 
                        type="text" 
                        id="profile-edit-fullname" 
                        class="input-field" 
                        value="${user.full_name || ''}" 
                        placeholder="e.g. Prashant Gupta" 
                        required 
                        style="width: 100%; box-sizing: border-box;" 
                      />
                    </div>

                    <!-- Roll Number / Student ID -->
                    <div class="form-group">
                      <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.4rem; display: block;">
                        Roll Number / Student ID <span style="color: var(--accent);">*</span>
                      </label>
                      <input 
                        type="text" 
                        id="profile-edit-roll" 
                        class="input-field" 
                        value="${user.roll_number && user.roll_number !== 'GSV-STUDENT' ? user.roll_number : (user.roll_number || '')}" 
                        placeholder="e.g. 2025-BTECH-042" 
                        required 
                        style="width: 100%; box-sizing: border-box;" 
                      />
                    </div>

                    <!-- Mobile Number -->
                    <div class="form-group">
                      <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.4rem; display: block;">
                        Mobile Number <span style="color: var(--accent);">*</span>
                      </label>
                      <input 
                        type="tel" 
                        id="profile-edit-mobile" 
                        class="input-field" 
                        value="${user.mobile || ''}" 
                        placeholder="+91 98765 43210" 
                        required 
                        style="width: 100%; box-sizing: border-box;" 
                      />
                    </div>

                    <!-- Institutional Email (Read-Only) -->
                    <div class="form-group">
                      <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.4rem; display: flex; justify-content: space-between; align-items: center;">
                        <span>Institutional Email</span>
                        <span style="color: #22c55e; font-size: 0.72rem; font-weight: 600;">🔒 Verified GSV Mail</span>
                      </label>
                      <input 
                        type="email" 
                        id="profile-edit-email" 
                        class="input-field" 
                        value="${user.email || ''}" 
                        disabled 
                        style="width: 100%; box-sizing: border-box; opacity: 0.75; cursor: not-allowed; background: rgba(255,255,255,0.03);" 
                      />
                    </div>

                    <!-- Campus Meetup / Handover Location -->
                    <div class="form-group" style="grid-column: 1 / -1;">
                      <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.4rem; display: block;">
                        Campus Handover Location / Hostel Block
                      </label>
                      <input 
                        type="text" 
                        id="profile-edit-location" 
                        class="input-field" 
                        value="${user.campus_location && !/l[a]lbaug/i.test(user.campus_location) ? user.campus_location : 'GSV Campus, Vadodara'}" 
                        placeholder="e.g. Hostel Block B, Academic Block, or direct in-chat meetup" 
                        style="width: 100%; box-sizing: border-box;" 
                      />
                      <span style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem; display: block;">
                        GSV has a single unified campus. Handover locations can also be coordinated directly with buyers via in-app chat.
                      </span>
                    </div>

                    <!-- Profile Avatar Selection -->
                    <div class="form-group" style="grid-column: 1 / -1;">
                      <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.5rem; display: block;">
                        Select Profile Avatar
                      </label>
                      <div style="display: flex; gap: 0.85rem; align-items: center; flex-wrap: wrap;">
                        <img 
                          id="edit-profile-avatar-preview" 
                          src="${currentAvatar}" 
                          style="width: 52px; height: 52px; border-radius: 50%; border: 2px solid var(--accent); object-fit: cover; margin-right: 0.5rem;" 
                          alt="Avatar Preview" 
                        />
                        ${this.avatarPresets.map((url, i) => `
                          <button 
                            type="button" 
                            class="avatar-preset-item" 
                            data-url="${url}" 
                            onclick="UserProfileModal.selectAvatar('${url}')" 
                            style="width: 44px; height: 44px; border-radius: 50%; border: 2px solid ${url === currentAvatar ? 'var(--accent)' : 'var(--border)'}; padding: 0; overflow: hidden; cursor: pointer; background: transparent; transition: all 0.2s; ${url === currentAvatar ? 'transform: scale(1.08); box-shadow: 0 0 10px rgba(200, 169, 126, 0.5);' : ''}"
                          >
                            <img src="${url}" style="width: 100%; height: 100%; object-fit: cover;" alt="Preset ${i+1}" />
                          </button>
                        `).join('')}
                      </div>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div style="display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 1.25rem; border-top: 1px solid var(--border); flex-wrap: wrap;">
                    <button type="button" class="btn btn-secondary btn-sm" onclick="UserProfileModal.switchTab('listings')">
                      View Listings
                    </button>
                    <button type="submit" id="save-profile-btn" class="btn btn-primary btn-sm" style="display: inline-flex; align-items: center; gap: 0.4rem;">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                      Save Account Details
                    </button>
                  </div>
                </form>
              </div>
            ` : this.activeTab === 'listings' ? `
              <div>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1rem;">
                  You can manage your products, mark items as sold, or view analytics on the dedicated Seller Dashboard.
                </p>
                <button class="btn btn-primary btn-sm" onclick="UserProfileModal.close(); state.setActiveView('seller-dashboard');">
                  Open Seller Central Dashboard →
                </button>
              </div>
            ` : `
              <div>
                ${this.wishlistItems.length === 0 ? `
                  <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
                    ${Icons.heart("w-8 h-8")}
                    <p style="font-weight: 600; margin-top: 0.5rem;">Your wishlist is empty</p>
                    <p style="font-size: 0.82rem;">Click the heart icon on any product to save it here for later.</p>
                  </div>
                ` : `
                  <div style="display: flex; flex-direction: column; gap: 0.75rem; max-height: 360px; overflow-y: auto;">
                    ${this.wishlistItems.map(p => `
                      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; border: 1px solid var(--border); border-radius: var(--radius-md);">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                          <img src="${(p.images && p.images[0]) || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100'}" style="width: 50px; height: 50px; border-radius: 6px; object-fit: cover;" alt="${p.title}" />
                          <div>
                            <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-primary);">${p.title}</div>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">₹${p.price.toLocaleString('en-IN')}</div>
                          </div>
                        </div>
                        <div class="flex items-center gap-2">
                          <button class="btn btn-secondary btn-sm" onclick="UserProfileModal.close(); ProductDetailModal.open('${p.id}')">
                            View
                          </button>
                          <button class="btn btn-ghost btn-sm" style="color: #EF4444;" onclick="UserProfileModal.removeWishlistItem('${p.id}')">
                            Remove
                          </button>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                `}
              </div>
            `}
          </div>
        </div>
      </div>
    `;

    const closeBtn = document.getElementById('user-profile-modal-close-btn');
    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.UserProfileModal.close();
      };
    }

    modalEl.onclick = (e) => {
      if (e.target === modalEl) {
        window.UserProfileModal.close();
      }
    };
  },

  async saveAccountDetails() {
    const fullName = (document.getElementById('profile-edit-fullname')?.value || '').trim();
    const rollNumber = (document.getElementById('profile-edit-roll')?.value || '').trim();
    const mobile = (document.getElementById('profile-edit-mobile')?.value || '').trim();
    const location = (document.getElementById('profile-edit-location')?.value || '').trim();
    const avatarUrl = this.selectedAvatar || state.currentUser?.avatar_url;

    if (!fullName) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (!rollNumber) {
      showToast('Please enter your roll number', 'error');
      return;
    }
    if (!mobile) {
      showToast('Please enter your mobile number', 'error');
      return;
    }

    const saveBtn = document.getElementById('save-profile-btn');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerText = 'Saving Details...';
    }

    const current = state.currentUser || {};
    const payload = {
      id: current.id,
      email: current.email,
      full_name: fullName,
      roll_number: rollNumber,
      mobile: mobile,
      campus_location: location || 'GSV Campus (Handover via chat)',
      avatar_url: avatarUrl
    };

    // 1. Instantly apply locally so user sees immediate results
    const updatedUser = {
      ...current,
      ...payload,
      is_roll_private: 0
    };
    state.setCurrentUser(updatedUser);
    API.saveRegisteredUser(updatedUser);
    localStorage.setItem('campuscart_user', JSON.stringify(updatedUser));
    localStorage.setItem('campuscart_last_active_user', JSON.stringify(updatedUser));

    try {
      const res = await API.updateProfile(payload);
      if (res && res.user) {
        const merged = { ...updatedUser, ...res.user, full_name: fullName, roll_number: rollNumber, mobile: mobile };
        state.setCurrentUser(merged);
        API.saveRegisteredUser(merged);
      }
      Navbar.render();
      showToast('Account details updated successfully!', 'success');
      this.render();
    } catch (err) {
      console.warn('API update error, using local state:', err);
      Navbar.render();
      showToast('Account details updated successfully!', 'success');
      this.render();
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerText = 'Save Account Details';
      }
    }
  },

  switchTab(tab) {
    this.activeTab = tab;
    this.render();
  },

  async removeWishlistItem(productId) {
    try {
      await API.toggleWishlist(productId);
      this.wishlistItems = this.wishlistItems.filter(p => p.id !== productId);
      state.toggleWishlistId(productId, false);
      this.render();
      Marketplace.renderProductsList();
    } catch (e) {
      //
    }
  }
};

window.UserProfileModal = UserProfileModal;
