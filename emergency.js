/**
 * Forgetful Reminder - Emergency "Try To Remember" Engine
 * Runs a dramatic, over-the-top fake neural diagnostic scan that concludes with absolute anticlimax.
 */

class EmergencyEngine {
  constructor() {
    this.isScanning = false;
  }

  startEmergencyRecovery() {
    if (this.isScanning) return;
    this.isScanning = true;

    const modal = document.getElementById('emergencyModal');
    const progressBar = document.getElementById('emergencyProgressBar');
    const stageText = document.getElementById('emergencyStageText');
    const percentText = document.getElementById('emergencyPercentText');
    const resultBox = document.getElementById('emergencyResultBox');
    const footer = document.getElementById('emergencyFooter');

    if (!modal) return;

    modal.classList.add('active');
    resultBox.style.display = 'none';
    footer.style.display = 'none';
    progressBar.style.width = '0%';
    percentText.textContent = '0%';
    stageText.textContent = 'Initializing deep quantum neural scan…';

    const stages = [
      { pct: 12, label: 'Scanning brain synapses…', delay: 800 },
      { pct: 34, label: 'Searching childhood memories…', delay: 1100 },
      { pct: 67, label: 'Searching recently deleted memories…', delay: 1300 },
      { pct: 92, label: 'Asking the neural network…', delay: 1100 },
      { pct: 100, label: 'Almost there… Finalizing recall…', delay: 900 }
    ];

    let currentStep = 0;

    const advanceStep = () => {
      if (currentStep < stages.length) {
        const step = stages[currentStep];
        progressBar.style.width = step.pct + '%';
        percentText.textContent = step.pct + '%';
        stageText.textContent = step.label;

        if (window.soundEngine) {
          window.soundEngine.playThinking();
        }

        currentStep++;
        setTimeout(advanceStep, step.delay);
      } else {
        // Scan reached 100%!
        stageText.innerHTML = '<strong style="color: var(--success);">Memory recovered!</strong>';
        if (window.soundEngine) {
          window.soundEngine.playSuccessDing();
        }

        // Dramatic pause
        setTimeout(() => {
          if (window.soundEngine) {
            window.soundEngine.playForgetting();
          }

          resultBox.style.display = 'block';
          resultBox.innerHTML = `
            <div style="font-size: 2.25rem; margin-bottom: 0.5rem;">💀</div>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem;">
              You were supposed to do something.
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              Confidence Level: 100% certainty that a task once existed.
            </p>
          `;

          footer.style.display = 'flex';
          this.isScanning = false;
        }, 1400);
      }
    };

    setTimeout(advanceStep, 400);
  }

  closeModal() {
    const modal = document.getElementById('emergencyModal');
    if (modal) {
      modal.classList.remove('active');
    }
    this.isScanning = false;
  }
}

// Export singleton
window.emergencyEngine = new EmergencyEngine();
