/**
 * CampusCart - Administrator Dashboard & Operations Panel
 */
const AdminDashboard = {
  activeSection: 'overview', // 'overview', 'colleges', 'reports', 'users', 'supabase'
  stats: null,
  collegeRequests: [],
  reports: [],
  adminUsers: [],
  supabaseConfig: null,

  render() {
    const el = document.getElementById('admin-mount');
    if (!el) return;

    const user = state.currentUser;
    if (!user || !user.is_admin) {
      el.innerHTML = `
        <div class="container" style="padding: 2rem 1rem 4rem; text-align: center;">
          <h2 style="font-family: var(--font-display); font-size: 1.75rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">Admin Access Restricted</h2>
          <p style="color: var(--text-muted); margin-bottom: 1.5rem;">You need system administrator credentials to access this dashboard.</p>
          <button class="btn btn-primary" onclick="AuthModal.loginDemo('user-admin')">Log in as Demo Administrator</button>
        </div>
      `;
      return;
    }

    el.innerHTML = `
      <div class="container" style="padding: 0 1rem 5rem 1rem;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.75rem; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.25rem;">CampusCart Headquarters</div>
            <h1 style="font-family: var(--font-display); font-size: 1.85rem; font-weight: 700; color: var(--text-primary);">Admin Control Center</h1>
          </div>
          <div class="flex items-center gap-2">
            <button class="btn btn-secondary btn-sm" onclick="state.setActiveView('marketplace')">
              Back to Marketplace
            </button>
            <button class="btn btn-primary btn-sm" onclick="AdminDashboard.openAddCollegeModal()">
              ${Icons.plusCircle("w-4 h-4")}
              Add New College
            </button>
          </div>
        </div>

        <!-- Admin Navigation Tabs -->
        <div style="display: flex; gap: 0.5rem; border-bottom: 1px solid var(--color-border); margin-bottom: 2rem; overflow-x: auto; padding-bottom: 2px;">
          <button class="btn btn-sm ${this.activeSection === 'overview' ? 'btn-primary' : 'btn-ghost'}" onclick="AdminDashboard.switchSection('overview')">
            Platform Metrics
          </button>
          <button class="btn btn-sm ${this.activeSection === 'colleges' ? 'btn-primary' : 'btn-ghost'}" onclick="AdminDashboard.switchSection('colleges')">
            College Hubs & Requests
          </button>
          <button class="btn btn-sm ${this.activeSection === 'reports' ? 'btn-primary' : 'btn-ghost'}" onclick="AdminDashboard.switchSection('reports')">
            Reports & Moderation
          </button>
          <button class="btn btn-sm ${this.activeSection === 'users' ? 'btn-primary' : 'btn-ghost'}" onclick="AdminDashboard.switchSection('users')">
            User Accounts
          </button>
          <button class="btn btn-sm ${this.activeSection === 'supabase' ? 'btn-primary' : 'btn-ghost'}" onclick="AdminDashboard.switchSection('supabase')">
            Supabase DB Config
          </button>
        </div>

        <!-- Section Body -->
        <div id="admin-section-content">
          <!-- Rendered below -->
        </div>
      </div>
    `;

    this.loadData();
  },

  async loadData() {
    try {
      this.stats = await API.getAdminStats();
      this.collegeRequests = (await API.getAdminCollegeRequests()).requests || [];
      this.reports = (await API.getAdminReports()).reports || [];
      this.adminUsers = (await API.getAdminUsers()).users || [];
      this.supabaseConfig = (await API.getSupabaseConfig()).supabase || {};
      this.renderCurrentSection();
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  },

  switchSection(section) {
    this.activeSection = section;
    this.render();
  },

  renderCurrentSection() {
    const mount = document.getElementById('admin-section-content');
    if (!mount) return;

    if (this.activeSection === 'overview') {
      const s = this.stats || {};
      mount.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
          <div style="background: var(--surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.25rem;">
            <div style="font-size: 0.82rem; color: var(--color-text-muted);">Total Registered Students</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: var(--color-navy); margin-top: 0.25rem;">${s.totalUsers || 0}</div>
          </div>
          <div style="background: var(--surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.25rem;">
            <div style="font-size: 0.82rem; color: var(--color-text-muted);">Active College Campuses</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: var(--color-primary); margin-top: 0.25rem;">${s.activeColleges || 0} / ${s.totalColleges || 0}</div>
          </div>
          <div style="background: var(--surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.25rem;">
            <div style="font-size: 0.82rem; color: var(--color-text-muted);">Active Marketplace Listings</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: var(--color-accent-emerald); margin-top: 0.25rem;">${s.activeProducts || 0}</div>
          </div>
          <div style="background: var(--surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.25rem;">
            <div style="font-size: 0.82rem; color: var(--color-text-muted);">Sold Items</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: #D97706; margin-top: 0.25rem;">${s.soldProducts || 0}</div>
          </div>
          <div style="background: var(--surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.25rem;">
            <div style="font-size: 0.82rem; color: var(--color-text-muted);">Pending Moderation Reports</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: #EF4444; margin-top: 0.25rem;">${s.pendingReports || 0}</div>
          </div>
          <div style="background: var(--surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.25rem;">
            <div style="font-size: 0.82rem; color: var(--color-text-muted);">Pending College Requests</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: var(--color-primary); margin-top: 0.25rem;">${s.pendingCollegeRequests || 0}</div>
          </div>
        </div>

        <div style="background: var(--surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.5rem;">
          <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem;">Platform Health & Operations</h3>
          <p style="font-size: 0.88rem; color: var(--color-text-muted); line-height: 1.6;">
            CampusCart is running with real-time SSE event bus streaming, multi-campus routing, and verified student ID checks. Gati Shakti Vishwavidyalaya (GSV) is designated as the primary launch university, with support for expansion to hundreds of campuses across India.
          </p>
        </div>
      `;
    } else if (this.activeSection === 'colleges') {
      mount.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
          <!-- College Requests -->
          <div>
            <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem;">Student Expansion Requests</h3>
            ${this.collegeRequests.length === 0 ? `
              <div style="padding: 2rem; background: var(--surface); border: 1px dashed var(--color-border); border-radius: var(--radius-md); text-align: center; color: var(--color-text-muted);">
                No pending college expansion requests.
              </div>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${this.collegeRequests.map(r => `
                  <div style="background: var(--surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.35rem;">
                      <strong style="color: var(--color-navy); font-size: 0.95rem;">${r.college_name}</strong>
                      <span style="font-size: 0.72rem; padding: 0.15rem 0.4rem; border-radius: var(--radius-full); background: ${r.status === 'approved' ? '#DCFCE7' : '#FEF3C7'}; color: ${r.status === 'approved' ? '#166534' : '#92400E'};">
                        ${r.status.toUpperCase()}
                      </span>
                    </div>
                    <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">
                      Location: ${r.city}, ${r.state} • Requested by ${r.requester_name} (${r.requester_email})
                    </div>
                    ${r.status === 'pending' ? `
                      <button class="btn btn-primary btn-sm" onclick="AdminDashboard.handleApproveCollege('${r.id}')">
                        Approve & Launch Hub
                      </button>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Existing Colleges -->
          <div>
            <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem;">Active & Configured Campuses</h3>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${state.colleges.map(c => `
                <div style="background: var(--surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1rem; display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-weight: 700; font-size: 0.95rem; color: var(--color-navy); display: flex; align-items: center; gap: 0.5rem;">
                      ${c.name}
                      ${c.badge ? `<span style="font-size: 0.68rem; font-weight: 700; background: #DCFCE7; color: #166534; padding: 0.1rem 0.4rem; border-radius: 4px;">${c.badge}</span>` : ''}
                    </div>
                    <div style="font-size: 0.78rem; color: var(--color-text-muted);">
                      ${c.city}, ${c.state} • Domain: @${c.domain}
                    </div>
                  </div>
                  <div>
                    <button class="btn btn-sm ${c.is_active ? 'btn-secondary' : 'btn-outline'}" onclick="AdminDashboard.handleToggleCollege('${c.id}', ${!c.is_active})">
                      ${c.is_active ? 'Disable' : 'Activate'}
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    } else if (this.activeSection === 'reports') {
      mount.innerHTML = `
        <div style="background: var(--surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.5rem;">
          <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem;">Community Moderation & Reported Content</h3>
          ${this.reports.length === 0 ? `
            <p style="color: var(--color-text-muted); font-size: 0.9rem;">No reported listings or users. Marketplace is clean!</p>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              ${this.reports.map(rep => `
                <div style="border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1rem;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <div>
                      <strong style="color: #EF4444;">${rep.reason}</strong>
                      <span style="font-size: 0.8rem; color: var(--color-text-muted);"> • Type: ${rep.target_type} • ID: ${rep.target_id}</span>
                    </div>
                    <span style="font-size: 0.75rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 4px; background: ${rep.status === 'resolved' ? '#DCFCE7' : '#FEF3C7'};">
                      ${rep.status.toUpperCase()}
                    </span>
                  </div>
                  <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 0.75rem;">
                    Details: ${rep.details || 'No additional comment provided'}
                  </p>
                  <div class="flex items-center gap-2">
                    <button class="btn btn-secondary btn-sm" onclick="ProductDetailModal.open('${rep.target_id}')">
                      Inspect Target
                    </button>
                    ${rep.status === 'pending' ? `
                      <button class="btn btn-sm btn-sell" onclick="AdminDashboard.handleResolveReport('${rep.id}', 'delete_product')">
                        Remove Product
                      </button>
                      <button class="btn btn-ghost btn-sm" onclick="AdminDashboard.handleResolveReport('${rep.id}', 'dismiss')">
                        Dismiss
                      </button>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;
    } else if (this.activeSection === 'users') {
      mount.innerHTML = `
        <div style="background: var(--surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.5rem;">
          <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem;">Registered Student Users</h3>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
              <thead>
                <tr style="border-bottom: 2px solid var(--color-border); color: var(--color-text-muted);">
                  <th style="padding: 0.75rem 0.5rem;">Student Name</th>
                  <th style="padding: 0.75rem 0.5rem;">Email</th>
                  <th style="padding: 0.75rem 0.5rem;">College</th>
                  <th style="padding: 0.75rem 0.5rem;">Roll Number</th>
                  <th style="padding: 0.75rem 0.5rem;">Listings</th>
                  <th style="padding: 0.75rem 0.5rem;">Status</th>
                  <th style="padding: 0.75rem 0.5rem;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${this.adminUsers.map(u => `
                  <tr style="border-bottom: 1px solid var(--color-border);">
                    <td style="padding: 0.75rem 0.5rem; font-weight: 600;">${u.full_name}</td>
                    <td style="padding: 0.75rem 0.5rem; color: var(--color-text-muted);">${u.email}</td>
                    <td style="padding: 0.75rem 0.5rem;">${u.college_short_name || 'GSV'}</td>
                    <td style="padding: 0.75rem 0.5rem;">${u.roll_number || 'N/A'}</td>
                    <td style="padding: 0.75rem 0.5rem;">${u.listing_count || 0}</td>
                    <td style="padding: 0.75rem 0.5rem;">
                      <span style="font-size: 0.75rem; font-weight: 700; color: ${u.is_suspended ? '#EF4444' : '#10B981'};">
                        ${u.is_suspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td style="padding: 0.75rem 0.5rem;">
                      <button class="btn btn-ghost btn-sm" style="font-size: 0.76rem; color: ${u.is_suspended ? '#10B981' : '#EF4444'};" onclick="AdminDashboard.handleToggleSuspendUser('${u.id}', ${!u.is_suspended})">
                        ${u.is_suspended ? 'Reactivate' : 'Suspend'}
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (this.activeSection === 'supabase') {
      const cfg = this.supabaseConfig || {};
      mount.innerHTML = `
        <div style="background: var(--surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div>
              <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--color-navy);">Supabase Cloud Integration Architecture</h3>
              <p style="font-size: 0.85rem; color: var(--color-text-muted);">
                CampusCart is designed for zero-friction deployment to Supabase PostgreSQL, Auth, and Realtime.
              </p>
            </div>
            <span style="font-size: 0.82rem; font-weight: 700; padding: 0.25rem 0.75rem; border-radius: var(--radius-full); background: ${cfg.configured ? '#DCFCE7' : '#EFF6FF'}; color: ${cfg.configured ? '#166534' : '#1D4ED8'};">
              Status: ${cfg.mode || 'Local SQLite + Realtime SSE Active'}
            </span>
          </div>

          <div style="background: #F8FAFC; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
            <div style="font-weight: 700; font-size: 0.9rem; color: var(--color-navy); margin-bottom: 0.4rem;">
              How to Connect Your Supabase Project:
            </div>
            <ol style="font-size: 0.85rem; color: var(--color-text-muted); list-style: decimal; padding-left: 1.25rem; line-height: 1.6;">
              <li>Create a new project on <a href="https://supabase.com" target="_blank" style="color: var(--color-primary); text-decoration: underline;">Supabase.com</a>.</li>
              <li>Open your project's <strong>SQL Editor</strong> and execute the complete schema file from <code>/supabase_schema.sql</code>.</li>
              <li>Copy your Supabase Project URL and Anon Public Key.</li>
              <li>Add them to your environment variables or <code>.env.local</code>:
                <pre style="background: #0F172A; color: #38BDF8; padding: 0.75rem; border-radius: 6px; margin: 0.5rem 0; font-size: 0.82rem;">SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here</pre>
              </li>
              <li>The application automatically detects the keys and switches from local SQLite to Supabase Cloud with Row Level Security (RLS)!</li>
            </ol>
          </div>

          <div class="flex items-center gap-3">
            <a href="/supabase_schema.sql" target="_blank" class="btn btn-secondary btn-sm">
              ${Icons.database("w-4 h-4")}
              Download / View supabase_schema.sql
            </a>
          </div>
        </div>
      `;
    }
  },

  async handleApproveCollege(id) {
    try {
      const res = await API.approveCollegeRequest(id);
      showToast(res.message, 'success');
      const updatedColleges = await API.getColleges();
      state.setColleges(updatedColleges.colleges);
      this.loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async handleToggleCollege(id, is_active) {
    try {
      await API.toggleCollegeActive(id, is_active);
      showToast('College status updated successfully', 'success');
      const updatedColleges = await API.getColleges();
      state.setColleges(updatedColleges.colleges);
      this.loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async handleResolveReport(id, action) {
    try {
      const res = await API.resolveReport(id, action);
      showToast(res.message, 'success');
      this.loadData();
      Marketplace.loadProducts();
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async handleToggleSuspendUser(userId, is_suspended) {
    try {
      const res = await API.toggleUserSuspension(userId, is_suspended);
      showToast(res.message, 'success');
      this.loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  openAddCollegeModal() {
    let modalEl = document.getElementById('admin-add-college-modal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'admin-add-college-modal';
      modalEl.className = 'modal-overlay';
      document.body.appendChild(modalEl);
    }

    modalEl.innerHTML = `
      <div class="modal-content" style="max-width: 500px;">
        <div class="modal-header">
          <h3 class="modal-title">Add New University Hub</h3>
          <button class="modal-close-btn" onclick="document.getElementById('admin-add-college-modal').classList.remove('open')">
            ${Icons.x("w-5 h-5")}
          </button>
        </div>
        <div class="modal-body">
          <form onsubmit="event.preventDefault(); AdminDashboard.submitAddCollege();">
            <div style="margin-bottom: 0.85rem;">
              <label class="filter-label">Full Name *</label>
              <input type="text" id="add-col-name" required class="input-field input-plain" placeholder="e.g. Indian Institute of Science (IISc)" />
            </div>
            <div style="margin-bottom: 0.85rem;">
              <label class="filter-label">Short Name *</label>
              <input type="text" id="add-col-short" required class="input-field input-plain" placeholder="e.g. IISc Bengaluru" />
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.85rem;">
              <div>
                <label class="filter-label">City *</label>
                <input type="text" id="add-col-city" required class="input-field input-plain" placeholder="Bengaluru" />
              </div>
              <div>
                <label class="filter-label">State *</label>
                <input type="text" id="add-col-state" required class="input-field input-plain" placeholder="Karnataka" />
              </div>
            </div>
            <div style="margin-bottom: 1.25rem;">
              <label class="filter-label">Email Domain *</label>
              <input type="text" id="add-col-domain" required class="input-field input-plain" placeholder="iisc.ac.in" />
            </div>
            <button type="submit" class="btn btn-primary w-full" style="width: 100%;">
              Create Campus Hub
            </button>
          </form>
        </div>
      </div>
    `;

    modalEl.classList.add('open');
  },

  async submitAddCollege() {
    const name = document.getElementById('add-col-name').value;
    const short_name = document.getElementById('add-col-short').value;
    const city = document.getElementById('add-col-city').value;
    const stateVal = document.getElementById('add-col-state').value;
    const domain = document.getElementById('add-col-domain').value;

    try {
      await API.request('/api/admin/colleges', {
        method: 'POST',
        body: JSON.stringify({
          name,
          short_name,
          city,
          state: stateVal,
          domain,
          is_active: 1
        })
      });

      document.getElementById('admin-add-college-modal').classList.remove('open');
      showToast(`Added ${short_name} to CampusCart!`, 'success');
      const updatedColleges = await API.getColleges();
      state.setColleges(updatedColleges.colleges);
      this.loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }
};
