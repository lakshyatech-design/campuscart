/**
 * GSV Direct - Student Authentication Modal
 * Locked to verified GSV credentials
 */
const AuthModal = {
  mode: 'login', // 'login', 'register', 'forgot'
  countryCodes: [
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+1', name: 'United States', flag: '🇺🇸' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: '+971', name: 'United Arab Emirates', flag: '🇦🇪' },
    { code: '+61', name: 'Australia', flag: '🇦🇺' },
    { code: '+1', name: 'Canada', flag: '🇨🇦' },
    { code: '+65', name: 'Singapore', flag: '🇸🇬' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+974', name: 'Qatar', flag: '🇶🇦' },
    { code: '+965', name: 'Kuwait', flag: '🇰🇼' },
    { code: '+968', name: 'Oman', flag: '🇴🇲' },
    { code: '+973', name: 'Bahrain', flag: '🇧🇭' },
    { code: '+977', name: 'Nepal', flag: '🇳🇵' },
    { code: '+880', name: 'Bangladesh', flag: '🇧🇩' },
    { code: '+94', name: 'Sri Lanka', flag: '🇱🇰' },
    { code: '+975', name: 'Bhutan', flag: '🇧🇹' },
    { code: '+81', name: 'Japan', flag: '🇯🇵' },
    { code: '+86', name: 'China', flag: '🇨🇳' },
    { code: '+7', name: 'Russia', flag: '🇷🇺' },
    { code: '+82', name: 'South Korea', flag: '🇰🇷' },
    { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
    { code: '+62', name: 'Indonesia', flag: '🇮🇩' },
    { code: '+66', name: 'Thailand', flag: '🇹🇭' },
    { code: '+63', name: 'Philippines', flag: '🇵🇭' },
    { code: '+84', name: 'Vietnam', flag: '🇻🇳' },
    { code: '+64', name: 'New Zealand', flag: '🇳🇿' },
    { code: '+27', name: 'South Africa', flag: '🇿🇦' },
    { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
    { code: '+254', name: 'Kenya', flag: '🇰🇪' },
    { code: '+55', name: 'Brazil', flag: '🇧🇷' },
    { code: '+52', name: 'Mexico', flag: '🇲🇽' },
    { code: '+54', name: 'Argentina', flag: '🇦🇷' },
    { code: '+39', name: 'Italy', flag: '🇮🇹' },
    { code: '+34', name: 'Spain', flag: '🇪🇸' },
    { code: '+31', name: 'Netherlands', flag: '🇳🇱' },
    { code: '+41', name: 'Switzerland', flag: '🇨🇭' },
    { code: '+46', name: 'Sweden', flag: '🇸🇪' },
    { code: '+47', name: 'Norway', flag: '🇳🇴' },
    { code: '+45', name: 'Denmark', flag: '🇩🇰' },
    { code: '+358', name: 'Finland', flag: '🇫🇮' },
    { code: '+353', name: 'Ireland', flag: '🇮🇪' },
    { code: '+48', name: 'Poland', flag: '🇵🇱' },
    { code: '+43', name: 'Austria', flag: '🇦🇹' },
    { code: '+32', name: 'Belgium', flag: '🇧🇪' },
    { code: '+351', name: 'Portugal', flag: '🇵🇹' },
    { code: '+30', name: 'Greece', flag: '🇬🇷' },
    { code: '+420', name: 'Czech Republic', flag: '🇨🇿' },
    { code: '+36', name: 'Hungary', flag: '🇭🇺' },
    { code: '+40', name: 'Romania', flag: '🇷🇴' },
    { code: '+90', name: 'Turkey', flag: '🇹🇷' },
    { code: '+20', name: 'Egypt', flag: '🇪🇬' },
    { code: '+972', name: 'Israel', flag: '🇮🇱' },
    { code: '+98', name: 'Iran', flag: '🇮🇷' },
    { code: '+964', name: 'Iraq', flag: '🇮🇶' },
    { code: '+962', name: 'Jordan', flag: '🇯🇴' },
    { code: '+961', name: 'Lebanon', flag: '🇱🇧' },
    { code: '+212', name: 'Morocco', flag: '🇲🇦' },
    { code: '+230', name: 'Mauritius', flag: '🇲🇺' },
    { code: '+960', name: 'Maldives', flag: '🇲🇻' },
    { code: '+93', name: 'Afghanistan', flag: '🇦🇫' },
    { code: '+92', name: 'Pakistan', flag: '🇵🇰' },
    { code: '+95', name: 'Myanmar', flag: '🇲🇲' },
    { code: '+855', name: 'Cambodia', flag: '🇰🇭' },
    { code: '+886', name: 'Taiwan', flag: '🇹🇼' },
    { code: '+852', name: 'Hong Kong', flag: '🇭🇰' },
    { code: '+56', name: 'Chile', flag: '🇨🇱' },
    { code: '+57', name: 'Colombia', flag: '🇨🇴' },
    { code: '+51', name: 'Peru', flag: '🇵🇪' },
    { code: '+380', name: 'Ukraine', flag: '🇺🇦' },
    { code: '+381', name: 'Serbia', flag: '🇷🇸' },
    { code: '+385', name: 'Croatia', flag: '🇭🇷' },
    { code: '+359', name: 'Bulgaria', flag: '🇧🇬' },
    { code: '+421', name: 'Slovakia', flag: '🇸🇰' },
    { code: '+386', name: 'Slovenia', flag: '🇸🇮' },
    { code: '+370', name: 'Lithuania', flag: '🇱🇹' },
    { code: '+371', name: 'Latvia', flag: '🇱🇻' },
    { code: '+372', name: 'Estonia', flag: '🇪🇪' },
    { code: '+354', name: 'Iceland', flag: '🇮🇸' },
    { code: '+352', name: 'Luxembourg', flag: '🇱🇺' },
    { code: '+356', name: 'Malta', flag: '🇲🇹' },
    { code: '+357', name: 'Cyprus', flag: '🇨🇾' },
    { code: '+994', name: 'Azerbaijan', flag: '🇦🇿' },
    { code: '+995', name: 'Georgia', flag: '🇬🇪' },
    { code: '+374', name: 'Armenia', flag: '🇦🇲' },
    { code: '+7', name: 'Kazakhstan', flag: '🇰🇿' },
    { code: '+998', name: 'Uzbekistan', flag: '🇺🇿' },
    { code: '+213', name: 'Algeria', flag: '🇩🇿' },
    { code: '+233', name: 'Ghana', flag: '🇬🇭' },
    { code: '+251', name: 'Ethiopia', flag: '🇪🇹' },
    { code: '+255', name: 'Tanzania', flag: '🇹🇿' },
    { code: '+256', name: 'Uganda', flag: '🇺🇬' },
    { code: '+263', name: 'Zimbabwe', flag: '🇿🇼' },
    { code: '+260', name: 'Zambia', flag: '🇿🇲' },
    { code: '+506', name: 'Costa Rica', flag: '🇨🇷' },
    { code: '+507', name: 'Panama', flag: '🇵🇦' },
    { code: '+598', name: 'Uruguay', flag: '🇺🇾' }
  ],

  renderCountryOptions() {
    return this.countryCodes.map(c => 
      `<option value="${c.code}" ${c.code === '+91' && c.name === 'India' ? 'selected' : ''}>${c.flag} ${c.code} (${c.name})</option>`
    ).join('');
  },

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
              ${this.mode === 'login' ? 'Student Sign In' : (this.mode === 'register' ? 'Register GSV Account' : 'Reset Student Password')}
            </h3>
          </div>
          <button class="modal-close-btn" id="auth-modal-close-btn" onclick="window.AuthModal.close()" title="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="modal-body">
          ${this.mode === 'login' ? `
            <!-- Login Form -->
            <form onsubmit="event.preventDefault(); AuthModal.handleLogin();">
              <div style="margin-bottom: 1rem;">
                <label class="filter-label">GSV Student Email</label>
                <input type="email" id="auth-email" required class="input-field input-plain" placeholder="" />
              </div>
              <div style="margin-bottom: 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.4rem;">
                  <label class="filter-label" style="margin-bottom: 0;">Password</label>
                  <a href="#" onclick="event.preventDefault(); AuthModal.switchMode('forgot');" style="font-size: 0.76rem; color: var(--accent);">Forgot password?</a>
                </div>
                <input type="password" id="auth-password" required class="input-field input-plain" placeholder="" />
              </div>
              <button type="submit" class="btn btn-primary w-full" style="width: 100%;" id="auth-login-btn">
                Student Sign In
              </button>
              <div style="text-align: center; margin-top: 1.25rem; font-size: 0.85rem; color: var(--text-muted);">
                New student at GSV? 
                <a href="#" onclick="event.preventDefault(); AuthModal.switchMode('register');" style="color: var(--accent); font-weight: 700;">Create verified account</a>
              </div>
            </form>
          ` : (this.mode === 'register' ? `
            <!-- Registration Form: Ask only Name, Roll No, Mobile No, Email, Password -->
            <form onsubmit="event.preventDefault(); AuthModal.handleRegister();">
              <input type="hidden" id="reg-college" value="gsv-vadodara" />

              <div style="margin-bottom: 0.85rem;">
                <label class="filter-label">Full Name *</label>
                <input type="text" id="reg-name" required class="input-field input-plain" placeholder="" />
              </div>

              <div style="margin-bottom: 0.85rem;">
                <label class="filter-label">Roll Number *</label>
                <input type="text" id="reg-roll" required class="input-field input-plain" placeholder="" />
              </div>

              <div style="margin-bottom: 0.85rem;">
                <label class="filter-label">Mobile Number *</label>
                <div class="phone-input-container">
                  <div class="country-code-select-wrapper">
                    <select id="reg-country-code" class="input-field country-code-select" aria-label="Select Country Code" title="Select Country Code">
                      ${this.renderCountryOptions()}
                    </select>
                  </div>
                  <div class="phone-number-input-wrapper">
                    <input 
                      type="tel" 
                      id="reg-mobile" 
                      required 
                      class="input-field input-plain" 
                      placeholder="" 
                      pattern="[0-9\s\-]{6,15}"
                      title="Please enter your mobile phone number"
                      inputmode="numeric"
                    />
                  </div>
                </div>
              </div>

              <div style="margin-bottom: 0.85rem;">
                <label class="filter-label">GSV Student Email *</label>
                <input type="email" id="reg-email" required class="input-field input-plain" placeholder="" />
              </div>

              <div style="margin-bottom: 1.25rem;">
                <label class="filter-label">Password *</label>
                <input type="password" id="reg-password" required minlength="4" class="input-field input-plain" placeholder="" />
              </div>

              <button type="submit" class="btn btn-primary w-full" style="width: 100%;" id="auth-register-btn">
                Register Student Account
              </button>

              <div style="text-align: center; margin-top: 1rem; font-size: 0.85rem; color: var(--text-muted);">
                Already have an account? 
                <a href="#" onclick="event.preventDefault(); AuthModal.switchMode('login');" style="color: var(--accent); font-weight: 700;">Student Sign In</a>
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
                <input type="email" id="forgot-email" required class="input-field input-plain" placeholder="" />
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
    const country_code = document.getElementById('reg-country-code')?.value || '+91';
    let raw_mobile = (document.getElementById('reg-mobile')?.value || '').trim();
    if (raw_mobile.startsWith('+')) {
      const match = raw_mobile.match(/^\+(\d{1,4})\s*(.*)$/);
      if (match) raw_mobile = match[2];
    } else if (raw_mobile.startsWith(country_code.replace('+', ''))) {
      raw_mobile = raw_mobile.slice(country_code.length - 1).trim();
    }
    if (raw_mobile.startsWith('0') && raw_mobile.length > 9) {
      raw_mobile = raw_mobile.substring(1).trim();
    }
    const mobile = `${country_code} ${raw_mobile}`;
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
