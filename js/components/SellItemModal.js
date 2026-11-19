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
    modalEl.style.display = 'flex';
    this.render();

    if (productIdToEdit) {
      this.populateEditData(productIdToEdit);
    }
  },

  close() {
    const modalEl = document.getElementById('sell-item-modal');
    if (modalEl) {
      modalEl.classList.remove('open');
      modalEl.style.display = 'none';
    }
    this.editProductId = null;
  },

  async populateEditData(id) {
    try {
      const res = await API.getProduct(id);
      const p = res.product;
      this.selectedCategory = p.category;
      this.uploadedImages = p.images || [];
      this.render();

      const titleEl = document.getElementById('sell-title');
      const catEl = document.getElementById('sell-category');
      const priceEl = document.getElementById('sell-price');
      const condEl = document.getElementById('sell-condition');
      const locEl = document.getElementById('sell-location');
      const descEl = document.getElementById('sell-description');

      if (titleEl) titleEl.value = p.title || '';
      if (catEl) catEl.value = p.category || '';
      if (priceEl) priceEl.value = p.price || '';
      if (condEl) condEl.value = p.condition || 'Good';
      if (locEl) locEl.value = p.campus_location || '';
      if (descEl) descEl.value = p.description || '';

      const dyn = p.dynamic_attributes || {};
      if (p.category === 'Railway Tickets') {
        const dateInput = document.getElementById('dyn-journey-date');
        if (dateInput) dateInput.value = this.toDisplayDate(dyn.journey_date || '');
        if (document.getElementById('dyn-from-station')) document.getElementById('dyn-from-station').value = dyn.from_station || '';
        if (document.getElementById('dyn-to-station')) document.getElementById('dyn-to-station').value = dyn.to_station || '';
        if (document.getElementById('dyn-train-name')) document.getElementById('dyn-train-name').value = dyn.train_name_number || '';
        if (document.getElementById('dyn-ticket-type')) document.getElementById('dyn-ticket-type').value = dyn.ticket_type || '3AC (3rd AC Sleeper)';
      } else if (p.category === 'Perfumes') {
        if (document.getElementById('dyn-brand')) document.getElementById('dyn-brand').value = dyn.brand || '';
        if (document.getElementById('dyn-size')) document.getElementById('dyn-size').value = dyn.bottle_size || '';
        if (document.getElementById('dyn-remaining')) document.getElementById('dyn-remaining').value = dyn.remaining_level || '';
        if (document.getElementById('dyn-box')) document.getElementById('dyn-box').value = dyn.original_box || 'Yes, original box with batch code';
      }
    } catch (err) {
      showToast('Failed to load item for editing', 'error');
    }
  },

  toDisplayDate(val) {
    if (!val) return '';
    if (val.includes('/')) return val; // Already DD/MM/YYYY
    if (val.includes('-')) {
      const parts = val.split('-');
      if (parts.length === 3 && parts[0].length === 4) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }
    return val;
  },

  formatDateInput(input) {
    let v = input.value.replace(/[^0-9]/g, '');
    if (v.length > 8) v = v.slice(0, 8);
    let formatted = '';
    if (v.length > 4) {
      formatted = v.slice(0, 2) + '/' + v.slice(2, 4) + '/' + v.slice(4);
    } else if (v.length > 2) {
      formatted = v.slice(0, 2) + '/' + v.slice(2);
    } else {
      formatted = v;
    }
    input.value = formatted;

    // Sync to invisible date picker if valid 10-char DD/MM/YYYY
    if (formatted.length === 10) {
      const [d, m, y] = formatted.split('/');
      const picker = document.getElementById('dyn-journey-date-picker');
      if (picker && d && m && y) {
        picker.value = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      }
    }
  },

  handleCalendarDatePick(val) {
    if (!val) return;
    const parts = val.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts;
      const formatted = `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
      const textInput = document.getElementById('dyn-journey-date');
      if (textInput) {
        textInput.value = formatted;
        textInput.focus();
      }
    }
  },

  openCalendarPicker() {
    const picker = document.getElementById('dyn-journey-date-picker');
    if (picker) {
      if (typeof picker.showPicker === 'function') {
        try {
          picker.showPicker();
          return;
        } catch (e) {}
      }
      picker.focus();
      picker.click();
    }
  },

  renderDynamicFields(category, dynData = {}) {
    if (category === 'Railway Tickets') {
      const jDate = dynData.journey_date ? this.toDisplayDate(dynData.journey_date) : '';
      return `
        <div style="background: var(--surface-raised); border: 1px solid var(--border-accent); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.25rem;">
          <div style="font-weight: 700; font-size: 0.88rem; color: var(--accent); display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.85rem; text-transform: uppercase; letter-spacing: 0.08em;">
            ${Icons.train ? Icons.train("w-4 h-4") : '🚆'}
            Railway Ticket Specifics
          </div>

          <!-- Prominent Dedicated Journey Date Row with DD/MM/YYYY and Calendar Option -->
          <div style="margin-bottom: 0.85rem; background: rgba(200, 169, 126, 0.05); border: 1px solid var(--border-accent); border-radius: var(--radius-md); padding: 0.85rem;">
            <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; margin-bottom: 0.45rem; display: flex; justify-content: space-between; align-items: center;">
              <span>Journey Date <strong style="color: var(--accent);">(DD/MM/YYYY)</strong> *</span>
              <span style="color: var(--accent); font-size: 0.72rem; text-transform: none; font-weight: 600;">📅 Calendar Date Picker</span>
            </label>
            <div style="display: flex; gap: 0.5rem; align-items: stretch;">
              <div style="position: relative; flex: 1;">
                <input 
                  type="text" 
                  id="dyn-journey-date" 
                  class="input-field input-plain" 
                  placeholder="DD/MM/YYYY (e.g. 25/11/2026)" 
                  pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}" 
                  maxlength="10" 
                  value="${jDate}"
                  required 
                  style="width: 100%; box-sizing: border-box; font-size: 1rem; font-weight: 600; letter-spacing: 0.05em; height: 42px; padding: 0.5rem 0.75rem;" 
                  oninput="SellItemModal.formatDateInput(this)" 
                  title="Enter Journey Date in DD/MM/YYYY format or click Open Calendar"
                />
              </div>
              <div style="position: relative; display: inline-flex; flex-shrink: 0;">
                <input 
                  type="date" 
                  id="dyn-journey-date-picker" 
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.01; cursor: pointer; z-index: 10;" 
                  onchange="SellItemModal.handleCalendarDatePick(this.value)" 
                  title="Open Calendar to select journey date" 
                />
                <button 
                  type="button" 
                  id="dyn-calendar-trigger-btn"
                  class="btn btn-primary btn-sm" 
                  style="display: inline-flex; align-items: center; gap: 0.45rem; padding: 0 1rem; height: 42px; white-space: nowrap; font-weight: 700; font-size: 0.85rem; pointer-events: none;"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>📅 Open Calendar</span>
                </button>
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
            <div>
              <label style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.35rem; display: block;">
                Ticket Class *
              </label>
              <select id="dyn-ticket-type" class="input-field input-plain">
                <option value="3AC (3rd AC Sleeper)">3AC (3rd AC Sleeper)</option>
                <option value="2AC (2nd AC Sleeper)">2AC (2nd AC Sleeper)</option>
                <option value="1AC (1st AC)">1AC (1st AC)</option>
                <option value="SL (Sleeper Class)">SL (Sleeper Class)</option>
                <option value="CC (AC Chair Car)">CC (AC Chair Car)</option>
                <option value="2S (Second Sitting)">2S (Second Sitting)</option>
              </select>
            </div>
            <div>
              <label style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.35rem; display: block;">Train Name / Number *</label>
              <input type="text" id="dyn-train-name" class="input-field input-plain" value="${dynData.train_name_number || ''}" placeholder="e.g. 12951 Mumbai-Delhi Rajdhani" required />
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
            <div>
              <label style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">From Station *</label>
              <input type="text" id="dyn-from-station" class="input-field input-plain" value="${dynData.from_station || ''}" placeholder="e.g. Vadodara Jn (BRC)" required />
            </div>
            <div>
              <label style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">To Station *</label>
              <input type="text" id="dyn-to-station" class="input-field input-plain" value="${dynData.to_station || ''}" placeholder="e.g. New Delhi (NDLS)" required />
            </div>
          </div>
          <div style="margin-bottom: 0.75rem;">
            <label style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Train Name / Number *</label>
            <input type="text" id="dyn-train-name" class="input-field input-plain" value="${dynData.train_name_number || ''}" placeholder="e.g. 12951 Mumbai-Delhi Rajdhani" required />
          </div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); display: flex; align-items: flex-start; gap: 0.5rem; background: var(--bg-subtle); border: 1px solid var(--border); padding: 0.75rem; border-radius: var(--radius-sm);">
            <input type="checkbox" id="dyn-compliance-check" required style="margin-top: 3px;" checked />
            <label for="dyn-compliance-check">
              I confirm that this listing complies with applicable Indian Railway rules (bonafide student transfer via written application to railway authorities). I will not engage in unauthorized scalping or prohibited resales.
            </label>
          </div>
        </div>
      `;
    }

    if (category === 'Perfumes') {
      return `
        <div style="background: var(--surface-raised); border: 1px solid var(--border-accent); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.25rem;">
          <div style="font-weight: 700; font-size: 0.88rem; color: var(--accent); display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em;">
            ${Icons.sparkles ? Icons.sparkles("w-4 h-4") : '✨'}
            Perfume & Decant Specifications
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
            <div>
              <label style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Brand / House *</label>
              <input type="text" id="dyn-brand" class="input-field input-plain" value="${dynData.brand || ''}" placeholder="e.g. Rasasi, Dior, Lattafa, Zara" required />
            </div>
            <div>
              <label style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Original Bottle Size *</label>
              <input type="text" id="dyn-size" class="input-field input-plain" value="${dynData.bottle_size || ''}" placeholder="e.g. 100 ml, 50 ml, 10 ml Decant" required />
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div>
              <label style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Remaining Quantity / Level *</label>
              <input type="text" id="dyn-remaining" class="input-field input-plain" value="${dynData.remaining_level || ''}" placeholder="e.g. 85 ml (85% full)" required />
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
      `;
    }

    return '';
  },

  handleCategoryChange(val) {
    this.selectedCategory = val;
    // ONLY update the dynamic fields container so entered form values are NOT lost!
    const container = document.getElementById('sell-dynamic-fields-container');
    if (container) {
      container.innerHTML = this.renderDynamicFields(val);
    }
  },

  updateImagePreviews() {
    const container = document.getElementById('image-previews-container');
    if (!container) return;
    container.innerHTML = `
      ${this.uploadedImages.map((img, idx) => `
        <div style="position: relative; width: 80px; height: 80px; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border);">
          <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;" alt="Preview" />
          <button type="button" onclick="SellItemModal.removeImage(${idx})" style="position: absolute; top: 2px; right: 2px; width: 20px; height: 20px; border-radius: 50%; background: rgba(0,0,0,0.7); color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 10px;">✕</button>
        </div>
      `).join('')}

      <!-- File Upload Trigger Button -->
      <label style="width: 80px; height: 80px; border: 2px dashed var(--border); border-radius: var(--radius-md); display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; color: var(--text-muted); transition: all 0.2s;">
        ${Icons.camera ? Icons.camera("w-5 h-5") : '📷'}
        <span style="font-size: 0.65rem; font-weight: 600; margin-top: 2px;">Add Photo</span>
        <input type="file" id="sell-image-file-input" accept="image/*" style="display: none;" onchange="SellItemModal.handleFileSelect(event)" />
      </label>
    `;
  },

  addSamplePreset(url) {
    this.uploadedImages.push(url);
    this.updateImagePreviews();
  },

  removeImage(index) {
    this.uploadedImages.splice(index, 1);
    this.updateImagePreviews();
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
        this.updateImagePreviews();
        showToast('Image uploaded successfully!', 'success');
      } catch (err) {
        this.uploadedImages.push(dataUrl);
        this.updateImagePreviews();
      }
    };
    reader.readAsDataURL(file);
  },

  render() {
    const modalEl = document.getElementById('sell-item-modal');
    if (!modalEl) return;

    modalEl.innerHTML = `
      <div class="modal-content" style="max-width: 760px;">
        <div class="modal-header">
          <div>
            <h3 class="modal-title">
              ${this.editProductId ? 'Edit Product Listing' : 'List a Product on CampusCart'}
            </h3>
            <p style="font-size: 0.8rem; color: var(--color-text-muted);">
              Posting to: <strong>Campus Marketplace</strong> • Zero Commission
            </p>
          </div>
          <button type="button" class="modal-close-btn" onclick="SellItemModal.close()">
            ${Icons.x ? Icons.x("w-5 h-5") : '✕'}
          </button>
        </div>

        <div class="modal-body">
          <form id="sell-product-form" onsubmit="event.preventDefault(); SellItemModal.handleSubmit();">
            
            <!-- Category Selection First (drives dynamic fields without full form refresh) -->
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
                  <span style="position: absolute; left: 0.85rem; font-weight: 700; color: var(--accent);">₹</span>
                  <input type="number" id="sell-price" class="input-field" style="padding-left: 2rem;" placeholder="e.g. 1200" required min="0" />
                </div>
              </div>
              <div>
                <label class="filter-label">Condition *</label>
                <select id="sell-condition" class="input-field input-plain" required>
                  <option value="Like New">Like New (Mint condition)</option>
                  <option value="Brand New">Brand New (Unopened)</option>
                  <option value="Good" selected>Good (Lightly used, fully working)</option>
                  <option value="Fair">Fair (Noticeable wear, functional)</option>
                </select>
              </div>
            </div>

            <!-- DYNAMIC CATEGORY FIELDS CONTAINER (Updated smoothly without reloading form inputs) -->
            <div id="sell-dynamic-fields-container">
              ${this.renderDynamicFields(this.selectedCategory)}
            </div>

            <!-- Campus Meetup Location & Contact Preference -->
            <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 1rem; margin-bottom: 1.25rem;">
              <div>
                <label class="filter-label">Campus Handover Location *</label>
                <input 
                  type="text" 
                  id="sell-location" 
                  class="input-field input-plain" 
                  list="gsv-locations-list"
                  placeholder="e.g. GSV Central Canteen, Hostel, Library (or agree in chat)" 
                  required 
                />
                <datalist id="gsv-locations-list">
                  <option value="GSV Central Canteen">
                  <option value="Campus Central Library">
                  <option value="Academic Block 1 Lobby">
                  <option value="Academic Block 2 Entrance">
                  <option value="Hostel Block A Courtyard">
                  <option value="Hostel Block B Common Area">
                  <option value="Direct In-Chat Handover (Coordinate in chat)">
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
                  <div style="position: relative; width: 80px; height: 80px; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border);">
                    <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;" alt="Preview" />
                    <button type="button" onclick="SellItemModal.removeImage(${idx})" style="position: absolute; top: 2px; right: 2px; width: 20px; height: 20px; border-radius: 50%; background: rgba(0,0,0,0.7); color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 10px;">✕</button>
                  </div>
                `).join('')}

                <!-- File Upload Trigger Button -->
                <label style="width: 80px; height: 80px; border: 2px dashed var(--border); border-radius: var(--radius-md); display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; color: var(--text-muted); transition: all 0.2s;">
                  ${Icons.camera ? Icons.camera("w-5 h-5") : '📷'}
                  <span style="font-size: 0.65rem; font-weight: 600; margin-top: 2px;">Add Photo</span>
                  <input type="file" id="sell-image-file-input" accept="image/*" style="display: none;" onchange="SellItemModal.handleFileSelect(event)" />
                </label>
              </div>

              <!-- Quick Demo Photo Presets -->
              <div style="font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;">
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
        const rawDate = document.getElementById('dyn-journey-date')?.value || '';
        dynamic_attributes.journey_date = this.toDisplayDate(rawDate);
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
          college_id: state.currentUser ? state.currentUser.college_id : (state.selectedCollege ? state.selectedCollege.id : 'gsv-vadodara')
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
        submitBtn.textContent = this.editProductId ? 'Save Changes' : 'Publish to Marketplace';
      }
    }
  }
};

window.SellItemModal = SellItemModal;
