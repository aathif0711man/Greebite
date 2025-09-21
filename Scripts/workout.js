// DOM Elements
const workoutForm = document.getElementById('workoutForm');
const bodyPartSelect = document.getElementById('bodyPart');
const equipmentSelect = document.getElementById('equipment');
const workoutPlan = document.getElementById('workoutPlan');
const currentExercise = document.getElementById('currentExercise');
const countdown = document.getElementById('countdown');
const startTimer = document.getElementById('startTimer');

let workouts = {};
let selectedExercise = null;
let timerInterval = null;

// Load workouts JSON
function loadWorkouts() {
  fetch('./Greenbite/JSON/workout.json')
    .then(res => res.json())
    .then(data => (workouts = data))
    .catch(err => {
      console.error('Error loading workouts:', err);
      workoutPlan.innerHTML = '<p>Unable to load workouts.</p>';
    });
}

// Generate workout plan
function generateWorkout(e) {
  e.preventDefault();

  const bodyPart = bodyPartSelect.value;
  const equipment = equipmentSelect.value;

  if (!workouts[bodyPart] || !workouts[bodyPart][equipment]) {
    workoutPlan.innerHTML = '<p>No workouts available for this selection.</p>';
    return;
  }

  const exerciseList = workouts[bodyPart][equipment];

  workoutPlan.innerHTML = `
  <h3>Your Workout Plan</h3>
  <div id="exerciseList" class="exercise-grid">
    ${exerciseList.map(ex => `<div class="exercise-card">${ex}</div>`).join('')}
  </div>
  <p>Click an exercise to start</p>
`;

  // Attach click events
  document.querySelectorAll('.exercise-card').forEach(card => {
    card.addEventListener('click', () => {
      selectedExercise = card.textContent;
      currentExercise.textContent = selectedExercise;
      countdown.textContent = '30';
      startTimer.disabled = false; // enable start button
    });
  });

}

// Play beep sound
function playBeep() {
  const beep = new Audio('./Greenbite/audio/beep.mp3');
  beep.play();
}

// Start/Stop timer for selected exercise
function toggleTimer() {
  if (!selectedExercise) return;

  if (timerInterval) {
    // Stop timer
    clearInterval(timerInterval);
    timerInterval = null;
    startTimer.textContent = 'Start Timer';
    return;
  }

  let timeLeft = 30;
  countdown.textContent = timeLeft;
  startTimer.textContent = 'Stop Timer';

  timerInterval = setInterval(() => {
    timeLeft--;
    countdown.textContent = timeLeft;

    if (timeLeft <= 0) {
      playBeep();
      clearInterval(timerInterval);
      timerInterval = null;
      currentExercise.textContent = `${selectedExercise} Complete!`;
      countdown.textContent = '00';
      startTimer.textContent = 'Start Timer';
    }
  }, 1000);
}

// Event listeners
window.addEventListener('DOMContentLoaded', loadWorkouts);
workoutForm.addEventListener('submit', generateWorkout);
startTimer.addEventListener('click', toggleTimer);