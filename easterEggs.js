/**
 * Forgetful Reminder - Easter Eggs Handler
 * Manages secret interactions and punchlines hidden throughout the application.
 */

class EasterEggsManager {
  constructor() {
    this.bellClickCount = 0;
    this.bellClickTimeout = null;
  }

  init() {
    // Easter Egg 1: Click the brand bell logo 5 times
    const brandLogo = document.getElementById('brandLogo');
    if (brandLogo) {
      brandLogo.addEventListener('click', () => {
        this.bellClickCount++;
        clearTimeout(this.bellClickTimeout);

        if (this.bellClickCount >= 5) {
          this.triggerBellEasterEgg();
          this.bellClickCount = 0;
        } else {
          // Play quick subtle ding
          if (window.soundEngine) window.soundEngine.playThinking();
          this.bellClickTimeout = setTimeout(() => {
            this.bellClickCount = 0;
          }, 2000);
        }
      });
    }
  }

  /**
   * Easter Egg 1: 5 bell clicks
   */
  triggerBellEasterEgg() {
    if (window.soundEngine) window.soundEngine.playForgetting();

    window.ui.showToast('🔔 STOP PRESSING THE BELL.', 'danger', 2500);
    setTimeout(() => {
      window.ui.showToast('🧠 I\'m trying to remember.', 'warning', 3000);
    }, 2200);
  }

  /**
   * Easter Egg 4: Check if total reminders exceeds 10
   */
  checkReminderOverload() {
    if (window.appState && window.appState.reminders.length > 10) {
      setTimeout(() => {
        window.ui.showToast('⚠️ You\'re creating more reminders than I can remember.', 'warning', 4500);
      }, 800);
    }
  }

  /**
   * Easter Egg 5: When user deletes all reminders
   */
  triggerEmptyAllEasterEgg() {
    window.ui.showToast('✨ Finally. Nothing to forget.', 'success', 3000);

    setTimeout(() => {
      window.ui.showToast('👀 Wait…', 'warning', 2500);
      setTimeout(() => {
        window.ui.showToast('❓ Why did you open me?', 'danger', 4000);
        if (window.soundEngine) window.soundEngine.playForgetting();
      }, 2000);
    }, 3000);
  }
}

// Export singleton
window.easterEggsManager = new EasterEggsManager();
