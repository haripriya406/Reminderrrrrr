/**
 * Forgetful Reminder - User Interface Controller
 * Manages tabs, modals, theme toggles, notification drawer, and rendering.
 */

class UIController {
  constructor() {
    this.currentTab = 'today';
    this.activeSnoozeReminderId = null;
  }

  init() {
    this.bindNavigation();
    this.bindModals();
    this.bindHeaderControls();
    this.bindSettings();
    this.bindForms();
    this.applyTheme(window.appState.settings.theme);

    // Subscribe to state updates
    window.appState.subscribe(() => {
      this.render();
    });

    this.render();
  }

  /* -------------------------------------------------------------------------- */
  /* Navigation & Tabs                                                          */
  /* -------------------------------------------------------------------------- */
  bindNavigation() {
    // Desktop tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const tabKey = tab.getAttribute('data-tab');
        if (tabKey) this.switchTab(tabKey);
      });
    });

    // Mobile bottom nav
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tabKey = item.getAttribute('data-tab');
        if (tabKey) this.switchTab(tabKey);
      });
    });
  }

  switchTab(tabKey) {
    this.currentTab = tabKey;

    // Update desktop tabs
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-tab') === tabKey);
    });

    // Update mobile nav items
    document.querySelectorAll('.mobile-nav-item').forEach(m => {
      m.classList.toggle('active', m.getAttribute('data-tab') === tabKey);
    });

    // Update tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === `tab-${tabKey}`);
    });

    this.render();
  }

  /* -------------------------------------------------------------------------- */
  /* Modals & Dialogs                                                           */
  /* -------------------------------------------------------------------------- */
  bindModals() {
    // Open Create Modal
    const btnNew = document.getElementById('btnNewReminder');
    if (btnNew) {
      btnNew.addEventListener('click', () => this.openModal('createReminderModal'));
    }

    const btnNewHero = document.getElementById('btnNewReminderHero');
    if (btnNewHero) {
      btnNewHero.addEventListener('click', () => this.openModal('createReminderModal'));
    }

    // Close buttons on all modals
    document.querySelectorAll('.modal-close-btn, [data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });

    // Emergency button in hero/header
    const btnEmergency = document.getElementById('btnEmergencyHeader');
    if (btnEmergency) {
      btnEmergency.addEventListener('click', () => {
        window.emergencyEngine.startEmergencyRecovery();
      });
    }

    // Demo Mode buttons
    const btnDemoHeader = document.getElementById('btnDemoHeader');
    if (btnDemoHeader) {
      btnDemoHeader.addEventListener('click', () => window.demoManager.startDemo());
    }

    const btnDemoSettings = document.getElementById('btnDemoSettings');
    if (btnDemoSettings) {
      btnDemoSettings.addEventListener('click', () => window.demoManager.startDemo());
    }

    const btnTriggerNowDemo = document.getElementById('btnTriggerNowDemo');
    if (btnTriggerNowDemo) {
      btnTriggerNowDemo.addEventListener('click', () => window.demoManager.triggerImmediately());
    }

    const btnDismissFinal = document.getElementById('btnDismissFinal');
    if (btnDismissFinal) {
      btnDismissFinal.addEventListener('click', () => window.demoManager.closeFinalPresentationScreen());
    }

    const btnRunDemoAgain = document.getElementById('btnRunDemoAgain');
    if (btnRunDemoAgain) {
      btnRunDemoAgain.addEventListener('click', () => {
        window.demoManager.closeFinalPresentationScreen();
        window.demoManager.startDemo();
      });
    }

    // AI Assistant toggle button
    const btnToggleAssistant = document.getElementById('assistantToggleBtn');
    const panelAssistant = document.getElementById('assistantPanel');
    const btnCloseAssistant = document.getElementById('assistantCloseBtn');

    if (btnToggleAssistant && panelAssistant) {
      btnToggleAssistant.addEventListener('click', () => {
        panelAssistant.classList.toggle('active');
      });
    }

    if (btnCloseAssistant && panelAssistant) {
      btnCloseAssistant.addEventListener('click', () => {
        panelAssistant.classList.remove('active');
      });
    }
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      const video = modal.querySelector('video');
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  openSnoozeModal(reminder) {
    this.activeSnoozeReminderId = reminder ? reminder.id : null;
    this.closeModal('forgettingNotificationModal');
    this.openModal('snoozeModal');

    // Play "modi-ji-bhojyam.mp3" sound effect when remind me is triggered and image is shown
    if (window.soundEngine) {
      if (window.soundEngine.playModiJiBhojyam) {
        window.soundEngine.playModiJiBhojyam();
      } else if (window.soundEngine.playModiOhMyGod) {
        window.soundEngine.playModiOhMyGod();
      }
    }

    // Setup snooze option click handlers
    document.querySelectorAll('.snooze-option-btn').forEach(btn => {
      btn.onclick = () => {
        const mins = parseInt(btn.getAttribute('data-minutes'), 10) || 10;
        if (this.activeSnoozeReminderId && window.remindersManager) {
          window.remindersManager.snoozeReminder(this.activeSnoozeReminderId, mins);
        } else {
          this.closeModal('snoozeModal');
        }
      };
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Header Controls & Notification Center                                     */
  /* -------------------------------------------------------------------------- */
  bindHeaderControls() {
    // Sound mute toggle
    const btnSoundMute = document.getElementById('btnSoundToggle');
    if (btnSoundMute) {
      btnSoundMute.addEventListener('click', () => {
        const currentMuted = window.soundEngine.isMuted();
        window.soundEngine.setMuted(!currentMuted);
        window.appState.updateSettings({ soundEnabled: currentMuted });
        this.updateSoundIcon();
        this.showToast(currentMuted ? '🔊 Sound effects enabled' : '🔇 Sound effects muted', 'info');
      });
    }

    // Notification dropdown toggle
    const btnNotifCenter = document.getElementById('btnNotifCenter');
    const dropdownNotif = document.getElementById('notifDropdown');
    if (btnNotifCenter && dropdownNotif) {
      btnNotifCenter.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownNotif.classList.toggle('active');
        window.appState.markNotificationsRead();
      });

      document.addEventListener('click', (e) => {
        if (!dropdownNotif.contains(e.target) && e.target !== btnNotifCenter) {
          dropdownNotif.classList.remove('active');
        }
      });
    }

    // Clear notifications button
    const btnClearNotifs = document.getElementById('btnClearNotifs');
    if (btnClearNotifs) {
      btnClearNotifs.addEventListener('click', () => {
        window.appState.clearNotifications();
        this.showToast('Notifications cleared.', 'info');
      });
    }

    // Memory Health Pill in Header
    const healthPill = document.getElementById('memoryHealthPill');
    if (healthPill) {
      healthPill.addEventListener('click', () => {
        const h = window.appState.getMemoryHealthStatus();
        this.showToast(`🧠 Memory Health: ${h.score}% — "${h.label}"`, 'info', 4000);
      });
    }
  }

  updateSoundIcon() {
    const btn = document.getElementById('btnSoundToggle');
    if (!btn) return;
    const isMuted = window.soundEngine ? window.soundEngine.isMuted() : false;
    btn.innerHTML = isMuted
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
  }

  /* -------------------------------------------------------------------------- */
  /* Settings Page Controls                                                     */
  /* -------------------------------------------------------------------------- */
  bindSettings() {
    // Dark mode toggle
    const themeSwitch = document.getElementById('settingThemeSwitch');
    if (themeSwitch) {
      themeSwitch.checked = window.appState.settings.theme === 'dark';
      themeSwitch.addEventListener('change', (e) => {
        const theme = e.target.checked ? 'dark' : 'light';
        this.applyTheme(theme);
        window.appState.updateSettings({ theme });
      });
    }

    // Sound toggle in settings
    const soundSwitch = document.getElementById('settingSoundSwitch');
    if (soundSwitch) {
      soundSwitch.checked = window.appState.settings.soundEnabled;
      soundSwitch.addEventListener('change', (e) => {
        window.appState.updateSettings({ soundEnabled: e.target.checked });
        this.updateSoundIcon();
      });
    }

    // Meme mode toggle
    const memeSwitch = document.getElementById('settingMemeSwitch');
    if (memeSwitch) {
      memeSwitch.checked = window.appState.settings.memeMode;
      memeSwitch.addEventListener('change', (e) => {
        const isMeme = e.target.checked;
        window.appState.updateSettings({ memeMode: isMeme });
        this.showToast(isMeme ? '💀 Meme mode ON: Skill issue activated.' : 'Meme mode turned OFF.', 'warning');
      });
    }

    // Memory Strength Slider (Requirement 16)
    const strengthSlider = document.getElementById('settingMemoryStrength');
    const strengthFeedback = document.getElementById('memoryStrengthFeedback');
    if (strengthSlider && strengthFeedback) {
      strengthSlider.value = window.appState.settings.memoryStrength;
      strengthSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        window.appState.updateSettings({ memoryStrength: val });
        if (val === 100) {
          strengthFeedback.innerHTML = `<strong>Confidence: 100%</strong> <span style="color: var(--danger);">(Actual memory: 3% 😂)</span>`;
        } else if (val === 0) {
          strengthFeedback.innerHTML = `<strong>Confidence: 0%</strong> (Pure honesty)`;
        } else {
          strengthFeedback.innerHTML = `<strong>Confidence: ${val}%</strong> <span style="color: var(--text-muted);">(Will still forget anyway)</span>`;
        }
      });
    }

    // Reset All Data button
    const btnReset = document.getElementById('btnResetAllData');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset everything? The app might even forget you ever used it.')) {
          window.appState.resetAll();
          this.showToast('App state has been reset to factory amnesia.', 'success');
        }
      });
    }
  }

  applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  /* -------------------------------------------------------------------------- */
  /* Form Handling: Create Reminder                                            */
  /* -------------------------------------------------------------------------- */
  bindForms() {
    const form = document.getElementById('createReminderForm');
    if (!form) return;

    // Set default date to today
    const dateInput = document.getElementById('remDate');
    if (dateInput) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }

    // Priority option selectors
    let selectedPriority = 'medium';
    const priorityOptions = document.querySelectorAll('.priority-option');
    priorityOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        priorityOptions.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedPriority = opt.getAttribute('data-priority') || 'medium';
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const titleInput = document.getElementById('remTitle');
      const timeInput = document.getElementById('remTime');
      const repeatSelect = document.getElementById('remRepeat');
      const notesTextarea = document.getElementById('remNotes');

      const reminderData = {
        title: titleInput.value,
        date: dateInput.value,
        time: timeInput.value || '12:00',
        repeat: repeatSelect.value,
        priority: selectedPriority,
        notes: notesTextarea.value
      };

      window.remindersManager.createReminder(reminderData);

      // Reset form and close
      form.reset();
      dateInput.value = new Date().toISOString().split('T')[0];
      priorityOptions.forEach(o => o.classList.toggle('selected', o.getAttribute('data-priority') === 'medium'));
      this.closeModal('createReminderModal');
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Render Methods                                                             */
  /* -------------------------------------------------------------------------- */
  render() {
    this.renderHeaderHealth();
    this.renderNotifications();

    if (this.currentTab === 'today') {
      this.renderTodayView();
    } else if (this.currentTab === 'upcoming') {
      this.renderUpcomingView();
    } else if (this.currentTab === 'completed') {
      this.renderCompletedView();
    } else if (this.currentTab === 'history') {
      this.renderHistoryView();
    } else if (this.currentTab === 'stats') {
      this.renderStatsView();
    }
  }

  renderHeaderHealth() {
    const healthPill = document.getElementById('memoryHealthPill');
    const healthDot = document.getElementById('headerHealthDot');
    const healthText = document.getElementById('headerHealthText');

    if (!healthPill || !healthDot || !healthText) return;

    const health = window.appState.getMemoryHealthStatus();
    healthText.textContent = `${health.score}%`;
    healthDot.className = `health-dot ${health.level}`;
  }

  renderNotifications() {
    const badge = document.getElementById('notifBadge');
    const list = document.getElementById('notifDropdownList');

    if (!badge || !list) return;

    const unreadCount = window.appState.notifications.filter(n => !n.read).length;
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'flex' : 'none';

    if (window.appState.notifications.length === 0) {
      list.innerHTML = `
        <div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.8rem;">
          No notifications. All clear!
        </div>
      `;
      return;
    }

    list.innerHTML = window.appState.notifications.map(n => `
      <div class="notif-item">
        <div class="notif-item-title">🔔 ${n.title}</div>
        <div class="notif-item-meta">
          <span>${n.time}</span>
          <span style="color: var(--warning); font-weight: 600;">${n.status}</span>
        </div>
      </div>
    `).join('');
  }

  renderTodayView() {
    const container = document.getElementById('todayRemindersList');
    const bannerCount = document.getElementById('todayCountText');
    const bannerSummary = document.getElementById('todaySummaryText');

    if (!container) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayReminders = window.appState.reminders.filter(r => r.date === todayStr && r.status !== 'completed');

    if (bannerCount) bannerCount.textContent = `${todayReminders.length} reminders scheduled`;
    if (bannerSummary) bannerSummary.textContent = `You have ${todayReminders.length} things planned today.`;

    if (todayReminders.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h3 class="empty-state-title">All tasks completed (or forgotten)</h3>
          <p class="empty-state-desc">You have nothing planned for today. Enjoy the blissful peace of amnesia.</p>
          <button class="btn btn-primary btn-sm" id="btnEmptyCreate">
            + Create Reminder
          </button>
        </div>
      `;
      const emptyBtn = document.getElementById('btnEmptyCreate');
      if (emptyBtn) emptyBtn.addEventListener('click', () => this.openModal('createReminderModal'));
      return;
    }

    container.innerHTML = todayReminders.map(r => this.createReminderCardHTML(r)).join('');
    this.bindCardEvents(container);
  }

  renderUpcomingView() {
    const container = document.getElementById('upcomingRemindersList');
    if (!container) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const upcoming = window.appState.reminders.filter(r => r.date > todayStr && r.status !== 'completed');

    if (upcoming.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <h3 class="empty-state-title">No upcoming reminders</h3>
          <p class="empty-state-desc">Future you has nothing to worry about. Yet.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = upcoming.map(r => this.createReminderCardHTML(r)).join('');
    this.bindCardEvents(container);
  }

  renderCompletedView() {
    const container = document.getElementById('completedRemindersList');
    if (!container) return;

    const completed = window.appState.reminders.filter(r => r.status === 'completed');

    if (completed.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
          </div>
          <h3 class="empty-state-title">No completed reminders</h3>
          <p class="empty-state-desc">It's hard to complete tasks when the app keeps forgetting what they are.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = completed.map(r => this.createReminderCardHTML(r)).join('');
    this.bindCardEvents(container);
  }

  renderHistoryView() {
    const container = document.getElementById('historyRemindersList');
    if (!container) return;

    const history = window.appState.history;

    if (history.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h3 class="empty-state-title">History is blank</h3>
          <p class="empty-state-desc">The app forgot that it had forgotten anything.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = history.map(item => `
      <div class="reminder-card forgotten">
        <div class="card-main">
          <div style="font-size: 1.4rem;">❓</div>
          <div class="reminder-info">
            <div class="reminder-title-row">
              <span class="reminder-title">🔔 Something to remember</span>
              <span class="priority-badge" style="background-color: var(--danger-bg); color: var(--danger);">
                Confidence: ${item.confidence}
              </span>
            </div>
            <div class="reminder-meta-row">
              <span class="meta-item">🕒 ${item.time}</span>
              <span class="meta-item" style="color: var(--warning);">Status: ${item.status}</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderStatsView() {
    const stats = window.appState.stats;

    const elCreated = document.getElementById('statCreated');
    const elCompleted = document.getElementById('statCompleted');
    const elForgotten = document.getElementById('statForgotten');
    const elRate = document.getElementById('statSuccessRate');
    const elDay = document.getElementById('statMostForgottenDay');
    const elStatus = document.getElementById('statMostCommonStatus');
    const elScore = document.getElementById('statProductivityScore');

    if (elCreated) elCreated.textContent = stats.remindersCreated;
    if (elCompleted) elCompleted.textContent = stats.remindersCompleted;
    if (elForgotten) elForgotten.textContent = stats.remindersForgotten;

    const total = stats.remindersCreated || 1;
    const rate = Math.round((stats.remindersCompleted / total) * 100);
    if (elRate) elRate.textContent = `${rate}%`;
    if (elDay) elDay.textContent = stats.mostForgottenDay;
    if (elStatus) elStatus.textContent = stats.mostCommonStatus;
    if (elScore) elScore.textContent = `${stats.productivityScore}/100`;
  }

  createReminderCardHTML(r) {
    const isCompleted = r.status === 'completed';
    const isForgotten = r.status === 'forgotten';
    const checkClass = isCompleted ? 'checked' : '';
    const scheduledStatus = isCompleted ? 'Completed' : (isForgotten ? 'Forgotten' : 'Scheduled');

    return `
      <div class="reminder-card ${isCompleted ? 'completed' : ''} ${isForgotten ? 'forgotten' : ''}" data-id="${r.id}">
        <div class="card-main">
          <div class="card-checkbox ${checkClass}" data-action="toggle">
            ${isCompleted ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
          </div>
          <div class="reminder-info">
            <div class="reminder-title-row">
              <span class="reminder-title">🔔 Something to remember</span>
              <span class="priority-badge ${r.priority}">${r.priority}</span>
            </div>
            <div class="reminder-meta-row">
              <span class="meta-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                ${r.time}
              </span>
              <span class="meta-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                ${r.date}
              </span>
              ${r.repeat !== 'Never' ? `<span class="meta-item">🔁 ${r.repeat}</span>` : ''}
              <span class="meta-item">Status: ${scheduledStatus}</span>
              ${r.notes ? `<span class="meta-item" title="Notes added">📝 Notes</span>` : ''}
            </div>
          </div>
        </div>
        <div class="card-actions">
          <button class="btn-trigger-now" data-action="trigger" title="Simulate time arrival and trigger reminder">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            Trigger Now
          </button>
          <button class="btn-icon btn-sm" data-action="delete" title="Delete reminder" style="color: var(--danger);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>
    `;
  }

  bindCardEvents(container) {
    container.querySelectorAll('.reminder-card').forEach(card => {
      const id = card.getAttribute('data-id');
      const reminder = window.appState.reminders.find(r => r.id === id);
      if (!reminder) return;

      // Toggle Complete
      const checkbox = card.querySelector('[data-action="toggle"]');
      if (checkbox) {
        checkbox.addEventListener('click', () => window.remindersManager.toggleComplete(id));
      }

      // Delete
      const btnDelete = card.querySelector('[data-action="delete"]');
      if (btnDelete) {
        btnDelete.addEventListener('click', () => window.remindersManager.deleteReminder(id));
      }

      // Trigger Now (Simulate reminder firing)
      const btnTrigger = card.querySelector('[data-action="trigger"]');
      if (btnTrigger) {
        btnTrigger.addEventListener('click', () => {
          window.forgettingEngine.triggerReminder(reminder);
        });
      }
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Toast Notification Center                                                  */
  /* -------------------------------------------------------------------------- */
  showToast(message, type = 'info', duration = 3200) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${message}</span>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (container.contains(toast)) container.removeChild(toast);
      }, 300);
    }, duration);
  }
}

// Export singleton
window.ui = new UIController();
