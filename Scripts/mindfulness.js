const ring = document.getElementById('breathingRing');
const text = document.getElementById('breathingText');
let inhale = true;

function breathingCycle() {
    if (inhale) {
        ring.style.transform = "scale(1.5)";
        ring.style.borderColor = "#74c69d";
        text.textContent = "Inhale";
    } else {
        ring.style.transform = "scale(1)";
        ring.style.borderColor = "#2d6a4f";
        text.textContent = "Exhale";
    }
    inhale = !inhale;
}

setInterval(breathingCycle, 4000);

// Timer Tool
const startBtn = document.getElementById('startSession');
const sessionInput = document.getElementById('sessionTime');
const timerDisplay = document.getElementById('timerDisplay');
let timerInterval = null;

// Ambient Sound
const soundSelect = document.getElementById('soundSelect');
const soundBtn = document.getElementById('soundToggle');
let ambientSound = null;
let soundPlaying = false;

// Enable button when sound is selected
soundSelect.addEventListener('change', () => {
    if (ambientSound) {
        ambientSound.pause();
        soundPlaying = false;
        soundBtn.textContent = "Play Sound";
    }
    const file = soundSelect.value;
    if (file) {
        ambientSound = new Audio(file);
        ambientSound.loop = true;
        soundBtn.disabled = false;
    } else {
        soundBtn.disabled = true;
    }
});

// Play/Pause selected sound
soundBtn.addEventListener('click', () => {
    if (!ambientSound) return;

    if (!soundPlaying) {
        ambientSound.play();
        soundBtn.textContent = "Pause Sound";
    } else {
        ambientSound.pause();
        soundBtn.textContent = "Play Sound";
    }
    soundPlaying = !soundPlaying;
});

// Session Tracking
const sessionCountEl = document.getElementById('sessionCount');
let completedSessions = parseInt(localStorage.getItem('completedSessions')) || 0;
sessionCountEl.textContent = completedSessions;

startBtn.addEventListener('click', () => {
    let totalSeconds = parseInt(sessionInput.value) * 60;
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = "Session Complete!";
            completedSessions++;
            localStorage.setItem('completedSessions', completedSessions);
            sessionCountEl.textContent = completedSessions;
            if (soundPlaying) ambientSound.pause();
        }
        totalSeconds--;
    }, 1000);
});
