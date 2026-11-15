/**
 * CampusCart - College Selection System (Multi-College Platform)
 * "Your Campus. Your Community. Your Marketplace."
 */
const CollegeSelectorModal = {
  searchTerm: '',

  render() {
    let modalEl = document.getElementById('college-modal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'college-modal';
      modalEl.className = 'modal-overlay';
      document.body.appendChild(modalEl);
    }

    const currentCollegeId = state.selectedCollege ? state.selectedCollege.id : 'gsv-vadodara';
    const filteredColleges = state.colleges.filter(c => {
      if (!this.searchTerm) return true;
      const term = this.searchTerm.toLowerCase();
      return c.name.toLowerCase().includes(term) ||
             c.short_name.toLowerCase().includes(term) ||
             c.city.toLowerCase().includes(term) ||
             c.state.toLowerCase().includes(term);
    });

    modalEl.innerHTML = `
      <div class="modal-content" style="max-width: 680px;">
        <div class="modal-header">
          <div>
            <h3 class="modal-title flex items-center gap-2">
              <span style="color: var(--color-primary);">${Icons.mapPin("w-5 h-5")}</span>
              Select Your College Campus
            </h3>
            <p style="font-size: 0.82rem; color: var(--color-text-muted); margin-top: 2px;">
              Your Campus. Your Community. Your Marketplace.
            </p>
          </div>
          <button class="modal-close-btn" onclick="CollegeSelectorModal.close()">
            ${Icons.x("w-5 h-5")}
          </button>
        </div>

        <div class="modal-body">
          <!-- Search input -->
          <div class="search-input-wrap" style="margin-bottom: 1.25rem;">
            ${Icons.search("w-4 h-4")}
            <input 
              type="text" 
              class="input-field" 
              id="college-search-input" 
              placeholder="Search by college name, city (e.g. GSV, Vadodara, IIT)..." 
              value="${this.searchTerm}"
            />
          </div>

          <!-- Explore Other Colleges Toggle Switch -->
          <div style="background: var(--surface-raised); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 0.85rem 1rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <div>
              <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary);">Explore Listings From All Campuses</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Browse verified items across India or toggle off to view your campus only</div>
            </div>
            <label style="position: relative; display: inline-block; width: 44px; height: 24px; cursor: pointer;">
              <input type="checkbox" id="explore-all-colleges-toggle" ${state.exploreAllColleges ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
              <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: ${state.exploreAllColleges ? 'var(--accent)' : 'var(--surface)'}; border: 1px solid var(--border); transition: .3s; border-radius: 24px;"></span>
              <span style="position: absolute; height: 18px; width: 18px; left: ${state.exploreAllColleges ? '22px' : '3px'}; bottom: 3px; background-color: ${state.exploreAllColleges ? '#000' : 'var(--text-muted)'}; transition: .3s; border-radius: 50%;"></span>
            </label>
          </div>

          <!-- College List Cards -->
          <div style="display: flex; flex-direction: column; gap: 0.75rem; max-height: 380px; overflow-y: auto; padding-right: 0.25rem;">
            ${filteredColleges.map(c => `
              <div 
                class="college-select-card" 
                style="display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.15rem; border: 1px solid ${c.id === currentCollegeId ? 'var(--accent)' : 'var(--border)'}; background: ${c.id === currentCollegeId ? 'var(--accent-glow)' : 'var(--surface-raised)'}; border-radius: var(--radius-lg); cursor: pointer; transition: all var(--transition-fast);"
                onclick="CollegeSelectorModal.select('${c.id}')"
              >
                <div style="display: flex; align-items: center; gap: 1rem;">
                  <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: ${c.id === 'gsv-vadodara' ? 'var(--accent)' : 'var(--surface)'}; color: ${c.id === 'gsv-vadodara' ? '#000' : 'var(--text-secondary)'}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.95rem; flex-shrink: 0;">
                    ${c.short_name.substring(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <div style="font-weight: 700; font-size: 0.96rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
                      ${c.name}
                      ${c.badge ? `<span style="font-size: 0.68rem; font-weight: 700; background: var(--accent-glow); color: var(--accent); border: 1px solid var(--border-accent); padding: 0.15rem 0.5rem; border-radius: var(--radius-full);">${c.badge}</span>` : ''}
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
                      ${c.city}, ${c.state} • ${c.domain}
                    </div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <span style="font-size: 0.78rem; font-weight: 600; color: ${c.is_active ? 'var(--success)' : 'var(--text-muted)'};">
                    ${c.is_active ? '● Active' : '○ Hub Setup'}
                  </span>
                  ${c.id === currentCollegeId ? `
                    <span style="color: var(--accent);">${Icons.checkCircle("w-5 h-5")}</span>
                  ` : ''}
                </div>
              </div>
            `).join('')}

            ${filteredColleges.length === 0 ? `
              <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                <p>No universities found matching "${this.searchTerm}".</p>
              </div>
            ` : ''}
          </div>

          <!-- College Not Listed Action Banner -->
          <div style="margin-top: 1.5rem; padding: 1.25rem; background: var(--surface-raised); border: 1px dashed var(--border-accent); border-radius: var(--radius-lg); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-primary);">Is your college not listed yet?</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">We launch new campuses within 24 hours of student verification.</div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="CollegeSelectorModal.openRequestModal()">
              ${Icons.plusCircle("w-4 h-4")}
              Request to Add Your College
            </button>
          </div>
        </div>
      </div>
    `;

    // Attach search input listener
    const searchInput = document.getElementById('college-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value;
        this.render();
        const reInput = document.getElementById('college-search-input');
        if (reInput) {
          reInput.focus();
          reInput.setSelectionRange(this.searchTerm.length, this.searchTerm.length);
        }
      });
    }

    // Attach Explore All toggle
    const exploreToggle = document.getElementById('explore-all-colleges-toggle');
    if (exploreToggle) {
      exploreToggle.addEventListener('change', (e) => {
        state.setExploreAllColleges(e.target.checked);
        showToast(e.target.checked ? 'Now exploring listings from all Indian campuses' : `Locked to ${state.selectedCollege.short_name}`, 'info');
      });
    }
  },

  open() {
    this.render();
    const modalEl = document.getElementById('college-modal');
    modalEl.classList.add('open');
  },

  close() {
    const modalEl = document.getElementById('college-modal');
    if (modalEl) modalEl.classList.remove('open');
  },

  select(collegeId) {
    const college = state.colleges.find(c => c.id === collegeId);
    if (college) {
      state.setSelectedCollege(college);
      this.close();
      showToast(`Switched campus to ${college.name}`, 'success');
      Navbar.render();
      Marketplace.loadProducts();
    }
  },

  openRequestModal() {
    this.close();
    let reqModal = document.getElementById('college-request-modal');
    if (!reqModal) {
      reqModal = document.createElement('div');
      reqModal.id = 'college-request-modal';
      reqModal.className = 'modal-overlay';
      document.body.appendChild(reqModal);
    }

    reqModal.innerHTML = `
      <div class="modal-content" style="max-width: 520px;">
        <div class="modal-header">
          <h3 class="modal-title">Request to Add Your College</h3>
          <button class="modal-close-btn" onclick="document.getElementById('college-request-modal').classList.remove('open')">
            ${Icons.x("w-5 h-5")}
          </button>
        </div>
        <div class="modal-body">
          <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1.25rem;">
            Help bring CampusCart to your university. Our team verifies student credentials and opens the marketplace hub promptly.
          </p>
          <form id="college-request-form" onsubmit="event.preventDefault(); CollegeSelectorModal.submitRequest();">
            <div style="margin-bottom: 1rem;">
              <label class="filter-label">College / University Full Name *</label>
              <input type="text" id="req-college-name" required class="input-field input-plain" placeholder="e.g. IIT Delhi, BITS Goa, NID Ahmedabad" />
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
              <div>
                <label class="filter-label">City *</label>
                <input type="text" id="req-college-city" required class="input-field input-plain" placeholder="City" />
              </div>
              <div>
                <label class="filter-label">State *</label>
                <input type="text" id="req-college-state" required class="input-field input-plain" placeholder="State" />
              </div>
            </div>
            <div style="margin-bottom: 1rem;">
              <label class="filter-label">Your Full Name *</label>
              <input type="text" id="req-student-name" required class="input-field input-plain" placeholder="Your Name" />
            </div>
            <div style="margin-bottom: 1rem;">
              <label class="filter-label">Your College / Student Email *</label>
              <input type="email" id="req-student-email" required class="input-field input-plain" placeholder="name@college.edu.in" />
            </div>
            <div style="margin-bottom: 1.5rem;">
              <label class="filter-label">Why should we launch at your campus?</label>
              <textarea id="req-reason" rows="3" class="input-field input-plain" placeholder="Tell us about student hostel density, active buy/sell groups, etc."></textarea>
            </div>
            <button type="submit" class="btn btn-primary w-full" style="width: 100%;">
              Submit College Request
            </button>
          </form>
        </div>
      </div>
    `;

    reqModal.classList.add('open');
  },

  async submitRequest() {
    const college_name = document.getElementById('req-college-name').value;
    const city = document.getElementById('req-college-city').value;
    const stateVal = document.getElementById('req-college-state').value;
    const requester_name = document.getElementById('req-student-name').value;
    const requester_email = document.getElementById('req-student-email').value;
    const reason = document.getElementById('req-reason').value;

    try {
      const res = await API.requestNewCollege({
        college_name,
        city,
        state: stateVal,
        requester_name,
        requester_email,
        reason
      });

      document.getElementById('college-request-modal').classList.remove('open');
      showToast(res.message, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }
};
