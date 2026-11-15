/**
 * CampusCart - Product Detail Modal Component (Forge Automotive Dark Luxury)
 */
const ProductDetailModal = {
  activeProduct: null,
  activeImageIndex: 0,

  async open(productId) {
    let modalEl = document.getElementById('product-detail-modal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'product-detail-modal';
      modalEl.className = 'modal-overlay';
      document.body.appendChild(modalEl);
    }

    modalEl.classList.add('open');
    modalEl.style.display = 'flex';
    modalEl.innerHTML = `
      <div class="modal-card" style="max-width: 500px; padding: 3rem 2rem; text-align: center;">
        <div class="loading-spinner" style="margin: 0 auto 1rem;"></div>
        <p style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em;">Loading product details...</p>
      </div>
    `;

    try {
      const res = await API.getProduct(productId);
      this.activeProduct = res.product;
      this.activeImageIndex = 0;
      this.render();
    } catch (err) {
      modalEl.innerHTML = `
        <div class="modal-card" style="max-width: 440px; padding: 2rem; text-align: center;">
          <p style="color: var(--danger); font-weight: 600; margin-bottom: 1rem;">Could not load product details.</p>
          <button class="btn btn-secondary btn-sm" onclick="ProductDetailModal.close()">Close</button>
        </div>
      `;
    }
  },

  close() {
    const modalEl = document.getElementById('product-detail-modal');
    if (modalEl) {
      modalEl.classList.remove('open');
      modalEl.style.display = 'none';
    }
  },

  render() {
    const p = this.activeProduct;
    if (!p) return;

    const modalEl = document.getElementById('product-detail-modal');
    const images = Array.isArray(p.images) && p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'];
    const currentImg = images[this.activeImageIndex] || images[0];
    const isFav = state.wishlistIds.has(p.id);
    const isSeller = state.currentUser && state.currentUser.id === p.seller_id;
    const isTicket = p.category === 'Railway Tickets';
    const isPerfume = p.category === 'Perfumes';
    const dyn = p.dynamic_attributes || {};

    modalEl.innerHTML = `
      <div class="modal-card" style="max-width: 860px; width: 100%;">
        <div class="modal-header">
          <div class="flex items-center gap-2">
            <span class="product-category-tag">${p.category}</span>
            <span style="font-size: 0.78rem; color: var(--text-muted);">Posted by ${p.seller_name} (${p.college_short_name || 'GSV'})</span>
          </div>
          <button class="modal-close-btn" onclick="ProductDetailModal.close()" title="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="modal-body">
          <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;" class="detail-split">
            <!-- Left: Image Gallery -->
            <div>
              <div style="position: relative; width: 100%; aspect-ratio: 4/3; background: var(--bg-subtle); border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border); margin-bottom: 0.75rem;">
                <img src="${currentImg}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: contain;" />
                <span class="product-badge-condition" style="position: absolute; top: 0.75rem; left: 0.75rem;">${p.condition}</span>
              </div>

              <!-- Thumbnails -->
              ${images.length > 1 ? `
                <div style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.5rem; margin-bottom: 1rem;">
                  ${images.map((img, idx) => `
                    <div 
                      onclick="ProductDetailModal.setActiveImage(${idx})"
                      style="width: 60px; height: 60px; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid ${idx === this.activeImageIndex ? 'var(--accent)' : 'var(--border)'}; cursor: pointer; flex-shrink: 0;"
                    >
                      <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;" alt="Thumbnail" />
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              <!-- Verified Campus Safety Notice -->
              <div style="background: var(--surface-raised); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1rem; margin-top: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.4rem; font-weight: 700; font-size: 0.78rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.35rem;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  GSV Campus Protocol
                </div>
                <ul style="font-size: 0.76rem; color: var(--text-muted); list-style: disc; padding-left: 1.2rem; line-height: 1.5;">
                  <li>Meet in a designated area (Central Canteen or Hostel Gate).</li>
                  <li>Inspect item in person before direct UPI payment.</li>
                  <li>Zero platform fees — 100% student-to-student.</li>
                </ul>
              </div>
            </div>

            <!-- Right: Details & Actions -->
            <div>
              <div style="margin-bottom: 1.25rem;">
                <h2 style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 600; color: var(--text-primary); line-height: 1.3; margin-bottom: 0.5rem;">
                  ${p.title}
                </h2>
                <div style="display: flex; align-items: baseline; gap: 0.75rem;">
                  <span style="font-family: var(--font-display); font-size: 2rem; font-weight: 700; color: var(--accent); font-variant-numeric: tabular-nums;">
                    ₹${p.price.toLocaleString('en-IN')}
                  </span>
                  <span style="font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--success);">
                    Verified Student Price
                  </span>
                </div>
              </div>

              <!-- Campus Pickup Point -->
              <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.65rem 0.85rem; background: var(--surface-raised); border: 1px solid var(--border); border-radius: var(--radius-md); margin-bottom: 1rem; font-size: 0.82rem;">
                <span style="color: var(--accent);">📍</span>
                <div>
                  <strong>Pickup Point:</strong> ${p.campus_location || 'Campus'} &bull; <span style="color: var(--text-muted);">${p.college_name}</span>
                </div>
              </div>

              <!-- Railway Journey Details -->
              ${isTicket ? `
                <div style="background: rgba(200, 169, 126, 0.06); border: 1px solid var(--border-accent); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1rem;">
                  <div style="font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); margin-bottom: 0.5rem;">
                    🚆 Railway Journey Details
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; font-size: 0.8rem; color: var(--text-secondary);">
                    <div><strong>Journey Date:</strong> ${dyn.journey_date || 'N/A'}</div>
                    <div><strong>Class:</strong> ${dyn.ticket_type || '3AC'}</div>
                    <div><strong>From:</strong> ${dyn.from_station || 'Vadodara (BRC)'}</div>
                    <div><strong>To:</strong> ${dyn.to_station || 'Destination'}</div>
                    <div style="grid-column: 1 / -1;"><strong>Train:</strong> ${dyn.train_name_number || 'Express'}</div>
                  </div>
                  <div style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed var(--border); font-size: 0.7rem; color: var(--text-muted); line-height: 1.35;">
                    ⚠️ Compliance: Student transfers must follow Indian Railway rules. Commercial reselling is prohibited.
                  </div>
                </div>
              ` : ''}

              <!-- Description -->
              <div style="margin-bottom: 1.25rem;">
                <h4 style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 0.35rem;">Description</h4>
                <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; white-space: pre-line;">
                  ${p.description}
                </p>
              </div>

              <!-- Seller Profile Card -->
              <div style="background: var(--surface-raised); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 0.85rem; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <img src="${p.seller_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}" class="chat-avatar" alt="${p.seller_name}" />
                  <div>
                    <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.35rem;">
                      ${p.seller_name}
                      <span style="color: var(--success); font-size: 0.72rem;">✓</span>
                    </div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">
                      ${p.college_name}
                    </div>
                  </div>
                </div>
                <div style="text-align: right; font-size: 0.72rem; color: var(--text-muted);">
                  <div>Typically replies</div>
                  <strong style="color: var(--accent);">Within minutes</strong>
                </div>
              </div>

              <!-- Action CTAs -->
              <div style="display: flex; flex-direction: column; gap: 0.65rem;">
                ${isSeller ? `
                  <button class="btn btn-secondary w-full" style="width: 100%;" onclick="ProductDetailModal.close(); state.setActiveView('seller-dashboard');">
                    Manage in Seller Dashboard
                  </button>
                ` : `
                  <button class="btn btn-primary btn-lg w-full" style="width: 100%;" onclick="ProductDetailModal.handleContactSeller()">
                    Contact Seller (Internal Chat)
                  </button>
                `}

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                  <button class="btn btn-secondary btn-sm" onclick="Marketplace.toggleWishlist('${p.id}')">
                    ${isFav ? '★ Saved to Wishlist' : '☆ Save Item'}
                  </button>
                  <button class="btn btn-secondary btn-sm" onclick="ProductDetailModal.shareProduct()">
                    Share Link
                  </button>
                </div>

                <div style="text-align: center; margin-top: 0.25rem;">
                  <a href="#" onclick="event.preventDefault(); ReportModal.open('product', '${p.id}', '${p.title.replace(/'/g, "\\'")}');" style="font-size: 0.72rem; color: var(--text-muted);">
                    Report suspicious listing
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // On desktop, make detail split 2-column
    const styleEl = document.getElementById('detail-split-style');
    if (!styleEl) {
      const s = document.createElement('style');
      s.id = 'detail-split-style';
      s.textContent = `
        @media (min-width: 768px) {
          .detail-split { grid-template-columns: 1fr 1fr !important; }
        }
      `;
      document.head.appendChild(s);
    }
  },

  setActiveImage(index) {
    this.activeImageIndex = index;
    this.render();
  },

  async handleContactSeller() {
    const p = this.activeProduct;
    if (!p) return;

    if (!state.currentUser) {
      showToast('Please sign in to chat with the seller', 'info');
      AuthModal.open('login');
      return;
    }

    try {
      this.close();
      const res = await API.startConversation(p.id);
      state.activeConversationId = res.conversation.id;
      state.setActiveView('inbox');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  shareProduct() {
    const p = this.activeProduct;
    if (navigator.share) {
      navigator.share({
        title: `CampusCart: ${p.title}`,
        text: `Check out ${p.title} for ₹${p.price} on CampusCart (${p.college_short_name})!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'success');
    }
  }
};
