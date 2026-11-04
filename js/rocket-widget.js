(() => {
  // Same host switch as js/forms.js. The public chat endpoint needs no key: the
  // backend restricts it by Origin, rate limits and a daily cap instead.
  const API_BASE_URL = ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://127.0.0.1:5000'
    : 'https://rocket-club-web-backend.onrender.com';
  const ENDPOINT = API_BASE_URL + '/api/agent/chat';
  const REQUEST_TIMEOUT_MS = 35000;
  const STORAGE_KEY = 'rocket_widget_user_id';
  // Must match the backend's accepted session id shape.
  const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;
  const RATE_LIMIT_REPLY = "I'm getting a lot of messages right now — give me a minute and try again.";
  const ERROR_REPLY = "I couldn't connect right now. Please try again, or reach our team from the Contact page.";

  let memorySessionId = null;

  function newSessionId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return 'web_' + window.crypto.randomUUID();
    }
    return 'web_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  function getUserId() {
    // localStorage throws in some private-browsing modes; fall back to a
    // per-page-load id so chat still works.
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SESSION_ID_PATTERN.test(stored)) return stored;
      const id = newSessionId();
      localStorage.setItem(STORAGE_KEY, id);
      return id;
    } catch (err) {
      memorySessionId = memorySessionId || newSessionId();
      return memorySessionId;
    }
  }

  function linkify(text) {
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    return escaped
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
      // Claude answers with **bold**; text is already escaped, so this is safe.
      .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  }

  async function requestReply(message) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, user_id: getUserId() }),
        signal: controller.signal,
      });
      if (res.status === 429) return { text: RATE_LIMIT_REPLY, state: 'busy' };
      const data = await res.json().catch(() => null);
      return res.ok && data && typeof data.reply === 'string'
        ? { text: data.reply, state: 'online' }
        : { text: ERROR_REPLY, state: 'unavailable' };
    } catch (err) {
      return { text: ERROR_REPLY, state: 'unavailable' };
    } finally {
      clearTimeout(timer);
    }
  }

  function build() {
    const launcher = document.createElement('button');
    launcher.type = 'button';
    launcher.className = 'rocket-widget-launcher';
    launcher.setAttribute('aria-label', 'Chat with Victoria, your Rocket Club AI assistant');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-controls', 'victoria-chat');
    launcher.innerHTML = '<span class="victoria-launcher-photo" aria-hidden="true"></span><span class="victoria-launcher-copy"><strong>Victoria</strong><span class="victoria-launcher-status">Customer Service</span></span><span class="victoria-launcher-arrow" aria-hidden="true">&#8599;</span>';

    const panel = document.createElement('div');
    panel.className = 'rocket-widget-panel';
    panel.id = 'victoria-chat';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Chat with Victoria, AI assistant');
    panel.setAttribute('aria-modal', 'false');
    panel.hidden = true;
    panel.innerHTML = `
      <div class="rocket-widget-header">
        <div class="rocket-widget-avatar" aria-hidden="true"></div>
        <div class="rocket-widget-title">
          <strong>Victoria <span class="victoria-ai-label">AI</span></strong>
          <span class="victoria-connection" role="status">Ready to chat</span>
        </div>
        <button type="button" class="rocket-widget-close" aria-label="Close chat">&times;</button>
      </div>
      <div class="rocket-widget-log" role="log" aria-label="Conversation with Victoria" aria-live="polite" aria-relevant="additions text"></div>
      <form class="rocket-widget-form" novalidate>
        <label class="sr-only" for="victoria-message">Message Victoria</label>
        <input id="victoria-message" type="text" class="rocket-widget-input" placeholder="Ask Victoria about your business..." autocomplete="off" maxlength="4000">
        <button type="submit" class="rocket-widget-send">Send</button>
      </form>
      <p class="victoria-disclosure">Victoria is an AI assistant. Please don't share sensitive information.</p>
    `;

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    const log = panel.querySelector('.rocket-widget-log');
    const form = panel.querySelector('.rocket-widget-form');
    const input = panel.querySelector('.rocket-widget-input');
    const closeBtn = panel.querySelector('.rocket-widget-close');
    const sendBtn = panel.querySelector('.rocket-widget-send');
    const status = panel.querySelector('.victoria-connection');
    const launcherStatus = launcher.querySelector('.victoria-launcher-status');
    let submitting = false;

    function setStatus(state) {
      const labels = { ready: 'Ready to chat', online: 'Online', busy: 'Back in a moment', unavailable: 'Connection unavailable', offline: 'Offline', typing: 'Victoria is typing...' };
      status.textContent = labels[state];
      launcherStatus.textContent = 'Customer Service';
      panel.dataset.connection = state;
      launcher.dataset.connection = state;
    }
    setStatus(navigator.onLine ? 'ready' : 'offline');
    window.addEventListener('online', () => { if (!submitting) setStatus('ready'); });
    window.addEventListener('offline', () => setStatus('offline'));

    function addBubble(role, text) {
      const row = document.createElement('div');
      row.className = 'rocket-widget-row ' + role;
      const bubble = document.createElement('div');
      bubble.className = 'rocket-widget-bubble';
      bubble.innerHTML = linkify(text);
      row.appendChild(bubble);
      log.appendChild(row);
      log.scrollTop = log.scrollHeight;
      return row;
    }

    function openPanel() {
      panel.hidden = false;
      panel.classList.add('is-open');
      launcher.classList.add('is-hidden');
      launcher.setAttribute('aria-expanded', 'true');
      if (!log.childElementCount) {
        addBubble('bot', "Hi, I'm Victoria, your Rocket Club AI assistant. What's one thing you'd love to make easier in your business?");
      }
      input.focus();
    }

    function closePanel() {
      panel.hidden = true;
      panel.classList.remove('is-open');
      launcher.classList.remove('is-hidden');
      launcher.setAttribute('aria-expanded', 'false');
      launcher.focus();
    }

    launcher.addEventListener('click', () => {
      panel.classList.contains('is-open') ? closePanel() : openPanel();
    });
    closeBtn.addEventListener('click', closePanel);
    panel.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') { event.preventDefault(); closePanel(); }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = input.value.trim();
      if (!message || submitting) return;
      submitting = true;
      input.value = '';
      addBubble('user', message);

      const typingRow = addBubble('bot', 'Victoria is typing...');
      typingRow.querySelector('.rocket-widget-bubble').classList.add('rocket-widget-typing');
      input.disabled = true;
      sendBtn.disabled = true;
      form.setAttribute('aria-busy', 'true');
      setStatus('typing');

      const reply = await requestReply(message);
      typingRow.remove();
      addBubble('bot', reply.text);
      setStatus(navigator.onLine ? reply.state : 'offline');
      input.disabled = false;
      sendBtn.disabled = false;
      form.removeAttribute('aria-busy');
      submitting = false;
      if (!panel.hidden) input.focus();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
