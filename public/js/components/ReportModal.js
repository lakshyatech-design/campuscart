/**
 * CampusCart - Report & Content Moderation Modal
 */
const ReportModal = {
  targetType: 'product',
  targetId: null,
  targetTitle: '',

  open(type, id, title) {
    this.targetType = type;
    this.targetId = id;
    this.targetTitle = title;

    let modalEl = document.getElementById('report-modal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'report-modal';
      modalEl.className = 'modal-overlay';
      document.body.appendChild(modalEl);
    }

    modalEl.classList.add('open');
    this.render();
  },

  close() {
    const modalEl = document.getElementById('report-modal');
    if (modalEl) modalEl.classList.remove('open'); modalEl.style.display = 'none';
  },

  render() {
    const modalEl = document.getElementById('report-modal');

    modalEl.innerHTML = `
      <div class="modal-content" style="max-width: 480px;">
        <div class="modal-header">
          <div class="flex items-center gap-2">
            <span style="color: #EF4444;">${Icons.alertTriangle("w-5 h-5")}</span>
            <h3 class="modal-title">Report Listing</h3>
          </div>
          <button class="modal-close-btn" onclick="ReportModal.close()">
            ${Icons.x("w-5 h-5")}
          </button>
        </div>

        <div class="modal-body">
          <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1.25rem;">
            Help keep CampusCart safe for all students. We take prohibited items and fake listings very seriously.
          </p>

          <div style="background: #F8FAFC; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 0.75rem; margin-bottom: 1.25rem; font-size: 0.82rem;">
            <strong>Target:</strong> ${this.targetTitle || this.targetId}
          </div>

          <form onsubmit="event.preventDefault(); ReportModal.handleSubmit();">
            <div style="margin-bottom: 1rem;">
              <label class="filter-label">Reason for Reporting *</label>
              <select id="report-reason" class="input-field input-plain" required>
                <option value="Prohibited or Illegal Item">Prohibited or Illegal Item</option>
                <option value="Railway Ticket Resale Rule Violation">Railway Ticket Resale Rule Violation</option>
                <option value="Counterfeit or Fake Product">Counterfeit or Fake Product</option>
                <option value="Scam or Suspicious Behavior">Scam or Suspicious Behavior</option>
                <option value="Inappropriate Content">Inappropriate Content</option>
                <option value="Other Policy Violation">Other Policy Violation</option>
              </select>
            </div>

            <div style="margin-bottom: 1.5rem;">
              <label class="filter-label">Additional Details</label>
              <textarea id="report-details" rows="3" class="input-field input-plain" placeholder="Describe what violated campus policies..."></textarea>
            </div>

            <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
              <button type="button" class="btn btn-secondary" onclick="ReportModal.close()">Cancel</button>
              <button type="submit" class="btn btn-primary" style="background: #EF4444;">Submit Report</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  async handleSubmit() {
    if (!state.currentUser) {
      showToast('Please sign in to submit a report', 'info');
      AuthModal.open('login');
      return;
    }

    const reason = document.getElementById('report-reason').value;
    const details = document.getElementById('report-details').value;

    try {
      const res = await API.submitReport({
        target_type: this.targetType,
        target_id: this.targetId,
        reason,
        details
      });

      this.close();
      showToast(res.message, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }
};

window.ReportModal = ReportModal;
