/**
 * Forgetful Reminder - Fake AI "Memory Assistant"
 * Looks like an advanced GPT-powered productivity assistant, but has zero memory retention.
 */

class MemoryAssistant {
  constructor() {
    this.history = [
      {
        sender: 'assistant',
        text: 'Hello! I am Memory Assistant v4.2, powered by Advanced Neural Recall™. How can I help you manage your reminders today?'
      }
    ];
    this.isTyping = false;
    this.interactionCount = 0;
  }

  init() {
    this.chatContainer = document.getElementById('assistantChat');
    this.input = document.getElementById('assistantInput');
    this.sendBtn = document.getElementById('assistantSendBtn');
    this.panel = document.getElementById('assistantPanel');

    if (this.sendBtn && this.input) {
      this.sendBtn.addEventListener('click', () => this.handleUserSubmit());
      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.handleUserSubmit();
      });
    }

    // Quick prompt buttons
    document.querySelectorAll('.quick-prompt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const prompt = btn.getAttribute('data-prompt');
        if (prompt && !this.isTyping) {
          this.sendMessage(prompt);
        }
      });
    });

    this.render();
  }

  handleUserSubmit() {
    const text = this.input.value.trim();
    if (!text || this.isTyping) return;
    this.input.value = '';
    this.sendMessage(text);
  }

  sendMessage(text) {
    this.history.push({ sender: 'user', text });
    this.render();
    this.generateResponse(text);
  }

  generateResponse(userText) {
    this.isTyping = true;
    this.render();

    const lower = userText.toLowerCase();
    this.interactionCount++;

    // Pacing: simulate neural thinking
    setTimeout(() => {
      let reply = '';
      const totalReminders = window.appState ? window.appState.reminders.length : 3;

      if (lower.includes('what do i have') || lower.includes('today') || lower.includes('schedule')) {
        reply = `According to my quantum memory cache, you have ${totalReminders} reminders scheduled today. I have securely stored all of them in memory. (I think).`;
      } else if (lower.includes('important task') || lower.includes('remind me')) {
        reply = 'I am sry beb... You really expected ME to remind you? 😭💀';
        itemImage = 'assets/remind_me_meme.jpg';
        if (window.soundEngine && window.soundEngine.playSryBeb) {
          window.soundEngine.playSryBeb();
        }
      } else if (lower.includes('what') && this.history.some(m => m.text.includes('critical to do right now'))) {
        reply = '…\n\nI have no idea. 😭';
      } else if (lower.includes('help me remember') || lower.includes('remember')) {
        reply = 'I am actively trying to remember with 100% CPU utilization… Wait, who asked this question?';
      } else if (lower.includes('who are you') || lower.includes('what are you')) {
        reply = 'I am your personal AI assistant! I specialize in productivity, scheduling, and… wait, what was the third thing?';
      } else if (lower.includes('meme') || lower.includes('forgor')) {
        reply = 'I forgor 💀. But in an enterprise-grade, venture-backed kind of way.';
      } else {
        const confusedReplies = [
          'That is a wonderful question. I was just pondering the answer when my memory buffer underwent spontaneous combustion.',
          'Understood. Storing this query in /dev/null for maximum security.',
          'Processing… Error 404: Concept not found in working memory.',
          'I know exactly what you mean. Or at least, I did when you started typing.',
          'Rest assured, your data is completely safe from hackers, because even I cannot find it.'
        ];
        reply = confusedReplies[Math.floor(Math.random() * confusedReplies.length)];
      }

      this.isTyping = false;
      this.history.push({ sender: 'assistant', text: reply, image: typeof itemImage !== 'undefined' ? itemImage : null });
      this.render();

      if (window.soundEngine) {
        window.soundEngine.playThinking();
      }
    }, 1200);
  }

  render() {
    if (!this.chatContainer) return;
    this.chatContainer.innerHTML = '';

    this.history.forEach(item => {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${item.sender}`;
      bubble.innerText = item.text;

      if (item.image) {
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = 'I am sry beb';
        img.style.width = '100%';
        img.style.maxWidth = '200px';
        img.style.borderRadius = '8px';
        img.style.marginTop = '8px';
        img.style.display = 'block';
        img.style.boxShadow = 'var(--shadow-md)';
        bubble.appendChild(img);
      }

      this.chatContainer.appendChild(bubble);
    });

    if (this.isTyping) {
      const typingEl = document.createElement('div');
      typingEl.className = 'typing-indicator';
      typingEl.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      `;
      this.chatContainer.appendChild(typingEl);
    }

    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
  }
}

// Export singleton
window.memoryAssistant = new MemoryAssistant();
