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
  const ERROR_REPLY = "Sorry, I can't reach my brain right now. You can reach the team from the Contact page in the meantime.";

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
      if (res.status === 429) return RATE_LIMIT_REPLY;
      const data = await res.json().catch(() => null);
      return res.ok && data && data.reply ? data.reply : ERROR_REPLY;
    } catch (err) {
      return ERROR_REPLY;
    } finally {
      clearTimeout(timer);
    }
  }

  function build() {
    const launcher = document.createElement('button');
    launcher.type = 'button';
    launcher.className = 'rocket-widget-launcher';
    launcher.setAttribute('aria-label', 'Chat with Rocket, the Rocket Club AI consultant');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.innerHTML = '<span class="rocket-badge">AI</span>';

    const panel = document.createElement('div');
    panel.className = 'rocket-widget-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Chat with Rocket');
    panel.innerHTML = `
      <div class="rocket-widget-header">
        <div class="rocket-widget-avatar" aria-hidden="true"></div>
        <div class="rocket-widget-title">
          <strong>Rocket</strong>
          <span>Rocket Club AI Consultant</span>
        </div>
        <button type="button" class="rocket-widget-close" aria-label="Close chat">&times;</button>
      </div>
      <div class="rocket-widget-log"></div>
      <form class="rocket-widget-form">
        <input type="text" class="rocket-widget-input" placeholder="Tell Rocket what you're working on..." autocomplete="off">
        <button type="submit" class="rocket-widget-send">Send</button>
      </form>
    `;

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    const log = panel.querySelector('.rocket-widget-log');
    const form = panel.querySelector('.rocket-widget-form');
    const input = panel.querySelector('.rocket-widget-input');
    const closeBtn = panel.querySelector('.rocket-widget-close');

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
      panel.classList.add('is-open');
      launcher.classList.add('is-hidden');
      launcher.setAttribute('aria-expanded', 'true');
      if (!log.childElementCount) {
        addBubble('bot', "Hey, I'm Rocket. \u{1F680} Tell me what's slowing your business down, and I'll point you toward the AI agent that actually fixes it.");
      }
      input.focus();
    }

    function closePanel() {
      panel.classList.remove('is-open');
      launcher.classList.remove('is-hidden');
      launcher.setAttribute('aria-expanded', 'false');
    }

    launcher.addEventListener('click', () => {
      panel.classList.contains('is-open') ? closePanel() : openPanel();
    });
    closeBtn.addEventListener('click', closePanel);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = input.value.trim();
      if (!message) return;
      input.value = '';
      addBubble('user', message);

      const typingRow = addBubble('bot', 'Rocket is typing...');
      typingRow.querySelector('.rocket-widget-bubble').classList.add('rocket-widget-typing');
      input.disabled = true;

      const reply = await requestReply(message);
      typingRow.remove();
      addBubble('bot', reply);
      input.disabled = false;
      input.focus();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
