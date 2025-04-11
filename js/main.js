// js/main.js

import { TimerModel, TaskModel } from "./model.js";
import { TimerView, TaskView } from "./view.js";
import { AppController } from "./controller.js";

document.addEventListener("DOMContentLoaded", () => {
  // Check if we're on pomodoro.html
  const timerEl = document.getElementById("timer");
  const sessionEl = document.getElementById("sessionCounter");
  const taskListEl = document.getElementById("taskList");

  if (timerEl && sessionEl && taskListEl) {
    // We are on pomodoro.html
    const timerModel = new TimerModel();
    const taskModel = new TaskModel();

    const timerView = new TimerView(timerEl, sessionEl);
    const taskView = new TaskView(taskListEl);

    const controller = new AppController(timerModel, taskModel, timerView, taskView);
    controller.init();
  }
});
