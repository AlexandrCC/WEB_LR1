// js/timer.js
let timer;
let timeLeft = 25 * 60; // 25 хвилин
let sessionCounter = localStorage.getItem("pomodoroSessions")
  ? parseInt(localStorage.getItem("pomodoroSessions"))
  : 0;

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerEl = document.getElementById('timer');
  if (timerEl) {
    timerEl.textContent = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }
}

function updateSessionDisplay() {
  const sessionEl = document.getElementById('sessionCounter');
  if (sessionEl) {
    sessionEl.textContent = "Completed sessions: " + sessionCounter;
  }
}

function startTimer() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimer();
    } else {
      clearInterval(timer);
      alert("Time's up! Take a break.");
      sessionCounter++;
      localStorage.setItem("pomodoroSessions", sessionCounter);
      updateSessionDisplay();
      resetTimer(); // автоматичне скидання для наступної сесії
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 25 * 60;
  updateTimer();
}

window.onload = function() {
  updateTimer();
  updateSessionDisplay();
};
