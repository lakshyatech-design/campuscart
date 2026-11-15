/**
 * CampusCart - Product Detail Modal Component
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
    modalEl.innerHTML = `
      <div class="modal-content" style="max-width: 820px; padding: 2rem; text-align: center;">
        <div style="padding: 3rem 0; color: var(--color-text-muted);">
          <div style="display: inline-block; width: 36px; height: 36px; border: 3px solid var(--color-primary-border); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
          <p style="margin-top: 1rem; font-size: 0.9rem;">Loading product details...</p>

          <!-- Sticky Mobile Action Bar -->
          <div class="modal-sticky-bottom-bar">
            <div>
              <div style="font-size: 0.72rem; color: var(--color-text-muted);">Campus Price</div>
              <div style="font-size: 1.35rem; font-weight: 800; color: var(--color-navy); line-height: 1;">
                ₹${p.price.toLocaleString('en-IN')}
              </div>
            </div>
            ${isSeller ? `
              <button class="btn btn-secondary btn-sm" onclick="ProductDetailModal.close(); state.setActiveView('seller-dashboard');">
                Manage Item
              </button>
            ` : `
              <button class="btn btn-primary btn-sm flex items-center gap-2" style="padding: 0.65rem 1.25rem; font-weight: 700;" onclick="ProductDetailModal.handleContactSeller()">
                ${Icons.messageSquare("w-4 h-4")}
                Chat with Seller
              </button>
            `}
          </div>
        </div>
      </div>
    `;

    try {
      const res = await API.getProduct(productId);
      this.activeProduct = res.product;
      this.activeImageIndex = 0;
      this.render();
    } catch (err) {
      modalEl.innerHTML = `
        <div class="modal-content" style="max-width: 500px; padding: 2rem; text-align: center;">
          <p style="color: var(--color-accent-rose); font-weight: 600;">Could not load product details.</p>
          <button class="btn btn-secondary btn-sm" style="margin-top: 1rem;" onclick="ProductDetailModal.close()">Close</button>
        </div>
      `;
    }
  },

  close() {
    const modalEl = document.getElementById('product-detail-modal');
    if (modalEl) modalEl.classList.remove('open');
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
      <div class="modal-content" style="max-width: 900px;">
        <div class="modal-grab-bar"></div>
        <div class="modal-header">
          <div class="flex items-center gap-2">
            <span class="product-category-tag">${p.category}</span>
            <span style="font-size: 0.82rem; color: var(--color-text-muted);">• Posted by ${p.seller_name} (${p.college_short_name})</span>
          </div>
          <button class="modal-close-btn" onclick="ProductDetailModal.close()">
            ${Icons.x("w-5 h-5")}
          </button>
        </div>

        <div class="modal-body" style="padding: 1.75rem;">
          <div class="product-detail-layout">
            <!-- Left: Image Gallery -->
            <div>
              <div style="position: relative; width: 100%; padding-top: 75%; background: #F8FAFC; border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--color-border); margin-bottom: 0.85rem;">
                <img src="${currentImg}" alt="${p.title}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; background: #0F172A;" />
                <span class="product-badge-condition" style="top: 0.85rem; left: 0.85rem;">${p.condition}</span>
              </div>

              <!-- Thumbnails -->
              ${images.length > 1 ? `
                <div style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.5rem;">
                  ${images.map((img, idx) => `
                    <div 
                      onclick="ProductDetailModal.setActiveImage(${idx})"
                      style="width: 60px; height: 60px; border-radius: var(--radius-md); overflow: hidden; border: 2px solid ${idx === this.activeImageIndex ? 'var(--color-primary)' : 'var(--color-border)'}; cursor: pointer; flex-shrink: 0;"
                    >
                      <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;" alt="Thumbnail" />
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              <!-- Verified Campus Safety Tip Card -->
              <div style="margin-top: 1.25rem; background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: var(--radius-md); padding: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; font-weight: 700; font-size: 0.85rem; color: #166534; margin-bottom: 0.35rem;">
                  ${Icons.shieldCheck("w-4 h-4 text-emerald")}
                  Campus Safety Recommendations
                </div>
                <ul style="font-size: 0.78rem; color: #166534; list-style: disc; padding-left: 1.2rem; line-height: 1.45;">
                  <li>Always meet in a well-lit campus location (Central Canteen, Library porch, or Hostel Gate).</li>
                  <li>Inspect the item in person before sending payment via UPI or cash.</li>
                  <li>Zero platform fees — you pay the student directly.</li>
                </ul>
              </div>
            </div>

            <!-- Right: Details & Seller Action Bar -->
            <div>
              <div style="margin-bottom: 1rem;">
                <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--color-navy); line-height: 1.3; margin-bottom: 0.5rem;">
                  ${p.title}
                </h2>
                <div style="display: flex; align-items: baseline; gap: 1rem;">
                  <span style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: var(--color-navy);">
                    ₹${p.price.toLocaleString('en-IN')}
                  </span>
                  <span style="font-size: 0.82rem; font-weight: 600; color: var(--color-accent-emerald);">
                    ● Verified Student Price
                  </span>
                </div>
              </div>

              <!-- Campus Location Badge -->
              <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.65rem 0.85rem; background: #F8FAFC; border: 1px solid var(--color-border); border-radius: var(--radius-md); margin-bottom: 1.25rem; font-size: 0.85rem;">
                <span style="color: var(--color-primary);">${Icons.mapPin("w-4 h-4")}</span>
                <div>
                  <strong>Pickup Point:</strong> ${p.campus_location || 'Campus'} • <span style="color: var(--color-text-muted);">${p.college_name}</span>
                </div>
              </div>

              <!-- Dynamic Category Fields -->
              ${isTicket ? `
                <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.25rem;">
                  <div style="font-weight: 700; font-size: 0.88rem; color: #92400E; display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.5rem;">
                    ${Icons.train("w-4 h-4")}
                    Railway Journey Details
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.82rem; color: #78350F;">
                    <div><strong>Journey Date:</strong> ${dyn.journey_date || 'N/A'}</div>
                    <div><strong>Class:</strong> ${dyn.ticket_type || '3AC'}</div>
                    <div><strong>From:</strong> ${dyn.from_station || 'BRC'}</div>
                    <div><strong>To:</strong> ${dyn.to_station || 'NDLS'}</div>
                    <div style="grid-column: 1 / -1;"><strong>Train:</strong> ${dyn.train_name_number || 'Express'}</div>
                  </div>
                  <div style="margin-top: 0.6rem; padding-top: 0.6rem; border-top: 1px dashed #FCD34D; font-size: 0.74rem; color: #92400E; line-height: 1.35;">
                    ⚠️ <strong>Compliance Notice:</strong> Railway ticket transfers or resales must comply strictly with Indian Railway passenger rules (transfer between students upon authorized written request to Chief Commercial Manager 24h prior). Commercial black-marketing is strictly prohibited.
                  </div>
                </div>
              ` : ''}

              ${isPerfume ? `
                <div style="background: #FAF5FF; border: 1px solid #E9D5FF; border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.25rem;">
                  <div style="font-weight: 700; font-size: 0.88rem; color: #6B21A8; display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.5rem;">
                    ${Icons.sparkles("w-4 h-4")}
                    Fragrance Bottle Specifications
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.82rem; color: #581C87;">
                    <div><strong>Brand:</strong> ${dyn.brand || 'Designer'}</div>
                    <div><strong>Bottle Size:</strong> ${dyn.bottle_size || '100ml'}</div>
                    <div><strong>Remaining:</strong> ${dyn.remaining_level || '90%'}</div>
                    <div><strong>Original Box:</strong> ${dyn.original_box || 'Included'}</div>
                  </div>
                </div>
              ` : ''}

              <!-- Description -->
              <div style="margin-bottom: 1.5rem;">
                <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.4rem;">Description</h4>
                <p style="font-size: 0.9rem; color: var(--color-text-muted); line-height: 1.6; white-space: pre-line;">
                  ${p.description}
                </p>
              </div>

              <!-- Seller Profile Card -->
              <div style="background: #F8FAFC; border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 0.85rem;">
                  <img src="${p.seller_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}" class="chat-avatar" alt="${p.seller_name}" />
                  <div>
                    <div style="font-weight: 700; font-size: 0.92rem; color: var(--color-navy); display: flex; align-items: center; gap: 0.35rem;">
                      ${p.seller_name}
                      <span style="color: var(--color-accent-emerald); font-size: 0.75rem;" title="Verified Student">${Icons.checkCircle("w-3 h-3")}</span>
                    </div>
                    <div style="font-size: 0.78rem; color: var(--color-text-muted);">
                      ${p.college_name}
                    </div>
                  </div>
                </div>
                <div style="text-align: right; font-size: 0.76rem; color: var(--color-text-muted);">
                  <div>Typically replies</div>
                  <strong style="color: var(--color-accent-emerald);">Within minutes</strong>
                </div>
              </div>

              <!-- Main CTA Buttons -->
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${isSeller ? `
                  <button class="btn btn-secondary w-full" style="width: 100%;" onclick="ProductDetailModal.close(); state.setActiveView('seller-dashboard');">
                    Manage in Your Seller Dashboard
                  </button>
                ` : `
                  <button class="btn btn-primary btn-lg w-full" style="width: 100%;" onclick="ProductDetailModal.handleContactSeller()">
                    ${Icons.messageSquare("w-5 h-5")}
                    Contact Seller (Internal Chat)
                  </button>
                `}

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                  <button class="btn btn-secondary btn-sm" onclick="Marketplace.toggleWishlist('${p.id}')">
                    ${Icons.heart("w-4 h-4", isFav)}
                    ${isFav ? 'Saved' : 'Save to Wishlist'}
                  </button>
                  <button class="btn btn-secondary btn-sm" onclick="ProductDetailModal.shareProduct()">
                    ${Icons.share("w-4 h-4")}
                    Share Link
                  </button>
                </div>

                <div style="text-align: center; margin-top: 0.5rem;">
                  <a href="#" onclick="event.preventDefault(); ReportModal.open('product', '${p.id}', '${p.title.replace(/'/g, "\\'")}');" style="font-size: 0.76rem; color: var(--color-text-subtle); display: inline-flex; align-items: center; gap: 0.25rem;">
                    ${Icons.alertTriangle("w-3 h-3")} Report suspicious or prohibited listing
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
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
