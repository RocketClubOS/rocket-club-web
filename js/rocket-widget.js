(() => {
  // Same-origin relative path — works because Node-RED serves this cloned
  // site itself (httpStatic) alongside its own /test-reply flow endpoint.
  const ENDPOINT = '/test-reply';
  const STORAGE_KEY = 'rocket_widget_user_id';

  function getUserId() {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = 'web_' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  }

  function linkify(text) {
    const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return escaped.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
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
      launcher.setAttribute('aria-expanded', 'true');
      if (!log.childElementCount) {
        addBubble('bot', "Hey, I'm Rocket. \u{1F680} Tell me what's slowing your business down, and I'll point you toward the AI agent that actually fixes it.");
      }
      input.focus();
    }

    function closePanel() {
      panel.classList.remove('is-open');
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

      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, user_id: getUserId() }),
        });
        const data = await res.json();
        typingRow.remove();
        addBubble('bot', data.reply || "Sorry, I didn't catch that — try again?");
      } catch (err) {
        typingRow.remove();
        addBubble('bot', 'Connection hiccup — try again in a moment.');
      } finally {
        input.disabled = false;
        input.focus();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
