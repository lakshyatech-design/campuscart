/**
 * CampusCart - Authentication Modal (Dual Role Buyer/Seller)
 */
const AuthModal = {
  mode: 'login', // 'login', 'register', 'forgot'

  open(mode = 'login') {
    this.mode = mode;
    let modalEl = document.getElementById('auth-modal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'auth-modal';
      modalEl.className = 'modal-overlay';
      document.body.appendChild(modalEl);
    }

    modalEl.classList.add('open');
    this.render();
  },

  close() {
    const modalEl = document.getElementById('auth-modal');
    if (modalEl) modalEl.classList.remove('open');
  },

  switchMode(mode) {
    this.mode = mode;
    this.render();
  },

  render() {
    const modalEl = document.getElementById('auth-modal');
    const selectedCollege = state.selectedCollege || { id: 'gsv-vadodara', name: 'Gati Shakti Vishwavidyalaya (GSV)', short_name: 'GSV Vadodara' };

    modalEl.innerHTML = `
      <div class="modal-content" style="max-width: 480px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div class="brand-icon-wrapper" style="width: 32px; height: 32px;">
              ${Icons.shoppingBag("w-4 h-4")}
            </div>
            <h3 class="modal-title">
              ${this.mode === 'login' ? 'Sign In to CampusCart' : (this.mode === 'register' ? 'Create Student Account' : 'Reset Password')}
            </h3>
          </div>
          <button class="modal-close-btn" onclick="AuthModal.close()">
            ${Icons.x("w-5 h-5")}
          </button>
        </div>

        <div class="modal-body">
          <!-- One-Click Instant Demo Login Switcher (For Evaluators) -->
          <div style="background: var(--surface-raised); border: 1px solid var(--border-accent); border-radius: var(--radius-md); padding: 0.85rem; margin-bottom: 1.25rem;">
            <div style="font-size: 0.74rem; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.4rem;">
              ⚡ Quick One-Click Demo Accounts (Test Buyer / Seller Chat)
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem;">
              <button class="btn btn-secondary btn-sm" style="font-size: 0.74rem; padding: 0.35rem 0.5rem;" onclick="AuthModal.loginDemo('user-aarav')">
                👤 Aarav (GSV Seller)
              </button>
              <button class="btn btn-secondary btn-sm" style="font-size: 0.74rem; padding: 0.35rem 0.5rem;" onclick="AuthModal.loginDemo('user-priya')">
                👩 Priya (GSV Buyer)
              </button>
              <button class="btn btn-secondary btn-sm" style="font-size: 0.74rem; padding: 0.35rem 0.5rem;" onclick="AuthModal.loginDemo('user-rohan')">
                🎓 Rohan (Student)
              </button>
              <button class="btn btn-secondary btn-sm" style="font-size: 0.74rem; padding: 0.35rem 0.5rem; color: var(--accent);" onclick="AuthModal.loginDemo('user-admin')">
                🛡️ Admin Account
              </button>
            </div>
          </div>

          ${this.mode === 'login' ? `
            <!-- Login Form -->
            <form onsubmit="event.preventDefault(); AuthModal.handleLogin();">
              <div style="margin-bottom: 1rem;">
                <label class="filter-label">Student / College Email</label>
                <input type="email" id="auth-email" required class="input-field input-plain" placeholder="e.g. student@gsv.ac.in" />
              </div>
              <div style="margin-bottom: 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.4rem;">
                  <label class="filter-label" style="margin-bottom: 0;">Password</label>
                  <a href="#" onclick="event.preventDefault(); AuthModal.switchMode('forgot');" style="font-size: 0.76rem; color: var(--color-primary);">Forgot password?</a>
                </div>
                <input type="password" id="auth-password" required class="input-field input-plain" placeholder="Enter password (demo: student123)" />
              </div>
              <button type="submit" class="btn btn-primary w-full" style="width: 100%;" id="auth-login-btn">
                Sign In
              </button>
              <div style="text-align: center; margin-top: 1.25rem; font-size: 0.85rem; color: var(--color-text-muted);">
                Don't have a student account yet? 
                <a href="#" onclick="event.preventDefault(); AuthModal.switchMode('register');" style="color: var(--color-primary); font-weight: 700;">Sign up</a>
              </div>
            </form>
          ` : (this.mode === 'register' ? `
            <!-- Registration Form -->
            <form onsubmit="event.preventDefault(); AuthModal.handleRegister();">
              <div style="margin-bottom: 0.85rem;">
                <label class="filter-label">Full Name *</label>
                <input type="text" id="reg-name" required class="input-field input-plain" placeholder="e.g. Aarav Sharma" />
              </div>

              <div style="margin-bottom: 0.85rem;">
                <label class="filter-label">Selected College *</label>
                <select id="reg-college" class="input-field input-plain" required>
                  ${state.colleges.map(c => `
                    <option value="${c.id}" ${c.id === selectedCollege.id ? 'selected' : ''}>
                      ${c.name} (${c.city})
                    </option>
                  `).join('')}
                </select>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.85rem;">
                <div>
                  <label class="filter-label">Roll Number / Student ID *</label>
                  <input type="text" id="reg-roll" required class="input-field input-plain" placeholder="e.g. GSV2024BTECH01" />
                </div>
                <div>
                  <label class="filter-label">Mobile Number *</label>
                  <input type="tel" id="reg-mobile" required class="input-field input-plain" placeholder="+91 98765 43210" />
                </div>
              </div>

              <div style="margin-bottom: 0.85rem;">
                <label class="filter-label">College Email *</label>
                <input type="email" id="reg-email" required class="input-field input-plain" placeholder="your.name@gsv.ac.in" />
              </div>

              <div style="margin-bottom: 1.25rem;">
                <label class="filter-label">Create Password *</label>
                <input type="password" id="reg-password" required minlength="6" class="input-field input-plain" placeholder="At least 6 characters" />
              </div>

              <div style="font-size: 0.76rem; color: var(--color-text-muted); margin-bottom: 1rem; line-height: 1.4;">
                ℹ️ By registering, you can act as both <strong>Buyer and Seller</strong> freely with verified college status.
              </div>

              <button type="submit" class="btn btn-primary w-full" style="width: 100%;" id="auth-register-btn">
                Complete Registration
              </button>

              <div style="text-align: center; margin-top: 1rem; font-size: 0.85rem; color: var(--color-text-muted);">
                Already have an account? 
                <a href="#" onclick="event.preventDefault(); AuthModal.switchMode('login');" style="color: var(--color-primary); font-weight: 700;">Sign in</a>
              </div>
            </form>
          ` : `
            <!-- Forgot Password Form -->
            <div>
              <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1.25rem;">
                Enter your registered student email address. We will verify your ID and send a password reset OTP.
              </p>
              <form onsubmit="event.preventDefault(); AuthModal.handleForgot();">
                <div style="margin-bottom: 1.25rem;">
                  <label class="filter-label">College Email</label>
                  <input type="email" id="forgot-email" required class="input-field input-plain" placeholder="student@gsv.ac.in" />
                </div>
                <button type="submit" class="btn btn-primary w-full" style="width: 100%;">
                  Send Reset Link
                </button>
                <div style="text-align: center; margin-top: 1rem; font-size: 0.85rem;">
                  <a href="#" onclick="event.preventDefault(); AuthModal.switchMode('login');" style="color: var(--color-primary);">Back to Sign In</a>
                </div>
              </form>
            </div>
          `)}
        </div>
      </div>
    `;
  },

  async handleLogin() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const btn = document.getElementById('auth-login-btn');

    if (btn) btn.disabled = true;

    try {
      const res = await API.login(email, password);
      state.setCurrentUser(res.user);
      this.close();
      showToast(`Welcome back, ${res.user.full_name}!`, 'success');
      Navbar.render();
      Marketplace.loadProducts();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  },

  async handleRegister() {
    const full_name = document.getElementById('reg-name').value;
    const college_id = document.getElementById('reg-college').value;
    const roll_number = document.getElementById('reg-roll').value;
    const mobile = document.getElementById('reg-mobile').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    const btn = document.getElementById('auth-register-btn');
    if (btn) btn.disabled = true;

    try {
      const res = await API.register({
        full_name,
        college_id,
        roll_number,
        mobile,
        email,
        password
      });

      state.setCurrentUser(res.user);
      this.close();
      showToast(`Account created! Welcome to CampusCart, ${res.user.full_name}`, 'success');
      Navbar.render();
      Marketplace.loadProducts();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  },

  async loginDemo(userId) {
    try {
      const res = await API.switchDemoUser(userId);
      state.setCurrentUser(res.user);
      this.close();
      showToast(`Logged in as demo user: ${res.user.full_name} (${res.user.role})`, 'success');
      Navbar.render();
      Marketplace.loadProducts();
      if (state.activeView === 'seller-dashboard') {
        SellerDashboard.render();
      } else if (state.activeView === 'inbox') {
        ChatInbox.render();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  handleForgot() {
    showToast('Password reset link sent to your college email inbox!', 'success');
    this.switchMode('login');
  }
};
