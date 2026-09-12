/**
 * Forgetful Reminder - Hackathon Presentation Mode & Final Screen
 * Optimized for stage demos with a 10-second countdown and instant trigger bypass.
 */

class DemoManager {
  constructor() {
    this.countdownTimer = null;
    this.secondsRemaining = 10;
  }

  startDemo() {
    // Clear any existing countdown
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }

    this.secondsRemaining = 10;
    const banner = document.getElementById('demoCountdownBanner');
    const countdownSpan = document.getElementById('demoCountdownNumber');

    if (!banner) return;

    banner.style.display = 'flex';
    countdownSpan.textContent = this.secondsRemaining;

    // Toast confirmation
    window.ui.showToast('🎤 Demo reminder scheduled for in 10 seconds!', 'success', 3000);
    if (window.soundEngine) window.soundEngine.playSuccessDing();

    // Create a special demo reminder
    const demoReminder = {
      id: 'demo-' + Date.now(),
      title: 'Present hackathon project to judges',
      emoji: '🏆',
      date: new Date().toISOString().split('T')[0],
      time: new Date(Date.now() + 10000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      repeat: 'Never',
      priority: 'high',
      notes: 'Super critical hackathon presentation. Do not forget!',
      status: 'pending',
      snoozeCount: 0,
      createdAt: Date.now()
    };

    window.appState.addReminder(demoReminder);

    this.countdownTimer = setInterval(() => {
      this.secondsRemaining--;
      if (countdownSpan) countdownSpan.textContent = this.secondsRemaining;

      if (this.secondsRemaining <= 0) {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
        banner.style.display = 'none';
        this.triggerDemoForgetting(demoReminder);
      }
    }, 1000);
  }

  triggerImmediately() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
    const banner = document.getElementById('demoCountdownBanner');
    if (banner) banner.style.display = 'none';

    const latestDemo = window.appState.reminders.find(r => r.id.startsWith('demo-')) || {
      id: 'demo-quick',
      title: 'Present hackathon project to judges',
      time: 'Now',
      priority: 'high'
    };

    this.triggerDemoForgetting(latestDemo);
  }

  triggerDemoForgetting(reminder) {
    // Open the forgetting modal
    window.forgettingEngine.triggerReminder(reminder);

    // Override the punchline on finish for hackathon presentation!
    const originalStart = window.forgettingEngine.startForgettingSequence.bind(window.forgettingEngine);
    window.forgettingEngine.startForgettingSequence = () => {
      originalStart();

      // After forgetting completes (~5 seconds), show the presentation punchline modal
      setTimeout(() => {
        this.showFinalPresentationScreen();
      }, 5500);
    };
  }

  showFinalPresentationScreen() {
    const modal = document.getElementById('finalPresentationModal');
    if (!modal) return;
    modal.classList.add('active');
    if (window.soundEngine) window.soundEngine.playCriticalFail();
  }

  closeFinalPresentationScreen() {
    const modal = document.getElementById('finalPresentationModal');
    if (modal) modal.classList.remove('active');
  }
}

// Export singleton
window.demoManager = new DemoManager();
