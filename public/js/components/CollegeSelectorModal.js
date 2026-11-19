/**
 * GSV Direct - Exclusive University Ecosystem
 * Dedicated exclusively to Gati Shakti Vishwavidyalaya (Vadodara)
 */
const CollegeSelectorModal = {
  render() {
    let modalEl = document.getElementById('college-modal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'college-modal';
      modalEl.className = 'modal-overlay';
      document.body.appendChild(modalEl);
    }

    modalEl.innerHTML = `
      <div class="modal-card" style="max-width: 620px; width: 100%;">
        <div class="modal-header">
          <div>
            <h3 class="modal-title flex items-center gap-2">
              <span style="color: var(--accent);">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </span>
              Verified University Campus
            </h3>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">
              Single Exclusive Ecosystem • Gati Shakti Vishwavidyalaya
            </p>
          </div>
          <button class="modal-close-btn" id="college-modal-close-btn" onclick="window.CollegeSelectorModal.close()" title="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="modal-body">
          <!-- Primary Exclusive Campus Card -->
          <div style="background: var(--surface-raised); border: 2px solid var(--accent); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem; position: relative; overflow: hidden;">
            <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
              <div style="display: flex; gap: 1rem; align-items: center;">
                <div style="width: 54px; height: 54px; border-radius: var(--radius-md); background: var(--accent); color: #000; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.25rem; flex-shrink: 0; box-shadow: 0 4px 14px rgba(200, 169, 126, 0.3);">
                  GSV
                </div>
                <div>
                  <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.25rem 0; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                    Gati Shakti Vishwavidyalaya
                    <span style="font-size: 0.68rem; font-weight: 700; background: var(--accent-glow); color: var(--accent); border: 1px solid var(--border-accent); padding: 0.15rem 0.5rem; border-radius: var(--radius-full);">
                      ✓ Exclusive Campus
                    </span>
                  </h4>
                  <div style="font-size: 0.84rem; color: var(--text-muted);">
                    Vadodara, Gujarat • Central University Under Ministry of Railways
                  </div>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 0.4rem; color: #10B981; font-size: 0.78rem; font-weight: 700; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); padding: 0.3rem 0.65rem; border-radius: var(--radius-full);">
                <span style="width: 6px; height: 6px; border-radius: 50%; background: #10B981; display: inline-block;"></span>
                ACTIVE NETWORK
              </div>
            </div>

            <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border); display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem;">
              <div>
                <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Domain Restriction</div>
                <div style="font-size: 0.88rem; font-weight: 700; color: var(--accent); margin-top: 2px;">@gsv.ac.in</div>
              </div>
              <div>
                <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Campus City</div>
                <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary); margin-top: 2px;">Vadodara (BRC)</div>
              </div>
              <div>
                <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Student Base</div>
                <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary); margin-top: 2px;">B.Tech / MBA / M.Tech</div>
              </div>
            </div>
          </div>

          <!-- Single Unified GSV Campus -->
          <div style="margin-bottom: 1.25rem;">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.75rem;">
              Single Unified Campus • In-Chat Handover
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md);">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <span style="color: var(--accent);">🏛️</span>
                  <div>
                    <div style="font-size: 0.88rem; font-weight: 600; color: var(--text-primary);">GSV Vadodara Unified Campus</div>
                    <div style="font-size: 0.76rem; color: var(--text-muted);">Academic Blocks, Central Library, Student Hostels, & Food Court</div>
                  </div>
                </div>
                <span style="font-size: 0.72rem; color: var(--accent); font-weight: 700;">GSV Official</span>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md);">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <span style="color: var(--accent);">💬</span>
                  <div>
                    <div style="font-size: 0.88rem; font-weight: 600; color: var(--text-primary);">Direct In-Chat Meetup Coordination</div>
                    <div style="font-size: 0.76rem; color: var(--text-muted);">Buyers & sellers agree on convenient handover points inside the campus chat</div>
                  </div>
                </div>
                <span style="font-size: 0.72rem; color: #22c55e; font-weight: 700;">Safe & Direct</span>
              </div>
            </div>
          </div>

          <div style="text-align: center; margin-top: 1.5rem;">
            <button class="btn btn-primary w-full" onclick="CollegeSelectorModal.close()" style="width: 100%;">
              Enter GSV Marketplace
            </button>
          </div>
        </div>
      </div>
    `;

    const closeBtn = document.getElementById('college-modal-close-btn');
    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        CollegeSelectorModal.close();
      };
    }

    modalEl.onclick = (e) => {
      if (e.target === modalEl) {
        CollegeSelectorModal.close();
      }
    };
  },

  open() {
    this.render();
    const modalEl = document.getElementById('college-modal');
    if (modalEl) {
      modalEl.style.display = 'flex';
      modalEl.classList.add('open');
    }
  },

  close() {
    const modalEl = document.getElementById('college-modal');
    if (modalEl) {
      modalEl.classList.remove('open');
      modalEl.style.display = 'none';
    }
  },

  select(collegeId) {
    this.close();
    if (window.showToast) {
      showToast('Locked to Gati Shakti Vishwavidyalaya (GSV Vadodara)', 'info');
    }
  }
};

window.CollegeSelectorModal = CollegeSelectorModal;
