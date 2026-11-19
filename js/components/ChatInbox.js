/**
 * CampusCart - Internal Real-Time Chat & Inbox
 * "The Heart of Safe Campus Transactions"
 */
const ChatInbox = {
  conversations: [],
  activeConversation: null,
  messages: [],
  isLoadingMessages: false,

  render() {
    const el = document.getElementById('inbox-mount');
    if (!el) return;

    if (!state.currentUser) {
      el.innerHTML = `
        <div class="container" style="padding: 2rem 1rem 4rem; text-align: center;">
          <div style="width: 64px; height: 64px; margin: 0 auto 1.5rem; background: var(--accent-glow); border: 1px solid var(--border-accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--accent);">
            ${Icons.messageSquare("w-8 h-8")}
          </div>
          <h2 style="font-family: var(--font-display); font-size: 1.75rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">Student Inbox & Campus Chat</h2>
          <p style="color: var(--text-muted); max-width: 440px; margin: 0 auto 1.5rem; font-size: 0.9rem;">
            Sign in with your GSV email to access your direct, private chats with student buyers and sellers across your campus.
          </p>
          <button class="btn btn-primary" onclick="AuthModal.open('login')">
            Sign In to CampusCart
          </button>
        </div>
      `;
      return;
    }

    el.innerHTML = `
      <div class="container" style="padding: 0 1rem 3rem 1rem;">
        <!-- Header -->
        <div class="inbox-page-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.72rem; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.35rem;">
              Campus Communications Hub
            </div>
            <h1 style="font-family: var(--font-display); font-size: 1.85rem; font-weight: 700; color: var(--text-primary); letter-spacing: -0.01em;">
              Campus Messages
            </h1>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">
              Safe in-app negotiation • Verified student identities • Direct meetup agreements
            </p>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="state.setActiveView('marketplace')" style="display: inline-flex; align-items: center; gap: 0.4rem;">
            ← Back to Marketplace
          </button>
        </div>

        <!-- Main Chat App Frame -->
        <div class="inbox-container" id="inbox-container">
          <!-- Left: Conversation Roster -->
          <aside class="inbox-sidebar" id="inbox-sidebar">
            <div class="inbox-search-header">
              <div class="search-input-wrap">
                ${Icons.search("w-4 h-4")}
                <input 
                  type="text" 
                  class="input-field" 
                  id="inbox-filter-search" 
                  placeholder="Filter conversations..." 
                  oninput="ChatInbox.filterConversations(this.value)"
                />
              </div>
            </div>

            <div class="conversation-list" id="conversation-list-mount">
              <!-- Rendered items -->
            </div>
          </aside>

          <!-- Right: Active Chat Room -->
          <main class="chat-main-area" id="chat-main-area">
            <!-- Dynamic Room -->
          </main>
        </div>
      </div>
    `;

    this.loadConversations();
  },

  async loadConversations() {
    try {
      const res = await API.getConversations();
      this.conversations = res.conversations || [];

      // Update badge in state
      const totalUnread = this.conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0);
      state.setUnreadCounts(undefined, totalUnread);

      this.renderConversationList();

      // Open target conversation if specified
      if (state.activeConversationId) {
        const target = this.conversations.find(c => c.id === state.activeConversationId);
        if (target) {
          this.selectConversation(target);
          state.activeConversationId = null;
          return;
        }
      }

      // Default select first conversation if available
      if (!this.activeConversation && this.conversations.length > 0) {
        this.selectConversation(this.conversations[0]);
      } else if (this.activeConversation) {
        // Refresh active conversation reference
        const updated = this.conversations.find(c => c.id === this.activeConversation.id);
        if (updated) this.activeConversation = updated;
      } else {
        this.renderEmptyChatState();
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  },

  renderConversationList() {
    const mount = document.getElementById('conversation-list-mount');
    if (!mount) return;

    if (this.conversations.length === 0) {
      mount.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--color-text-muted);">
          <div style="margin-bottom: 0.75rem; color: var(--color-text-subtle);">
            ${Icons.messageSquare("w-8 h-8")}
          </div>
          <p style="font-weight: 600; font-size: 0.9rem;">No chats yet</p>
          <p style="font-size: 0.78rem; margin-top: 0.25rem;">Browse products and click "Chat with Seller" to start!</p>
        </div>
      `;
      return;
    }

    mount.innerHTML = this.conversations.map(c => {
      const isSelected = this.activeConversation && this.activeConversation.id === c.id;
      const otherUser = c.other_user;
      const prodImg = c.product_images && c.product_images[0] ? c.product_images[0] : 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100';

      return `
        <div 
          class="conversation-item ${isSelected ? 'active' : ''}" 
          onclick="ChatInbox.selectConversationById('${c.id}')"
        >
          <img src="${otherUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}" class="chat-avatar" alt="${otherUser.name}" />
          
          <div class="chat-meta">
            <div class="chat-name-row">
              <span class="chat-user-name">${otherUser.name}</span>
              <span class="chat-time">${this.formatTime(c.last_message_at)}</span>
            </div>
            
            <div class="chat-product-hint">
              ${c.product_title} • ₹${c.product_price}
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="chat-last-msg">${c.last_message || 'Inquiry started'}</span>
              ${c.unread_count > 0 ? `
                <span class="nav-badge" style="font-size: 0.68rem; padding: 0.1rem 0.4rem;">${c.unread_count}</span>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  backToList() {
    const container = document.getElementById('inbox-container');
    if (container) container.classList.remove('chat-active');
    this.activeConversation = null;
  },

  selectConversationById(id) {
    const conv = this.conversations.find(c => c.id === id);
    if (conv) this.selectConversation(conv);
  },

  async selectConversation(conv) {
    this.activeConversation = conv;
    conv.unread_count = 0; // Optimistic mark as read
    this.renderConversationList();

    const container = document.getElementById('inbox-container');
    if (container) container.classList.add('chat-active');
    const mainArea = document.getElementById('chat-main-area');
    if (!mainArea) return;

    const prodImg = conv.product_images && conv.product_images[0] ? conv.product_images[0] : 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100';
    const otherUser = conv.other_user;

    mainArea.innerHTML = `
      <!-- Top Product Information Bar -->
      <div class="chat-product-header">
        <div class="chat-product-brief" style="display: flex; align-items: center; gap: 0.65rem;">
          <button class="chat-back-btn" onclick="ChatInbox.backToList()" title="Back to conversations">
            ${Icons.arrowRight("w-4 h-4") ? '<span style="font-size: 1.1rem; font-weight: bold; line-height: 1;">←</span>' : '←'}
          </button>
          <img src="${prodImg}" class="chat-prod-thumb" alt="${conv.product_title}" />
          <div>
            <div style="font-weight: 700; font-size: 0.95rem; color: var(--color-navy); display: flex; align-items: center; gap: 0.5rem;">
              <span>${conv.product_title}</span>
              <span style="font-size: 0.72rem; font-weight: 700; background: ${conv.product_status === 'sold' ? '#FEE2E2' : '#DCFCE7'}; color: ${conv.product_status === 'sold' ? '#991B1B' : '#166534'}; padding: 0.1rem 0.45rem; border-radius: var(--radius-full);">
                ${conv.product_status === 'sold' ? 'Sold' : 'Active Listing'}
              </span>
            </div>
            <div style="font-size: 0.82rem; color: var(--color-text-muted);">
              <strong>₹${conv.product_price.toLocaleString('en-IN')}</strong> • Chatting with <strong>${otherUser.name}</strong> (${otherUser.college || 'Campus'})
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button class="btn btn-secondary btn-sm" onclick="ProductDetailModal.open('${conv.product_id}')">
            View Listing
          </button>
        </div>
      </div>

      <!-- Quick Action Offer Chips (OLX & Airbnb style) -->
      <div class="quick-offers-chips">
        <button class="quick-chip" onclick="ChatInbox.sendQuickMessage('Hi! Is this still available?')">
          👋 Is this still available?
        </button>
        <button class="quick-chip" onclick="ChatInbox.sendQuickMessage('Can we meet at the Central Canteen today around 5:30 PM?')">
          ☕ Meet at Central Canteen 5:30 PM
        </button>
        <button class="quick-chip" onclick="ChatInbox.sendQuickMessage('Would you consider ₹${Math.round(conv.product_price * 0.9)} for quick cash pickup?')">
          🤝 Offer ₹${Math.round(conv.product_price * 0.9)}
        </button>
        <button class="quick-chip" onclick="ChatInbox.sendQuickMessage('Can you please hold this item for me until tomorrow morning?')">
          ⏳ Hold until tomorrow
        </button>
      </div>

      <!-- Messages Stream -->
      <div class="messages-stream" id="messages-stream">
        <div style="text-align: center; padding: 2rem; color: var(--color-text-muted); font-size: 0.85rem;">
          Loading conversation messages...
        </div>
      </div>

      <!-- Message Composer Bar -->
      <form class="chat-input-bar" onsubmit="event.preventDefault(); ChatInbox.handleSendMessage();">
        <input 
          type="text" 
          id="chat-message-input" 
          class="input-field input-plain" 
          placeholder="Type a message to ${otherUser.name}... (Press Enter to send)" 
          autocomplete="off"
          style="border-radius: var(--radius-full);"
        />
        <button type="submit" class="btn btn-primary" style="border-radius: var(--radius-full); width: 44px; height: 44px; padding: 0;">
          ${Icons.send("w-4 h-4")}
        </button>
      </form>
    `;

    // Load actual messages from API
    await this.loadMessages(conv.id);

    // Focus input
    document.getElementById('chat-message-input')?.focus();
  },

  async loadMessages(conversationId) {
    this.isLoadingMessages = true;
    try {
      const res = await API.getMessages(conversationId);
      this.messages = res.messages || [];
      this.renderMessages();
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      this.isLoadingMessages = false;
    }
  },

  renderMessages() {
    const stream = document.getElementById('messages-stream');
    if (!stream) return;

    if (this.messages.length === 0) {
      stream.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--color-text-muted);">
          <p style="font-size: 0.88rem;">No messages yet. Send a greeting or make an offer below!</p>
        </div>
      `;
      return;
    }

    const currentUserId = state.currentUser ? state.currentUser.id : null;

    stream.innerHTML = this.messages.map(m => {
      const isMe = m.sender_id === currentUserId;
      return `
        <div class="message-bubble ${isMe ? 'message-sent' : 'message-received'}">
          <div>${this.escapeHTML(m.content)}</div>
          <span class="message-time">
            ${this.formatTime(m.created_at)} ${isMe ? '✓✓' : ''}
          </span>
        </div>
      `;
    }).join('');

    // Auto-scroll to bottom
    stream.scrollTop = stream.scrollHeight;
  },

  async handleSendMessage() {
    const input = document.getElementById('chat-message-input');
    if (!input || !this.activeConversation) return;

    const content = input.value.trim();
    if (!content) return;

    input.value = '';

    // Optimistic message append
    const tempMsg = {
      id: 'temp-' + Date.now(),
      conversation_id: this.activeConversation.id,
      sender_id: state.currentUser.id,
      content,
      created_at: new Date().toISOString()
    };
    this.messages.push(tempMsg);
    this.renderMessages();

    try {
      const res = await API.sendMessage(this.activeConversation.id, content);
      // Replace temp with server record
      const idx = this.messages.findIndex(m => m.id === tempMsg.id);
      if (idx !== -1) {
        this.messages[idx] = res.message;
        this.renderMessages();
      }
      this.activeConversation.last_message = content;
      this.renderConversationList();
    } catch (err) {
      showToast('Failed to send message: ' + err.message, 'error');
    }
  },

  sendQuickMessage(msg) {
    const input = document.getElementById('chat-message-input');
    if (input) {
      input.value = msg;
      this.handleSendMessage();
    }
  },

  handleRealtimeMessage(event) {
    // If incoming message matches active room, append immediately
    if (this.activeConversation && event.conversationId === this.activeConversation.id) {
      // Check if already in messages list
      const alreadyHas = this.messages.some(m => m.id === event.messageId);
      if (!alreadyHas && event.senderId !== state.currentUser.id) {
        this.messages.push({
          id: event.messageId || 'msg-' + Date.now(),
          conversation_id: event.conversationId,
          sender_id: event.senderId,
          content: event.content,
          created_at: event.created_at || new Date().toISOString()
        });
        this.renderMessages();
        // Play gentle audio click or notify
        showToast(`New message: "${event.content.substring(0, 30)}..."`, 'info');
      }
    }
    // Refresh conversation list to show new last_message and counters
    this.loadConversations();
  },

  renderEmptyChatState() {
    const mainArea = document.getElementById('chat-main-area');
    if (!mainArea) return;

    mainArea.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 2rem; color: var(--color-text-muted);">
        <div style="width: 72px; height: 72px; border-radius: 50%; background: var(--accent-glow); border: 1px solid var(--border-accent); color: var(--accent); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
          ${Icons.messageSquare("w-8 h-8")}
        </div>
        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--color-navy); margin-bottom: 0.35rem;">Select a Conversation</h3>
        <p style="font-size: 0.88rem; max-width: 360px;">
          Choose an inquiry from the list on the left to start negotiating or agreeing on a campus meetup location.
        </p>
      </div>
    `;
  },

  filterConversations(query) {
    const term = (query || '').toLowerCase();
    const items = document.querySelectorAll('.conversation-item');
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(term) ? 'flex' : 'none';
    });
  },

  formatTime(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diffHours = (now - d) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  },

  escapeHTML(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
  }
};
