/**
 * Forgetful Reminder - State Management & Persistence
 */

const STORAGE_KEYS = {
  REMINDERS: 'forgetful_reminders_list',
  HISTORY: 'forgetful_reminders_history',
  NOTIFICATIONS: 'forgetful_notifications',
  SETTINGS: 'forgetful_settings',
  STATS: 'forgetful_stats',
  HEALTH: 'forgetful_memory_health'
};

// Default seed reminders (look 100% legitimate initially)
const DEFAULT_SEED_REMINDERS = [
  {
    id: 'seed-1',
    title: 'Study for exam',
    emoji: '🔔',
    date: new Date().toISOString().split('T')[0], // Today
    time: '14:30',
    repeat: 'Daily',
    priority: 'high',
    notes: 'Chapters 4-7 on Operating Systems. Do not get distracted.',
    status: 'pending',
    snoozeCount: 0,
    createdAt: Date.now() - 3600000 * 2
  },
  {
    id: 'seed-2',
    title: 'Buy groceries',
    emoji: '🛒',
    date: new Date().toISOString().split('T')[0], // Today
    time: '17:00',
    repeat: 'Weekly',
    priority: 'medium',
    notes: 'Milk, eggs, sourdough bread, coffee beans, and apples.',
    status: 'pending',
    snoozeCount: 0,
    createdAt: Date.now() - 3600000 * 5
  },
  {
    id: 'seed-3',
    title: 'Call Mom',
    emoji: '📞',
    date: new Date().toISOString().split('T')[0], // Today
    time: '19:15',
    repeat: 'Never',
    priority: 'high',
    notes: 'Ask about weekend dinner plans.',
    status: 'pending',
    snoozeCount: 0,
    createdAt: Date.now() - 3600000 * 8
  },
  {
    id: 'seed-4',
    title: 'Finish project',
    emoji: '💻',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    time: '11:00',
    repeat: 'Never',
    priority: 'high',
    notes: 'Review pull requests and push final build.',
    status: 'pending',
    snoozeCount: 0,
    createdAt: Date.now() - 86400000
  },
  {
    id: 'seed-5',
    title: 'Drink water',
    emoji: '💧',
    date: new Date().toISOString().split('T')[0], // Today
    time: '12:00',
    repeat: 'Daily',
    priority: 'low',
    notes: 'Stay hydrated! 8 glasses a day.',
    status: 'completed',
    snoozeCount: 0,
    createdAt: Date.now() - 3600000 * 12
  }
];

// Initial seed notifications in notification center
const DEFAULT_SEED_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'You have something to do.',
    time: '12:30 PM',
    status: 'Forgotten',
    read: false
  },
  {
    id: 'notif-2',
    title: 'You were supposed to remember something.',
    time: '2:15 PM',
    status: 'Forgotten',
    read: false
  },
  {
    id: 'notif-3',
    title: 'We both know you forgot.',
    time: 'Just now',
    status: 'Forgotten',
    read: false
  }
];

// Initial seed history for "Forgotten History" page
const DEFAULT_SEED_HISTORY = [
  {
    id: 'hist-1',
    title: '❓ Unknown task',
    originalHint: 'Something important',
    time: 'Yesterday — 4:30 PM',
    status: 'Forgotten',
    confidence: '0%'
  },
  {
    id: 'hist-2',
    title: '❓ Unknown task',
    originalHint: 'A critically urgent deadline',
    time: '2 days ago — 10:15 AM',
    status: 'Forgotten',
    confidence: '0%'
  },
  {
    id: 'hist-3',
    title: '❓ Unknown task',
    originalHint: 'Meeting with someone',
    time: 'Monday — 9:00 AM',
    status: 'Forgotten',
    confidence: '0%'
  }
];

