// js/controller.js
import { TimerModel, TaskModel } from "./model.js";
import { TimerView, TaskView } from "./view.js";

export class AppController {
  constructor(timerModel, taskModel, timerView, taskView) {
    this.timerModel = timerModel;
    this.taskModel = taskModel;
    this.timerView = timerView;
    this.taskView = taskView;

    this.timer = null;
    this.decrementTime = this.decrementTime.bind(this);

    this.handleAddTask = this.handleAddTask.bind(this);
    this.handleEditTask = this.handleEditTask.bind(this);
    this.handleDeleteTask = this.handleDeleteTask.bind(this);

    this.onStart = this.onStart.bind(this);
    this.onReset = this.onReset.bind(this);
  }

  init() {
    // Render initial timer, sessions, tasks
    this.timerView.renderTimer(this.timerModel.remaining);
    this.timerView.renderSessions(this.timerModel.sessionCounter);
    this.taskView.render(this.taskModel.tasks);

    // Set up event listeners
    const btnStart = document.getElementById("startTimerBtn");
    const btnReset = document.getElementById("resetTimerBtn");
    const btnAddTask = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const taskInput = document.getElementById("taskInput");

    if (btnStart) btnStart.addEventListener("click", this.onStart);
    if (btnReset) btnReset.addEventListener("click", this.onReset);
    if (btnAddTask) btnAddTask.addEventListener("click", this.handleAddTask);

    // Listen for custom events from TaskView
    if (taskList) {
      taskList.addEventListener("editTask", this.handleEditTask);
      taskList.addEventListener("deleteTask", this.handleDeleteTask);
    }

    // Optionally handle "Enter" key for adding tasks
    if (taskInput) {
      taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.handleAddTask();
        }
      });
    }
  }

  decrementTime() {
    if (this.timerModel.decrement()) {
      this.timerView.renderTimer(this.timerModel.remaining);
    } else {
      clearInterval(this.timer);
      this.timerView.showAlert("Time's up! Take a break.");
      this.timerModel.incrementSession();
      this.timerModel.reset();
      this.timerView.renderTimer(this.timerModel.remaining);
      this.timerView.renderSessions(this.timerModel.sessionCounter);
    }
  }

  onStart() {
    clearInterval(this.timer);
    this.timer = setInterval(this.decrementTime, 1000);
  }

  onReset() {
    clearInterval(this.timer);
    this.timerModel.reset();
    this.timerView.renderTimer(this.timerModel.remaining);
  }

  handleAddTask() {
    const taskInput = document.getElementById("taskInput");
    if (!taskInput) return;
    const val = taskInput.value.trim();
    if (val) {
      this.taskModel.addTask(val);
      this.taskView.render(this.taskModel.tasks);
      taskInput.value = "";
    }
  }

  handleEditTask(e) {
    // e.detail.idx, e.detail.newText
    const idx = e.detail.idx;
    const newText = e.detail.newText;
    this.taskModel.editTask(idx, newText);
    this.taskView.render(this.taskModel.tasks);
  }

  handleDeleteTask(e) {
    const idx = e.detail.idx;
    this.taskModel.deleteTask(idx);
    this.taskView.render(this.taskModel.tasks);
  }
}
