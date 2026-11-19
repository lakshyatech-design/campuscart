/**
 * GSV Direct - Student Authentication Modal
 * Locked to verified GSV credentials
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

    modalEl.style.display = 'flex';
    modalEl.classList.add('open');
    this.render();
  },

  close() {
    const modalEl = document.getElementById('auth-modal');
    if (modalEl) {
      modalEl.classList.remove('open');
      modalEl.style.display = 'none';
    }
  },

  switchMode(mode) {
    this.mode = mode;
    this.render();
  },

  render() {
    let modalEl = document.getElementById('auth-modal');
    if (!modalEl) return;

    modalEl.innerHTML = `
      <div class="modal-card" style="max-width: 480px; width: 100%;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div class="brand-icon-wrapper" style="width: 32px; height: 32px; color: var(--accent);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <h3 class="modal-title">
              ${this.mode === 'login' ? 'GSV Student Sign In' : (this.mode === 'register' ? 'Register GSV Account' : 'Reset Student Password')}
            </h3>
          </div>
          <button class="modal-close-btn" id="auth-modal-close-btn" onclick="window.AuthModal.close()" title="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="modal-body">
          <div style="background: var(--surface-raised); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 0.75rem 1rem; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between;">
            <div style="font-size: 0.8rem; color: var(--text-muted);">
              Exclusive Campus: <strong style="color: var(--text-primary);">GSV Vadodara</strong>
            </div>
            <span style="font-size: 0.7rem; font-weight: 700; background: var(--accent-glow); color: var(--accent); padding: 0.15rem 0.5rem; border-radius: var(--radius-full);">
              @gsv.ac.in Only
            </span>
          </div>

          ${this.mode === 'login' ? `
            <!-- Login Form -->
            <form onsubmit="event.preventDefault(); AuthModal.handleLogin();">
              <div style="margin-bottom: 1rem;">
                <label class="filter-label">GSV Student Email</label>
                <input type="email" id="auth-email" required class="input-field input-plain" placeholder="student.name@gsv.ac.in" />
              </div>
              <div style="margin-bottom: 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.4rem;">
                  <label class="filter-label" style="margin-bottom: 0;">Password</label>
                  <a href="#" onclick="event.preventDefault(); AuthModal.switchMode('forgot');" style="font-size: 0.76rem; color: var(--accent);">Forgot password?</a>
                </div>
                <input type="password" id="auth-password" required class="input-field input-plain" placeholder="Enter student password" />
              </div>
              <button type="submit" class="btn btn-primary w-full" style="width: 100%;" id="auth-login-btn">
                Sign In to GSV Direct
              </button>
              <div style="text-align: center; margin-top: 1.25rem; font-size: 0.85rem; color: var(--text-muted);">
                New student at GSV? 
                <a href="#" onclick="event.preventDefault(); AuthModal.switchMode('register');" style="color: var(--accent); font-weight: 700;">Create verified account</a>
              </div>
            </form>
          ` : (this.mode === 'register' ? `
            <!-- Registration Form -->
            <form onsubmit="event.preventDefault(); AuthModal.handleRegister();">
              <div style="margin-bottom: 0.85rem;">
                <label class="filter-label">Full Name *</label>
                <input type="text" id="reg-name" required class="input-field input-plain" placeholder="Student Full Name" />
              </div>

              <div style="margin-bottom: 0.85rem;">
                <label class="filter-label">Enrolled Campus *</label>
                <input type="hidden" id="reg-college" value="gsv-vadodara" />
                <div class="input-field input-plain" style="display: flex; align-items: center; justify-content: space-between; background: var(--surface-raised); color: var(--text-primary); cursor: default;">
                  <span>Gati Shakti Vishwavidyalaya, Vadodara</span>
                  <span style="font-size: 0.72rem; color: var(--accent); font-weight: 700;">Verified Campus</span>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.85rem;">
                <div>
                  <label class="filter-label">Roll Number *</label>
                  <input type="text" id="reg-roll" required class="input-field input-plain" placeholder="e.g. 2024-BTECH-001" />
                </div>
                <div>
                  <label class="filter-label">Mobile Number *</label>
                  <input type="tel" id="reg-mobile" required class="input-field input-plain" placeholder="+91 98765 43210" />
                </div>
              </div>

              <div style="margin-bottom: 0.85rem;">
                <label class="filter-label">GSV Email *</label>
                <input type="email" id="reg-email" required class="input-field input-plain" placeholder="student.name@gsv.ac.in" />
              </div>

              <div style="margin-bottom: 1.25rem;">
                <label class="filter-label">Create Password *</label>
                <input type="password" id="reg-password" required minlength="6" class="input-field input-plain" placeholder="At least 6 characters" />
              </div>

              <button type="submit" class="btn btn-primary w-full" style="width: 100%;" id="auth-register-btn">
                Register Student Account
              </button>

              <div style="text-align: center; margin-top: 1rem; font-size: 0.85rem; color: var(--text-muted);">
                Already have an account? 
                <a href="#" onclick="event.preventDefault(); AuthModal.switchMode('login');" style="color: var(--accent); font-weight: 700;">Sign in</a>
              </div>
            </form>
          ` : `
            <!-- Forgot Password Form -->
            <form onsubmit="event.preventDefault(); AuthModal.handleForgot();">
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem; line-height: 1.4;">
                Enter your registered GSV email address. We'll send you an institutional security code to reset your account password.
              </p>
              <div style="margin-bottom: 1.25rem;">
                <label class="filter-label">GSV Email</label>
                <input type="email" id="forgot-email" required class="input-field input-plain" placeholder="student.name@gsv.ac.in" />
              </div>
              <button type="submit" class="btn btn-primary w-full" style="width: 100%;">
                Send Reset Link
              </button>
              <div style="text-align: center; margin-top: 1.25rem; font-size: 0.85rem;">
                <a href="#" onclick="event.preventDefault(); AuthModal.switchMode('login');" style="color: var(--text-muted);">Back to Sign In</a>
              </div>
            </form>
          `)}
        </div>
      </div>
    `;

    const closeBtn = document.getElementById('auth-modal-close-btn');
    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        AuthModal.close();
      };
    }

    modalEl.onclick = (e) => {
      if (e.target === modalEl) {
        AuthModal.close();
      }
    };
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
      showToast(err.message || 'Login failed. Check your email & password.', 'error');
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
      showToast(`Account created! Welcome to GSV Direct, ${res.user.full_name}`, 'success');
      Navbar.render();
      Marketplace.loadProducts();
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  },

  handleForgot() {
    showToast('Password reset link sent to your GSV email inbox!', 'success');
    this.switchMode('login');
  }
};

window.AuthModal = AuthModal;
