/**
 * Forgetful Reminder - Reminder Management & Scheduling
 */

class RemindersManager {
  constructor() {
    this.checkInterval = null;
  }

  init() {
    this.startScheduleChecker();
  }

  startScheduleChecker() {
    // Check reminders every 10 seconds against the clock
    this.checkInterval = setInterval(() => {
      this.checkDueReminders();
    }, 10000);
  }

  checkDueReminders() {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMins = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${currentHours}:${currentMins}`;

    const dueReminder = window.appState.reminders.find(r => {
      return r.status === 'pending' && r.date === todayStr && r.time <= currentTimeStr;
    });

    if (dueReminder) {
      window.forgettingEngine.triggerReminder(dueReminder);
    }
  }

  /**
   * Create a new reminder from the form
   */
  createReminder(formData) {
    const newReminder = {
      id: 'rem-' + Date.now(),
      title: formData.title.trim() || 'Untitled Reminder',
      emoji: this.detectEmoji(formData.title),
      date: formData.date || new Date().toISOString().split('T')[0],
      time: formData.time || '12:00',
      repeat: formData.repeat || 'Never',
      priority: formData.priority || 'medium',
      notes: formData.notes ? formData.notes.trim() : '',
      status: 'pending',
      snoozeCount: 0,
      createdAt: Date.now()
    };

    window.appState.addReminder(newReminder);

    // Audio feedback: Success ding
    if (window.soundEngine) {
      window.soundEngine.playSuccessDing();
    }

    // Professional success toast
    window.ui.showToast('✓ Reminder created successfully.', 'success', 3000);

    // Check Easter Egg 4: Overload (>10 reminders)
    if (window.easterEggsManager) {
      window.easterEggsManager.checkReminderOverload();
    }

    return newReminder;
  }

  detectEmoji(title) {
    const lower = title.toLowerCase();
    if (lower.includes('study') || lower.includes('exam') || lower.includes('read')) return '📚';
    if (lower.includes('buy') || lower.includes('grocer') || lower.includes('shop')) return '🛒';
    if (lower.includes('call') || lower.includes('phone') || lower.includes('mom')) return '📞';
    if (lower.includes('project') || lower.includes('code') || lower.includes('work')) return '💻';
    if (lower.includes('water') || lower.includes('drink')) return '💧';
    if (lower.includes('gym') || lower.includes('workout')) return '🏋️';
    if (lower.includes('doctor') || lower.includes('pill') || lower.includes('med')) return '💊';
    return '🔔';
  }

  toggleComplete(id) {
    const reminder = window.appState.reminders.find(r => r.id === id);
    if (!reminder) return;

    const newStatus = reminder.status === 'completed' ? 'pending' : 'completed';
    window.appState.updateReminder(id, { status: newStatus });

    if (newStatus === 'completed') {
      window.appState.stats.remindersCompleted++;
      window.appState.save(STORAGE_KEYS.STATS, window.appState.stats);
      if (window.soundEngine) window.soundEngine.playSuccessDing();
      window.ui.showToast('✓ Completed! (Wait, how did you actually remember this?)', 'success');
    }
  }

  deleteReminder(id) {
    window.appState.deleteReminder(id);

    if (window.appState.reminders.length === 0) {
      if (window.easterEggsManager) {
        window.easterEggsManager.triggerEmptyAllEasterEgg();
      }
    } else {
      window.ui.showToast('Reminder removed.', 'warning');
    }
  }

  /**
   * Snooze feature logic
   */
  snoozeReminder(reminderId, minutes) {
    const reminder = window.appState.reminders.find(r => r.id === reminderId);
    if (!reminder) return;

    const newCount = (reminder.snoozeCount || 0) + 1;
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);

    const newTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newDate = now.toISOString().split('T')[0];

    window.appState.updateReminder(reminderId, {
      time: newTime,
      date: newDate,
      snoozeCount: newCount
    });

    // Requirement 17: Repeated snooze snark
    if (newCount >= 3) {
      window.ui.showToast(`You have snoozed this reminder ${newCount} times. At this point, I'm not sure who's reminding whom. 🥱`, 'warning', 4500);
    } else {
      window.ui.showToast(`Snoozed for ${minutes} minutes.`, 'info');
    }

    // Close modal
    window.ui.closeModal('snoozeModal');
    window.ui.closeModal('forgettingNotificationModal');
  }
}

// Export singleton
window.remindersManager = new RemindersManager();
