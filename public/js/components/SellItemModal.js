/**
 * CampusCart - Sell Item & Dynamic Product Creation Modal
 */
const SellItemModal = {
  uploadedImages: [],
  selectedCategory: 'Books & Study Materials',
  editProductId: null,
  calYear: new Date().getFullYear(),
  calMonth: new Date().getMonth(),
  calSelectedDay: null,

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
    const popover = document.getElementById('dyn-calendar-popover');
    if (popover) {
      popover.style.display = 'none';
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
        if (document.getElementById('dyn-train-number')) document.getElementById('dyn-train-number').value = dyn.train_number || '';
        if (document.getElementById('dyn-train-name')) document.getElementById('dyn-train-name').value = dyn.train_name || dyn.train_name_number || '';
        
        const standardClasses = [
          '3AC (3rd AC Sleeper)', 
          '2AC (2nd AC Sleeper)', 
          '1AC (1st AC)', 
          'SL (Sleeper Class)', 
          'CC (AC Chair Car)', 
          '2S (Second Sitting)', 
          'EC (Executive Chair Car)'
        ];

        const ticketSelect = document.getElementById('dyn-ticket-type');
        if (ticketSelect) {
          if (standardClasses.includes(dyn.ticket_type)) {
            ticketSelect.value = dyn.ticket_type;
            this.handleTicketTypeChange(dyn.ticket_type);
          } else if (dyn.ticket_type) {
            ticketSelect.value = 'Others';
            this.handleTicketTypeChange('Others');
            const otherInput = document.getElementById('dyn-ticket-type-other');
            if (otherInput) otherInput.value = dyn.ticket_type;
          }
        }
      } else if (p.category === 'Perfumes') {
        if (document.getElementById('dyn-brand')) document.getElementById('dyn-brand').value = dyn.brand || '';
        if (document.getElementById('dyn-size')) document.getElementById('dyn-size').value = dyn.bottle_size || '';
        if (document.getElementById('dyn-remaining')) document.getElementById('dyn-remaining').value = dyn.remaining_level || '';
        if (document.getElementById('dyn-box')) document.getElementById('dyn-box').value = dyn.original_box || 'Yes, original box with batch code';
      }

      this.applyCategoryVisibility(this.selectedCategory);
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

  /* Calendar Popover logic */
  toggleCalendarPopover(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const popover = document.getElementById('dyn-calendar-popover');
    if (!popover) return;

    if (popover.style.display === 'block') {
      popover.style.display = 'none';
      return;
    }

    const curVal = document.getElementById('dyn-journey-date')?.value || '';
    if (curVal && curVal.includes('/')) {
      const parts = curVal.split('/');
      if (parts.length === 3) {
        const d = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const y = parseInt(parts[2], 10);
        if (!isNaN(d) && !isNaN(m) && !isNaN(y) && y >= 2024 && y <= 2035) {
          this.calYear = y;
          this.calMonth = m;
          this.calSelectedDay = d;
        }
      }
    } else {
      const today = new Date();
      this.calYear = today.getFullYear();
      this.calMonth = today.getMonth();
      this.calSelectedDay = today.getDate();
    }

    this.renderCalendarPopoverContent();
    popover.style.display = 'block';

    const handleDocClick = (evt) => {
      const currentPopover = document.getElementById('dyn-calendar-popover');
      if (!currentPopover) {
        document.removeEventListener('click', handleDocClick);
        return;
      }
      const triggerBtn = document.getElementById('dyn-calendar-trigger-btn');
      if (!currentPopover.contains(evt.target) && (!triggerBtn || !triggerBtn.contains(evt.target))) {
        currentPopover.style.display = 'none';
        document.removeEventListener('click', handleDocClick);
      }
    };
    setTimeout(() => {
      document.addEventListener('click', handleDocClick);
    }, 10);
  },

  changeCalendarMonth(delta, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.calMonth += delta;
    if (this.calMonth < 0) {
      this.calMonth = 11;
      this.calYear -= 1;
    } else if (this.calMonth > 11) {
      this.calMonth = 0;
      this.calYear += 1;
    }
    this.renderCalendarPopoverContent();
  },

  renderCalendarPopoverContent() {
    const popover = document.getElementById('dyn-calendar-popover');
    if (!popover) return;

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const firstDayIndex = new Date(this.calYear, this.calMonth, 1).getDay();
    const daysInMonth = new Date(this.calYear, this.calMonth + 1, 0).getDate();

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === this.calYear && today.getMonth() === this.calMonth;
    const todayDate = today.getDate();

    let daysHtml = '';
    for (let i = 0; i < firstDayIndex; i++) {
      daysHtml += `<div style="height: 32px;"></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = isCurrentMonth && d === todayDate;
      const isSelected = this.calSelectedDay === d;

      let bg = 'transparent';
      let color = '#1d1d1f';
      let fontWeight = '500';
      let border = 'none';

      if (isSelected) {
        bg = '#0071e3';
        color = '#ffffff';
        fontWeight = '700';
      } else if (isToday) {
        border = '1px solid #0071e3';
        fontWeight = '700';
        color = '#0071e3';
      }

      daysHtml += `
        <button 
          type="button" 
          onclick="SellItemModal.selectDateFromPopover(${d}, ${this.calMonth}, ${this.calYear}, event)"
          style="width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.82rem; border: ${border}; background: ${bg}; color: ${color}; font-weight: ${fontWeight}; cursor: pointer; transition: all 0.15s; margin: auto;"
          onmouseenter="if (!this.style.background.includes('0071e3')) this.style.background = '#f5f5f7';"
          onmouseleave="if (!this.style.background.includes('0071e3')) this.style.background = '${bg}';"
        >
          ${d}
        </button>
      `;
    }

    popover.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
        <button type="button" onclick="SellItemModal.changeCalendarMonth(-1, event)" class="btn btn-ghost btn-sm" style="padding: 0.2rem 0.6rem; font-size: 1rem; border-radius: 6px; color: #1d1d1f; cursor: pointer; line-height: 1;">‹</button>
        <span style="font-weight: 700; font-size: 0.88rem; color: #1d1d1f;">${monthNames[this.calMonth]} ${this.calYear}</span>
        <button type="button" onclick="SellItemModal.changeCalendarMonth(1, event)" class="btn btn-ghost btn-sm" style="padding: 0.2rem 0.6rem; font-size: 1rem; border-radius: 6px; color: #1d1d1f; cursor: pointer; line-height: 1;">›</button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; text-align: center; margin-bottom: 0.5rem;">
        <span style="font-size: 0.68rem; font-weight: 600; color: #86868b;">Su</span>
        <span style="font-size: 0.68rem; font-weight: 600; color: #86868b;">Mo</span>
        <span style="font-size: 0.68rem; font-weight: 600; color: #86868b;">Tu</span>
        <span style="font-size: 0.68rem; font-weight: 600; color: #86868b;">We</span>
        <span style="font-size: 0.68rem; font-weight: 600; color: #86868b;">Th</span>
        <span style="font-size: 0.68rem; font-weight: 600; color: #86868b;">Fr</span>
        <span style="font-size: 0.68rem; font-weight: 600; color: #86868b;">Sa</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; text-align: center; margin-bottom: 0.75rem;">
        ${daysHtml}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f2f2f7; padding-top: 0.5rem; font-size: 0.75rem;">
        <button type="button" onclick="SellItemModal.setQuickDate(0, event)" class="btn btn-ghost btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.72rem; color: #0071e3; cursor: pointer;">Today</button>
        <button type="button" onclick="SellItemModal.setQuickDate(1, event)" class="btn btn-ghost btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.72rem; color: #0071e3; cursor: pointer;">Tomorrow</button>
        <button type="button" onclick="document.getElementById('dyn-calendar-popover').style.display='none'" class="btn btn-ghost btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.72rem; color: #86868b; cursor: pointer;">Close</button>
      </div>
    `;
  },

  selectDateFromPopover(day, month, year, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.calSelectedDay = day;
    const dd = String(day).padStart(2, '0');
    const mm = String(month + 1).padStart(2, '0');
    const yyyy = year;
    const formatted = `${dd}/${mm}/${yyyy}`;

    const textInput = document.getElementById('dyn-journey-date');
    if (textInput) {
      textInput.value = formatted;
      textInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    const picker = document.getElementById('dyn-journey-date-picker');
    if (picker) {
      picker.value = `${yyyy}-${mm}-${dd}`;
    }

    const popover = document.getElementById('dyn-calendar-popover');
    if (popover) {
      popover.style.display = 'none';
    }
  },

  setQuickDate(offsetDays, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const target = new Date();
    target.setDate(target.getDate() + offsetDays);
    this.calYear = target.getFullYear();
    this.calMonth = target.getMonth();
    this.calSelectedDay = target.getDate();
    this.selectDateFromPopover(target.getDate(), target.getMonth(), target.getFullYear());
  },

  handleTicketTypeChange(val) {
    const wrap = document.getElementById('dyn-ticket-other-wrap');
    const otherInput = document.getElementById('dyn-ticket-type-other');
    if (wrap && otherInput) {
      if (val === 'Others') {
        wrap.style.display = 'block';
        otherInput.required = true;
        otherInput.focus();
      } else {
        wrap.style.display = 'none';
        otherInput.required = false;
        otherInput.value = '';
      }
    }
  },

  renderDynamicFields(category, dynData = {}) {
    if (category === 'Railway Tickets') {
      const jDate = dynData.journey_date ? this.toDisplayDate(dynData.journey_date) : '';
      const standardClasses = [
        '3AC (3rd AC Sleeper)', 
        '2AC (2nd AC Sleeper)', 
        '1AC (1st AC)', 
        'SL (Sleeper Class)', 
        'CC (AC Chair Car)', 
        '2S (Second Sitting)', 
        'EC (Executive Chair Car)'
      ];
      const isOther = dynData.ticket_type && !standardClasses.includes(dynData.ticket_type);
      const selectedType = isOther ? 'Others' : (dynData.ticket_type || '3AC (3rd AC Sleeper)');

      return `
        <div style="background: var(--surface-raised); border: 1px solid var(--border-accent); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.25rem;">
          <div style="font-weight: 700; font-size: 0.88rem; color: var(--accent); display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.85rem; text-transform: uppercase; letter-spacing: 0.08em;">
            ${Icons.train ? Icons.train("w-4 h-4") : '🚆'}
            Railway Ticket Specifics
          </div>

          <!-- Prominent Dedicated Journey Date Row with DD/MM/YYYY and Interactive Calendar -->
          <div style="position: relative; margin-bottom: 0.85rem; background: rgba(0, 113, 227, 0.04); border: 1px solid rgba(0, 113, 227, 0.2); border-radius: var(--radius-md); padding: 0.85rem;">
            <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; margin-bottom: 0.45rem; display: flex; justify-content: space-between; align-items: center;">
              <span>Journey Date <strong style="color: var(--color-primary);">(DD/MM/YYYY)</strong> *</span>
              <span style="color: var(--color-primary); font-size: 0.72rem; text-transform: none; font-weight: 600;">Tap Calendar or Type Date</span>
            </label>
            <div style="display: flex; gap: 0.5rem; align-items: stretch; position: relative;">
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

              <button 
                type="button" 
                id="dyn-calendar-trigger-btn"
                class="btn btn-primary btn-sm" 
                style="display: inline-flex; align-items: center; gap: 0.45rem; padding: 0 1.15rem; height: 42px; white-space: nowrap; font-weight: 700; font-size: 0.85rem; cursor: pointer; border-radius: 8px; z-index: 5;"
                onclick="SellItemModal.toggleCalendarPopover(event)"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>Open Calendar</span>
              </button>

              <!-- Native Hidden Date Input -->
              <input 
                type="date" 
                id="dyn-journey-date-picker" 
                style="position: absolute; right: 0; bottom: 0; width: 1px; height: 1px; opacity: 0; pointer-events: none;" 
                onchange="SellItemModal.handleCalendarDatePick(this.value)" 
              />
            </div>

            <!-- Built-in Apple-Themed Calendar Popover Widget -->
            <div 
              id="dyn-calendar-popover" 
              style="display: none; position: absolute; top: calc(100% + 6px); right: 0; z-index: 1000; background: #ffffff; border: 1px solid #d2d2d7; border-radius: 12px; box-shadow: 0 12px 32px rgba(0,0,0,0.18); padding: 14px; width: 290px; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;"
            ></div>
          </div>

          <!-- Ticket Class & Train Number Grid (Train Number ONE TIME) -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
            <div>
              <label style="font-size: 0.75rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; margin-bottom: 0.35rem; display: block;">
                Ticket Class *
              </label>
              <select id="dyn-ticket-type" class="input-field input-plain" onchange="SellItemModal.handleTicketTypeChange(this.value)" required>
                <option value="3AC (3rd AC Sleeper)" ${selectedType === '3AC (3rd AC Sleeper)' ? 'selected' : ''}>3AC (3rd AC Sleeper)</option>
                <option value="2AC (2nd AC Sleeper)" ${selectedType === '2AC (2nd AC Sleeper)' ? 'selected' : ''}>2AC (2nd AC Sleeper)</option>
                <option value="1AC (1st AC)" ${selectedType === '1AC (1st AC)' ? 'selected' : ''}>1AC (1st AC)</option>
                <option value="SL (Sleeper Class)" ${selectedType === 'SL (Sleeper Class)' ? 'selected' : ''}>SL (Sleeper Class)</option>
                <option value="CC (AC Chair Car)" ${selectedType === 'CC (AC Chair Car)' ? 'selected' : ''}>CC (AC Chair Car)</option>
                <option value="2S (Second Sitting)" ${selectedType === '2S (Second Sitting)' ? 'selected' : ''}>2S (Second Sitting)</option>
                <option value="EC (Executive Chair Car)" ${selectedType === 'EC (Executive Chair Car)' ? 'selected' : ''}>EC (Executive Chair Car)</option>
                <option value="Others" ${selectedType === 'Others' ? 'selected' : ''}>Others (Specify)</option>
              </select>
            </div>
            <div>
              <label style="font-size: 0.75rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; margin-bottom: 0.35rem; display: block;">
                Train Number *
              </label>
              <input 
                type="text" 
                id="dyn-train-number" 
                class="input-field input-plain" 
                value="${dynData.train_number || ''}" 
                placeholder="e.g. 12951" 
                required 
              />
            </div>
          </div>

          <!-- Mandatory Specify Ticket Class when Others is selected -->
          <div id="dyn-ticket-other-wrap" style="display: ${isOther ? 'block' : 'none'}; margin-bottom: 0.75rem;">
            <label style="font-size: 0.75rem; font-weight: 700; color: var(--color-primary); text-transform: uppercase; margin-bottom: 0.35rem; display: block;">
              Specify Ticket Class *
            </label>
            <input 
              type="text" 
              id="dyn-ticket-type-other" 
              class="input-field input-plain" 
              value="${isOther ? (dynData.ticket_type_other || dynData.ticket_type || '') : ''}" 
              placeholder="e.g. Executive Anubhuti (EA) / Vande Bharat EC / First AC Coupe" 
              ${isOther ? 'required' : ''} 
            />
          </div>

          <!-- From Station & To Station Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
            <div>
              <label style="font-size: 0.75rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; margin-bottom: 0.35rem; display: block;">
                From Station *
              </label>
              <input type="text" id="dyn-from-station" class="input-field input-plain" value="${dynData.from_station || ''}" placeholder="e.g. Vadodara Jn (BRC)" required />
            </div>
            <div>
              <label style="font-size: 0.75rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; margin-bottom: 0.35rem; display: block;">
                To Station *
              </label>
              <input type="text" id="dyn-to-station" class="input-field input-plain" value="${dynData.to_station || ''}" placeholder="e.g. New Delhi (NDLS)" required />
            </div>
          </div>

          <!-- Train Name (ONE TIME) -->
          <div style="margin-bottom: 0.75rem;">
            <label style="font-size: 0.75rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; margin-bottom: 0.35rem; display: block;">
              Train Name *
            </label>
            <input 
              type="text" 
              id="dyn-train-name" 
              class="input-field input-plain" 
              value="${dynData.train_name || ''}" 
              placeholder="e.g. Mumbai-Delhi Rajdhani Express" 
              required 
            />
          </div>

          <!-- Compliance checkbox -->
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

  applyCategoryVisibility(category) {
    const isRailway = category === 'Railway Tickets';

    const titleGroup = document.getElementById('sell-title-group');
    const titleInput = document.getElementById('sell-title');
    const conditionGroup = document.getElementById('sell-condition-group');
    const conditionInput = document.getElementById('sell-condition');
    const descGroup = document.getElementById('sell-description-group');
    const descInput = document.getElementById('sell-description');
    const priceCondRow = document.getElementById('sell-price-condition-row');

    if (titleGroup && titleInput) {
      if (isRailway) {
        titleGroup.style.display = 'none';
        titleInput.required = false;
      } else {
        titleGroup.style.display = 'block';
        titleInput.required = true;
      }
    }

    if (conditionGroup && conditionInput) {
      if (isRailway) {
        conditionGroup.style.display = 'none';
        conditionInput.required = false;
      } else {
        conditionGroup.style.display = 'block';
        conditionInput.required = true;
      }
    }

    if (priceCondRow) {
      priceCondRow.style.gridTemplateColumns = isRailway ? '1fr' : '1fr 1fr';
    }

    if (descGroup && descInput) {
      if (isRailway) {
        descGroup.style.display = 'none';
        descInput.required = false;
      } else {
        descGroup.style.display = 'block';
        descInput.required = true;
      }
    }
  },

  handleCategoryChange(val) {
    this.selectedCategory = val;
    const container = document.getElementById('sell-dynamic-fields-container');
    if (container) {
      container.innerHTML = this.renderDynamicFields(val);
    }
    this.applyCategoryVisibility(val);
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

            <!-- Product Title (Hidden for Railway Tickets) -->
            <div id="sell-title-group" style="margin-bottom: 1.25rem;">
              <label class="filter-label">Product Title *</label>
              <input 
                type="text" 
                id="sell-title" 
                class="input-field input-plain" 
                placeholder="e.g. Hero Sprint 26T 21-Speed Cycle / Rasasi Hawas EDP / B.S. Grewal 44th Ed." 
                required 
              />
            </div>

            <!-- Price and Condition (Condition hidden for Railway Tickets) -->
            <div id="sell-price-condition-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
              <div id="sell-price-group">
                <label class="filter-label">Price (₹ INR) *</label>
                <div class="search-input-wrap">
                  <span style="position: absolute; left: 0.85rem; font-weight: 700; color: var(--accent);">₹</span>
                  <input type="number" id="sell-price" class="input-field" style="padding-left: 2rem;" placeholder="e.g. 1200" required min="0" />
                </div>
              </div>
              <div id="sell-condition-group">
                <label class="filter-label">Condition *</label>
                <select id="sell-condition" class="input-field input-plain" required>
                  <option value="Like New">Like New (Mint condition)</option>
                  <option value="Brand New">Brand New (Unopened)</option>
                  <option value="Good" selected>Good (Lightly used, fully working)</option>
                  <option value="Fair">Fair (Noticeable wear, functional)</option>
                </select>
              </div>
            </div>

            <!-- DYNAMIC CATEGORY FIELDS CONTAINER -->
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

            <!-- Description (Hidden for Railway Tickets) -->
            <div id="sell-description-group" style="margin-bottom: 1.5rem;">
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

    // Apply visibility states according to current selected category
    this.applyCategoryVisibility(this.selectedCategory);
  },

  async handleSubmit() {
    const submitBtn = document.getElementById('sell-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Publishing...';
    }

    try {
      const category = document.getElementById('sell-category').value;
      const price = document.getElementById('sell-price').value;
      const campus_location = document.getElementById('sell-location').value;
      const contact_preference = document.getElementById('sell-contact-pref').value;

      let title = '';
      let condition = '';
      let description = '';
      const dynamic_attributes = {};

      if (category === 'Railway Tickets') {
        const rawDate = document.getElementById('dyn-journey-date')?.value.trim() || '';
        const fromStation = document.getElementById('dyn-from-station')?.value.trim() || '';
        const toStation = document.getElementById('dyn-to-station')?.value.trim() || '';
        const trainNumber = document.getElementById('dyn-train-number')?.value.trim() || '';
        const trainName = document.getElementById('dyn-train-name')?.value.trim() || '';
        const selectedType = document.getElementById('dyn-ticket-type')?.value.trim() || '3AC';

        let resolvedTicketType = selectedType;
        if (selectedType === 'Others') {
          const otherInputVal = document.getElementById('dyn-ticket-type-other')?.value.trim();
          if (!otherInputVal) {
            showToast('Please specify the ticket class', 'error');
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = this.editProductId ? 'Save Changes' : 'Publish to Marketplace';
            }
            return;
          }
          resolvedTicketType = otherInputVal;
          dynamic_attributes.is_other_ticket_class = true;
          dynamic_attributes.ticket_type_other = otherInputVal;
        }

        const displayDate = this.toDisplayDate(rawDate);
        dynamic_attributes.journey_date = displayDate;
        dynamic_attributes.ticket_type = resolvedTicketType;
        dynamic_attributes.from_station = fromStation;
        dynamic_attributes.to_station = toStation;
        dynamic_attributes.train_number = trainNumber;
        dynamic_attributes.train_name = trainName;
        dynamic_attributes.train_name_number = trainNumber ? `${trainName} (${trainNumber})` : trainName;

        // Auto-generate title for Railway Ticket
        title = `${fromStation} ➔ ${toStation} | ${trainName} (${trainNumber}) - ${resolvedTicketType}`;
        condition = 'Confirmed Ticket';
        description = `Railway Ticket for ${trainName} (Train #${trainNumber}) from ${fromStation} to ${toStation} on ${displayDate}. Ticket Class: ${resolvedTicketType}. Campus handover at ${campus_location}. Verified student transfer compliant with Indian Railway guidelines.`;
      } else {
        title = document.getElementById('sell-title')?.value || '';
        condition = document.getElementById('sell-condition')?.value || 'Good';
        description = document.getElementById('sell-description')?.value || '';

        if (category === 'Perfumes') {
          dynamic_attributes.brand = document.getElementById('dyn-brand')?.value || '';
          dynamic_attributes.bottle_size = document.getElementById('dyn-size')?.value || '';
          dynamic_attributes.remaining_level = document.getElementById('dyn-remaining')?.value || '';
          dynamic_attributes.original_box = document.getElementById('dyn-box')?.value || '';
        }
      }

      const images = this.uploadedImages.length > 0 ? this.uploadedImages : (
        category === 'Railway Tickets' ? [
          'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800'
        ] : [
          'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'
        ]
      );

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
