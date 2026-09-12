/**
 * Forgetful Reminder - The Forgetting Engine
 * Orchestrates the step-by-step psychological decline of the reminder.
 */

const STANDARD_FORGETTING_MESSAGES = [
  "I had one job.",
  "It was on the tip of my tongue.",
  "Wait… what were we talking about?",
  "My brain has left the chat.",
  "404: Reminder not found.",
  "I remember that I forgot something.",
  "It was important. Probably.",
  "Ask me tomorrow.",
  "I swear I knew this five seconds ago.",
  "The information has mysteriously disappeared.",
  "My memory needs a software update.",
  "I have absolutely no idea. 😭",
  "You trusted ME with this?",
  "This is awkward.",
  "I forgor 💀",
  "Task.exe has stopped responding.",
  "Memory unavailable. Please try again later."
];

const MEME_MODE_MESSAGES = [
  "I forgor 💀",
  "Bro really expected me to remember. 🤡",
  "Task successfully forgotten. 🧠❌",
  "Skill issue: Memory. 🗿",
  "The reminder has been reminded… that it forgot. 🫠",
  "Congratulations! You remembered something that I didn't. 💀",
  "Brain.exe has committed self-delete. 🫠",
  "My neural network is running on a potato. 🥔",
  "Memory: 0, Vibing: 100. 🗿"
];

class ForgettingEngine {
  constructor() {
    this.activeReminder = null;
    this.isForgettingInProgress = false;
  }

  getRandomMessage(customTitle = null) {
    const isMeme = window.appState && window.appState.settings.memeMode;
    
    // Check for title-specific easter egg messages
    if (customTitle) {
      const lower = customTitle.toLowerCase().trim();
      if (lower.includes("don't forget this") || lower.includes("dont forget this")) {
        return "You specifically told me not to forget this… Unfortunately… I forgot. 💀";
      }
      if (lower.includes("remember why you opened this app")) {
        return "You opened this app to… well… I forgot.";
      }
    }

    if (isMeme) {
      return MEME_MODE_MESSAGES[Math.floor(Math.random() * MEME_MODE_MESSAGES.length)];
    }
    return STANDARD_FORGETTING_MESSAGES[Math.floor(Math.random() * STANDARD_FORGETTING_MESSAGES.length)];
  }

  /**
   * Triggers the realistic reminder notification
   */
  triggerReminder(reminder) {
    this.activeReminder = reminder;
    this.isForgettingInProgress = false;

    const modal = document.getElementById('forgettingNotificationModal');
    const bellIcon = document.getElementById('notifBellIcon');
    const taskBox = document.getElementById('notifTaskBox');
    const taskText = document.getElementById('notifTaskText');
    const statusText = document.getElementById('notifStatusText');
    const actionsContainer = document.getElementById('notifActions');
    const dialog = modal.querySelector('.modal-dialog');

    if (!modal) return;

    // Reset styles and animations
    bellIcon.className = 'notif-bell-icon bell-ringing';
    dialog.classList.remove('shake-animation');
    taskText.classList.remove('blur-amnesia');
    taskBox.style.borderColor = 'var(--border-subtle)';

    // Play classic notification chime
    if (window.soundEngine) {
      window.soundEngine.playReminderChime();
    }

    // Step 1: Show authentic reminder popup
    taskText.textContent = "You have something to do.";
    statusText.textContent = "Scheduled for " + (reminder.time || 'now');

    // Initial action buttons: [Remind Me] and [What was it?]
    actionsContainer.innerHTML = `
      <button class="btn btn-secondary" id="btnRemindMeLater">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        Remind Me
      </button>
      <button class="btn btn-primary" id="btnWhatWasIt">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        What was it?
      </button>
    `;

    // Hook listeners
    document.getElementById('btnWhatWasIt').addEventListener('click', () => {
      this.startForgettingSequence();
    });

    document.getElementById('btnRemindMeLater').addEventListener('click', () => {
      window.ui.openSnoozeModal(reminder);
    });

    modal.classList.add('active');
  }