class StateManager {
  constructor() {
    this.listeners = [];
    this.reminders = this.load(STORAGE_KEYS.REMINDERS, DEFAULT_SEED_REMINDERS);
    this.history = this.load(STORAGE_KEYS.HISTORY, DEFAULT_SEED_HISTORY);
    this.notifications = this.load(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_SEED_NOTIFICATIONS);
    this.health = this.load(STORAGE_KEYS.HEALTH, 100);
    this.settings = this.load(STORAGE_KEYS.SETTINGS, {
      soundEnabled: true,
      theme: 'light',
      memeMode: false,
      memoryStrength: 100,
      notificationStyle: 'standard',
      snoozeDuration: 5
    });
    this.stats = this.load(STORAGE_KEYS.STATS, {
      remindersCreated: 27,
      remindersCompleted: 3,
      remindersForgotten: 24,
      mostForgottenDay: 'Monday',
      mostCommonStatus: '“I forgot.”',
      productivityScore: 2
    });
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn(`Could not load ${key} from localStorage:`, e);
      return fallback;
    }
  }

  save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Could not save ${key} to localStorage:`, e);
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => {
      try { cb(this); } catch (e) { console.error('State subscriber error:', e); }
    });
  }

  // Reminders Management
  addReminder(reminder) {
    this.reminders.unshift(reminder);
    this.stats.remindersCreated++;
    this.save(STORAGE_KEYS.REMINDERS, this.reminders);
    this.save(STORAGE_KEYS.STATS, this.stats);
    this.notify();
    return reminder;
  }

  updateReminder(id, updates) {
    this.reminders = this.reminders.map(r => r.id === id ? { ...r, ...updates } : r);
    this.save(STORAGE_KEYS.REMINDERS, this.reminders);
    this.notify();
  }

  deleteReminder(id) {
    this.reminders = this.reminders.filter(r => r.id !== id);
    this.save(STORAGE_KEYS.REMINDERS, this.reminders);
    this.notify();
  }

  clearAllReminders() {
    this.reminders = [];
    this.save(STORAGE_KEYS.REMINDERS, this.reminders);
    this.notify();
  }

  // Memory Health Progression (100% -> 0%)
  decreaseMemoryHealth() {
    this.health = Math.max(0, this.health - 20);
    this.save(STORAGE_KEYS.HEALTH, this.health);
    
    // Play dramatic sound if hitting 0
    if (this.health === 0 && window.soundEngine) {
      window.soundEngine.playCriticalFail();
    }
    this.notify();
  }

  getMemoryHealthStatus() {
    if (this.health >= 100) return { score: 100, label: 'Excellent memory.', level: 'good' };
    if (this.health >= 80) return { score: 80, label: 'Slightly distracted.', level: 'good' };
    if (this.health >= 60) return { score: 60, label: 'I\'m getting concerned.', level: 'warning' };
    if (this.health >= 40) return { score: 40, label: 'Who am I?', level: 'warning' };
    if (this.health >= 20) return { score: 20, label: 'I should probably write things down.', level: 'danger' };
    return { score: 0, label: 'I have forgotten why I exist.', level: 'danger' };
  }

  // History Recording
  recordForgottenReminder(reminder) {
    const historyItem = {
      id: 'hist-' + Date.now(),
      title: '❓ Unknown task',
      originalHint: 'Something you needed to do',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' — Today',
      status: 'Forgotten',
      confidence: '0%'
    };
    this.history.unshift(historyItem);
    this.save(STORAGE_KEYS.HISTORY, this.history);

    // Update statistics
    this.stats.remindersForgotten++;
    this.save(STORAGE_KEYS.STATS, this.stats);

    // Add to Notification Center
    this.addNotification({
      id: 'notif-' + Date.now(),
      title: 'You have something to do.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Forgotten',
      read: false
    });

    this.decreaseMemoryHealth();
  }

  // Notifications
  addNotification(notif) {
    this.notifications.unshift(notif);
    this.save(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }

  markNotificationsRead() {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    this.save(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }

  clearNotifications() {
    this.notifications = [];
    this.save(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }

  // Settings
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.save(STORAGE_KEYS.SETTINGS, this.settings);
    if (window.soundEngine) {
      window.soundEngine.setMuted(!this.settings.soundEnabled);
    }
    this.notify();
  }

  // Reset to initial state
  resetAll() {
    localStorage.clear();
    this.reminders = [...DEFAULT_SEED_REMINDERS];
    this.history = [...DEFAULT_SEED_HISTORY];
    this.notifications = [...DEFAULT_SEED_NOTIFICATIONS];
    this.health = 100;
    this.settings = {
      soundEnabled: true,
      theme: 'light',
      memeMode: false,
      memoryStrength: 100,
      notificationStyle: 'standard',
      snoozeDuration: 5
    };
    this.stats = {
      remindersCreated: 27,
      remindersCompleted: 3,
      remindersForgotten: 24,
      mostForgottenDay: 'Monday',
      mostCommonStatus: '“I forgot.”',
      productivityScore: 2
    };
    this.save(STORAGE_KEYS.REMINDERS, this.reminders);
    this.save(STORAGE_KEYS.HISTORY, this.history);
    this.save(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.save(STORAGE_KEYS.HEALTH, this.health);
    this.save(STORAGE_KEYS.SETTINGS, this.settings);
    this.save(STORAGE_KEYS.STATS, this.stats);
    this.notify();
  }
}

// Export singleton
window.appState = new StateManager();
