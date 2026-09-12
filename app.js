/**
 * Forgetful Reminder - Application Entry Point
 * Bootstraps all subsystems on DOM ready.
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log(
    '%c🔔 Forgetful Reminder %cv1.0 %c- "Because remembering is overrated"',
    'background: #4f46e5; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
    'color: #818cf8; font-weight: bold;',
    'color: #64748b; font-style: italic;'
  );
  console.log('🤖 If you are reading this in DevTools, please remind us what our app was supposed to do.');

  // Initialize UI
  if (window.ui) {
    window.ui.init();
  }

  // Initialize Reminders background scheduler
  if (window.remindersManager) {
    window.remindersManager.init();
  }

  // Initialize Fake AI Assistant
  if (window.memoryAssistant) {
    window.memoryAssistant.init();
  }

  // Initialize Easter Eggs
  if (window.easterEggsManager) {
    window.easterEggsManager.init();
  }
});