  /**
   * The 5-stage comedic amnesia animation sequence
   */
  startForgettingSequence() {
    if (this.isForgettingInProgress) return;
    this.isForgettingInProgress = true;

    const modal = document.getElementById('forgettingNotificationModal');
    const bellIcon = document.getElementById('notifBellIcon');
    const taskText = document.getElementById('notifTaskText');
    const statusText = document.getElementById('notifStatusText');
    const actionsContainer = document.getElementById('notifActions');
    const dialog = modal.querySelector('.modal-dialog');

    // Disable buttons during transition
    actionsContainer.innerHTML = `
      <button class="btn btn-secondary" disabled style="opacity: 0.7;">
        <span class="thinking-spinner"></span>
        Processing…
      </button>
    `;

    // Sound: Thinking hum
    if (window.soundEngine) {
      window.soundEngine.playThinking();
    }

    // Step 2: Blur the reminder text into oblivion
    taskText.classList.add('blur-amnesia');
    taskText.textContent = "Hmm…";
    statusText.textContent = "🧠 Remembering...";

    // Pacing: Stage 1 after 1500ms
    setTimeout(() => {
      if (!this.isForgettingInProgress) return;
      if (window.soundEngine) window.soundEngine.playThinking();

      taskText.textContent = "I know I was supposed to remind you about something…";
      statusText.innerHTML = `<span class="thinking-spinner"></span> 🔍 Searching memory...`;

      // Stage 2 after another 1800ms
      setTimeout(() => {
        if (!this.isForgettingInProgress) return;
        if (window.soundEngine) window.soundEngine.playThinking();

        taskText.textContent = "Searching neural synapses…";
        statusText.textContent = "❌ Memory not found.";

        // Stage 3: The punchline after 1500ms
        setTimeout(() => {
          if (!this.isForgettingInProgress) return;

          // Sound: Comedic failure / boing
          if (window.soundEngine) {
            window.soundEngine.playForgetting();
          }

          // Visuals: Sad bell droop & card shake
          bellIcon.className = 'notif-bell-icon bell-sad-droop';
          dialog.classList.add('shake-animation');

          const punchline = this.getRandomMessage(this.activeReminder ? this.activeReminder.title : null);
          
          taskText.classList.remove('blur-amnesia');
          taskText.style.color = 'var(--danger)';
          taskText.textContent = punchline;
          statusText.textContent = "Status: Completely Forgotten 😔";

          // Keep title in storage intact, update status
          if (this.activeReminder) {
            window.appState.recordForgottenReminder(this.activeReminder);
            window.appState.updateReminder(this.activeReminder.id, {
              status: 'forgotten'
            });
          }

          // Reveal hilarious final action buttons
          actionsContainer.innerHTML = `
            <button class="btn btn-secondary" id="btnDismissForgotten">
              😌 I forgive you
            </button>
            <button class="btn btn-emergency" id="btnEmergencyTriggerFromNotif">
              🚨 Try To Remember!
            </button>
          `;

          document.getElementById('btnDismissForgotten').addEventListener('click', () => {
            // Close the modal first, then launch the cat Easter egg surprise
            modal.classList.remove('active');
            this.isForgettingInProgress = false;
            // Small delay so the modal fully fades before the overlay appears
            setTimeout(() => {
              if (window.catAnimationEngine) {
                window.catAnimationEngine.trigger();
              }
            }, 350);
          });

          document.getElementById('btnEmergencyTriggerFromNotif').addEventListener('click', () => {
            modal.classList.remove('active');
            this.isForgettingInProgress = false;
            window.emergencyEngine.startEmergencyRecovery();
          });

        }, 1500);

      }, 1800);

    }, 1500);
  }
}

// Export singleton
window.forgettingEngine = new ForgettingEngine();
