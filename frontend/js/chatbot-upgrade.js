(function () {
  'use strict';

  const popup    = document.getElementById('chatbot-popup');
  const messages = document.querySelector('.chatbot-messages');
  const inputEl  = document.querySelector('.chatbot-input');
  const sendBtn  = document.querySelector('.chatbot-send');

  if (!popup || !messages) return;

  let isFullscreen = false;

  /* ── Button wiring ── */
  document.getElementById('cb-expand-btn')?.addEventListener('click', toggleFullscreen);

  document.getElementById('cb-close-btn')?.addEventListener('click', () => {
    popup.classList.remove('open');
    if (isFullscreen) exitFullscreen();
  });

  /* ── Send events ── */
  if (sendBtn && inputEl) {
    const fresh = sendBtn.cloneNode(true);
    sendBtn.parentNode.replaceChild(fresh, sendBtn);
    fresh.addEventListener('click', handleSend);

    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });
  }

  /* ── Fullscreen ── */
  function toggleFullscreen() {
    isFullscreen ? exitFullscreen() : enterFullscreen();
  }

  function enterFullscreen() {
    isFullscreen = true;
    popup.classList.add('cb-fullscreen');
  }

  function exitFullscreen() {
    isFullscreen = false;
    popup.classList.remove('cb-fullscreen');
  }

  /* ── Helpers ── */
  function scrollToBottom() {
    requestAnimationFrame(() => {
      messages.scrollTop = messages.scrollHeight;
    });
  }

  function showTyping() {
    document.getElementById('cb-typing')?.classList.add('show');
  }

  function hideTyping() {
    document.getElementById('cb-typing')?.classList.remove('show');
  }

  function addBubble(text, type) {
    const wrap = document.createElement('div');
    wrap.className = `message-bubble ${type}`;

    const bubble = document.createElement('div');
    bubble.className = 'message-text';
    bubble.textContent = text;

    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    wrap.appendChild(bubble);
    wrap.appendChild(time);

    messages.appendChild(wrap);
    scrollToBottom();
  }

  /* ── MAIN SEND FUNCTION ── */
  async function handleSend() {
    const text = inputEl?.value.trim();
    if (!text) return;

    addBubble(text, 'sent');
    inputEl.value = '';
    showTyping();

    try {
      // Determine API base URL based on environment
      const API_BASE = window.location.hostname === 'localhost' ||
                       window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8002'
        : 'https://back2roots-uews.onrender.com';

      const token   = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/ai/chatbot`, {
        method:  'POST',
        headers: headers,
        body:    JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Server error ${res.status}`);
      }

      const data = await res.json();
      console.log('[chatbot-upgrade] response:', data);

      hideTyping();

      // Backend returns { response: "...", suggestions: [] }
      addBubble(
        data.response || data.reply || data.message || "I couldn't understand that.",
        'received'
      );

    } catch (err) {
      console.error('[chatbot-upgrade] ERROR:', err);
      hideTyping();
      addBubble('⚠️ Connection issue. Please try again.', 'received');
    }
  }

})();