/**
 * CampusCart - Sell Item & Dynamic Product Creation Modal
 */
const SellItemModal = {
  uploadedImages: [],
  selectedCategory: 'Books & Study Materials',
  editProductId: null,

  open(productIdToEdit = null) {
    this.editProductId = productIdToEdit;
    this.uploadedImages = [];
    this.selectedCategory = 'Books & Study Materials';

    let modalEl = document.getElementById('sell-item-modal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'sell-item-modal';
      modalEl.className = 'modal-overlay';
      document.body.appendChild(modalEl);
    }

    modalEl.classList.add('open');
    this.render();

    if (productIdToEdit) {
      this.populateEditData(productIdToEdit);
    }
  },

  close() {
    const modalEl = document.getElementById('sell-item-modal');
    if (modalEl) modalEl.classList.remove('open');
    this.editProductId = null;
  },

  async populateEditData(id) {
    try {
      const res = await API.getProduct(id);
      const p = res.product;
      this.selectedCategory = p.category;
      this.uploadedImages = p.images || [];
      this.render();

      document.getElementById('sell-title').value = p.title;
      document.getElementById('sell-category').value = p.category;
      document.getElementById('sell-price').value = p.price;
      document.getElementById('sell-condition').value = p.condition;
      document.getElementById('sell-location').value = p.campus_location;
      document.getElementById('sell-description').value = p.description;

      const dyn = p.dynamic_attributes || {};
      if (p.category === 'Railway Tickets') {
        if (document.getElementById('dyn-journey-date')) document.getElementById('dyn-journey-date').value = dyn.journey_date || '';
        if (document.getElementById('dyn-from-station')) document.getElementById('dyn-from-station').value = dyn.from_station || '';
        if (document.getElementById('dyn-to-station')) document.getElementById('dyn-to-station').value = dyn.to_station || '';
        if (document.getElementById('dyn-train-name')) document.getElementById('dyn-train-name').value = dyn.train_name_number || '';
        if (document.getElementById('dyn-ticket-type')) document.getElementById('dyn-ticket-type').value = dyn.ticket_type || '3AC';
      } else if (p.category === 'Perfumes') {
        if (document.getElementById('dyn-brand')) document.getElementById('dyn-brand').value = dyn.brand || '';
        if (document.getElementById('dyn-size')) document.getElementById('dyn-size').value = dyn.bottle_size || '';
        if (document.getElementById('dyn-remaining')) document.getElementById('dyn-remaining').value = dyn.remaining_level || '';
      }
    } catch (err) {
      showToast('Failed to load item for editing', 'error');
    }
  },

  render() {
    const modalEl = document.getElementById('sell-item-modal');
    const user = state.currentUser;
    const isTicket = this.selectedCategory === 'Railway Tickets';
    const isPerfume = this.selectedCategory === 'Perfumes';

    modalEl.innerHTML = `
      <div class="modal-content" style="max-width: 760px;">
        <div class="modal-header">
          <div>
            <h3 class="modal-title">
              ${this.editProductId ? 'Edit Product Listing' : 'List a Product on CampusCart'}
            </h3>
            <p style="font-size: 0.8rem; color: var(--color-text-muted);">
              Posting to: <strong>${user ? user.college_short_name : (state.selectedCollege ? state.selectedCollege.short_name : 'GSV Vadodara')}</strong> • Zero Commission
            </p>
          </div>
          <button class="modal-close-btn" onclick="SellItemModal.close()">
            ${Icons.x("w-5 h-5")}
          </button>
        </div>

        <div class="modal-body">
          <form id="sell-product-form" onsubmit="event.preventDefault(); SellItemModal.handleSubmit();">
            
            <!-- Category Selection First (drives dynamic fields) -->
            <div style="margin-bottom: 1.25rem;">
              <label class="filter-label">Select Category *</label>
              <select id="sell-category" class="input-field input-plain" onchange="SellItemModal.handleCategoryChange(this.value)" required>
                ${CATEGORIES.map(c => `
                  <option value="${c.id}" ${this.selectedCategory === c.id ? 'selected' : ''}>${c.name}</option>
                `).join('')}
              </select>
            </div>

            <!-- Product Title -->
            <div style="margin-bottom: 1.25rem;">
              <label class="filter-label">Product Title *</label>
              <input 
                type="text" 
                id="sell-title" 
                class="input-field input-plain" 
                placeholder="e.g. Hero Sprint 26T 21-Speed Cycle / Rasasi Hawas EDP / B.S. Grewal 44th Ed." 
                required 
              />
            </div>

            <!-- Price and Condition in two columns -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
              <div>
                <label class="filter-label">Price (₹ INR) *</label>
                <div class="search-input-wrap">
                  <span style="position: absolute; left: 0.85rem; font-weight: 700; color: var(--color-navy);">₹</span>
                  <input type="number" id="sell-price" class="input-field" style="padding-left: 2rem;" placeholder="e.g. 1200" required min="0" />
                </div>
              </div>
              <div>
                <label class="filter-label">Condition *</label>
                <select id="sell-condition" class="input-field input-plain" required>
                  <option value="Like New">Like New (Mint condition)</option>
                  <option value="Brand New">Brand New (Unopened)</option>
                  <option value="Good">Good (Lightly used, fully working)</option>
                  <option value="Fair">Fair (Noticeable wear, functional)</option>
                </select>
              </div>
            </div>

            <!-- DYNAMIC CATEGORY FIELDS -->
            ${isTicket ? `
              <div style="background: var(--surface-raised); border: 1px solid var(--border-accent); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.25rem;">
                <div style="font-weight: 700; font-size: 0.88rem; color: var(--accent); display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em;">
                  ${Icons.train("w-4 h-4")}
                  Railway Ticket Specifics
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
                  <div>
                    <label style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Journey Date *</label>
                    <input type="date" id="dyn-journey-date" class="input-field input-plain" required />
                  </div>
                  <div>
                    <label style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Ticket Class *</label>
                    <select id="dyn-ticket-type" class="input-field input-plain">
                      <option value="3AC (3rd AC Sleeper)">3AC (3rd AC Sleeper)</option>
                      <option value="2AC (2nd AC Sleeper)">2AC (2nd AC Sleeper)</option>
                      <option value="1AC (1st AC)">1AC (1st AC)</option>
                      <option value="SL (Sleeper Class)">SL (Sleeper Class)</option>
                      <option value="CC (AC Chair Car)">CC (AC Chair Car)</option>
                      <option value="2S (Second Sitting)">2S (Second Sitting)</option>
                    </select>
                  </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
                  <div>
                    <label style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">From Station *</label>
                    <input type="text" id="dyn-from-station" class="input-field input-plain" placeholder="e.g. Vadodara Jn (BRC)" required />
                  </div>
                  <div>
                    <label style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">To Station *</label>
                    <input type="text" id="dyn-to-station" class="input-field input-plain" placeholder="e.g. New Delhi (NDLS)" required />
                  </div>
                </div>
                <div style="margin-bottom: 0.75rem;">
                  <label style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Train Name / Number *</label>
                  <input type="text" id="dyn-train-name" class="input-field input-plain" placeholder="e.g. 12951 Mumbai-Delhi Rajdhani" required />
                </div>
                <div style="font-size: 0.75rem; color: var(--text-secondary); display: flex; align-items: flex-start; gap: 0.5rem; background: var(--bg-subtle); border: 1px solid var(--border); padding: 0.75rem; border-radius: var(--radius-sm);">
                  <input type="checkbox" id="dyn-compliance-check" required style="margin-top: 3px;" />
                  <label for="dyn-compliance-check">
                    I confirm that this listing complies with applicable Indian Railway rules (bonafide student transfer via written application to railway authorities). I will not engage in unauthorized scalping or prohibited resales.
                  </label>
                </div>
              </div>
            ` : ''}

            ${isPerfume ? `
              <div style="background: var(--surface-raised); border: 1px solid var(--border-accent); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.25rem;">
                <div style="font-weight: 700; font-size: 0.88rem; color: var(--accent); display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em;">
                  ${Icons.sparkles("w-4 h-4")}
                  Perfume & Decant Specifications
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
                  <div>
                    <label style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Brand / House *</label>
                    <input type="text" id="dyn-brand" class="input-field input-plain" placeholder="e.g. Rasasi, Dior, Lattafa, Zara" required />
                  </div>
                  <div>
                    <label style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Original Bottle Size *</label>
                    <input type="text" id="dyn-size" class="input-field input-plain" placeholder="e.g. 100 ml, 50 ml, 10 ml Decant" required />
                  </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                  <div>
                    <label style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Remaining Quantity / Level *</label>
                    <input type="text" id="dyn-remaining" class="input-field input-plain" placeholder="e.g. 85 ml (85% full)" required />
                  </div>
                  <div>
                    <label style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Packaging</label>
                    <select id="dyn-box" class="input-field input-plain">
                      <option value="Yes, original box with batch code">Original Box Included</option>
                      <option value="Tester box">Tester Box</option>
                      <option value="Bottle only (no box)">Bottle Only</option>
                    </select>
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- Campus Meetup Location & Contact Preference -->
            <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 1rem; margin-bottom: 1.25rem;">
              <div>
                <label class="filter-label">GSV Campus Handover Location *</label>
                <input 
                  type="text" 
                  id="sell-location" 
                  list="gsv-locations-list"
                  class="input-field input-plain" 
                  placeholder="e.g. Hostel Block B, Pratap Nagar Colony, Central Library" 
                  required 
                />
                <datalist id="gsv-locations-list">
                  <option value="Hostel Block B, Room 214" />
                  <option value="Hostel Cycle Parking, GSV Vadodara" />
                  <option value="Pratap Nagar Railway Colony" />
                  <option value="Lalbaug Main Academic Block" />
                  <option value="Central Library, GSV Main Campus" />
                  <option value="GSV Student Activity Centre (SAC)" />
                  <option value="Central Canteen Foyer" />
                </datalist>
              </div>
              <div>
                <label class="filter-label">Contact Preference</label>
                <select id="sell-contact-pref" class="input-field input-plain">
                  <option value="chat">In-App Chat Only (Safe)</option>
                  <option value="chat_phone">Chat + Phone on request</option>
                </select>
              </div>
            </div>

            <!-- Upload Multiple Images -->
            <div style="margin-bottom: 1.25rem;">
              <label class="filter-label">Product Photos (Upload or Presets)</label>
              
              <!-- Image Preview Strip -->
              <div id="image-previews-container" style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                ${this.uploadedImages.map((img, idx) => `
                  <div style="position: relative; width: 80px; height: 80px; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--color-border);">
                    <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;" alt="Preview" />
                    <button type="button" onclick="SellItemModal.removeImage(${idx})" style="position: absolute; top: 2px; right: 2px; width: 20px; height: 20px; border-radius: 50%; background: rgba(0,0,0,0.7); color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 10px;">✕</button>
                  </div>
                `).join('')}

                <!-- File Upload Trigger Button -->
                <label style="width: 80px; height: 80px; border: 2px dashed var(--color-border); border-radius: var(--radius-md); display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; color: var(--color-text-muted); transition: all var(--transition-fast);">
                  ${Icons.camera("w-5 h-5")}
                  <span style="font-size: 0.65rem; font-weight: 600; margin-top: 2px;">Add Photo</span>
                  <input type="file" id="sell-image-file-input" accept="image/*" style="display: none;" onchange="SellItemModal.handleFileSelect(event)" />
                </label>
              </div>

              <!-- Quick Demo Photo Presets for Easy Testing -->
              <div style="font-size: 0.75rem; color: var(--color-text-muted); display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;">
                <span>Quick Photo Presets:</span>
                <button type="button" class="btn btn-ghost btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="SellItemModal.addSamplePreset('https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800')">+ Cycle</button>
                <button type="button" class="btn btn-ghost btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="SellItemModal.addSamplePreset('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800')">+ Book</button>
                <button type="button" class="btn btn-ghost btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="SellItemModal.addSamplePreset('https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800')">+ Perfume</button>
                <button type="button" class="btn btn-ghost btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="SellItemModal.addSamplePreset('https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800')">+ Kettle</button>
                <button type="button" class="btn btn-ghost btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="SellItemModal.addSamplePreset('https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800')">+ Train</button>
              </div>
            </div>

            <!-- Description -->
            <div style="margin-bottom: 1.5rem;">
              <label class="filter-label">Detailed Description *</label>
              <textarea 
                id="sell-description" 
                rows="4" 
                class="input-field input-plain" 
                placeholder="Describe key details, usage duration, reason for selling, whether price is negotiable, and preferred meeting hours at campus."
                required
              ></textarea>
            </div>

            <!-- Submit CTA Button -->
            <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
              <button type="button" class="btn btn-secondary" onclick="SellItemModal.close()">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" id="sell-submit-btn">
                ${this.editProductId ? 'Save Changes' : 'Publish to Marketplace'}
              </button>
            </div>

          </form>
        </div>
      </div>
    `;
  },

  handleCategoryChange(val) {
    this.selectedCategory = val;
    this.render();
  },

  addSamplePreset(url) {
    this.uploadedImages.push(url);
    this.render();
  },

  removeImage(index) {
    this.uploadedImages.splice(index, 1);
    this.render();
  },

  handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target.result;
      try {
        showToast('Uploading image...', 'info');
        const res = await API.uploadImage(dataUrl, file.name);
        this.uploadedImages.push(res.url);
        this.render();
        showToast('Image uploaded successfully!', 'success');
      } catch (err) {
        // Fallback to client dataUrl if local upload encounters an issue
        this.uploadedImages.push(dataUrl);
        this.render();
      }
    };
    reader.readAsDataURL(file);
  },

  async handleSubmit() {
    const submitBtn = document.getElementById('sell-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Publishing...';
    }

    try {
      const title = document.getElementById('sell-title').value;
      const category = document.getElementById('sell-category').value;
      const price = document.getElementById('sell-price').value;
      const condition = document.getElementById('sell-condition').value;
      const campus_location = document.getElementById('sell-location').value;
      const contact_preference = document.getElementById('sell-contact-pref').value;
      const description = document.getElementById('sell-description').value;

      const dynamic_attributes = {};
      if (category === 'Railway Tickets') {
        dynamic_attributes.journey_date = document.getElementById('dyn-journey-date')?.value || '';
        dynamic_attributes.ticket_type = document.getElementById('dyn-ticket-type')?.value || '';
        dynamic_attributes.from_station = document.getElementById('dyn-from-station')?.value || '';
        dynamic_attributes.to_station = document.getElementById('dyn-to-station')?.value || '';
        dynamic_attributes.train_name_number = document.getElementById('dyn-train-name')?.value || '';
      } else if (category === 'Perfumes') {
        dynamic_attributes.brand = document.getElementById('dyn-brand')?.value || '';
        dynamic_attributes.bottle_size = document.getElementById('dyn-size')?.value || '';
        dynamic_attributes.remaining_level = document.getElementById('dyn-remaining')?.value || '';
        dynamic_attributes.original_box = document.getElementById('dyn-box')?.value || '';
      }

      const images = this.uploadedImages.length > 0 ? this.uploadedImages : [
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'
      ];

      if (this.editProductId) {
        await API.updateProduct(this.editProductId, {
          title,
          category,
          price,
          condition,
          campus_location,
          description,
          dynamic_attributes
        });
        showToast('Product updated successfully!', 'success');
      } else {
        await API.createProduct({
          title,
          category,
          price,
          condition,
          campus_location,
          contact_preference,
          description,
          images,
          dynamic_attributes,
          college_id: state.currentUser ? state.currentUser.college_id : state.selectedCollege.id
        });
        showToast('Your product is now LIVE in the marketplace!', 'success');
      }

      this.close();
      Marketplace.loadProducts();
      if (state.activeView === 'seller-dashboard') {
        SellerDashboard.loadSellerData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Publish to Marketplace';
      }
    }
  }
};

window.SellItemModal = SellItemModal;
