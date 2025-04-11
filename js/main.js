// js/main.js
import { TimerModel, TaskModel } from "./model.js";
import { TimerView, TaskView } from "./view.js";
import { AppController, initUserAuth } from "./controller.js";

// Основна ініціалізація при завантаженні DOM
document.addEventListener("DOMContentLoaded", () => {
  // Якщо на сторінці є елементи для таймера і завдань
  const timerEl = document.getElementById("timer");
  const sessionCounterEl = document.getElementById("sessionCounter");
  const taskListEl = document.getElementById("taskList");
  
  if (timerEl && sessionCounterEl && taskListEl) {
    const timerModel = new TimerModel();
    const taskModel = new TaskModel();
    const timerView = new TimerView(timerEl, sessionCounterEl);
    const taskView = new TaskView(taskListEl);
    
    const appController = new AppController(timerModel, taskModel, timerView, taskView);
    appController.init();
  }
  
  // Ініціалізація авторизації, якщо присутні відповідні елементи
  initUserAuth();
});
