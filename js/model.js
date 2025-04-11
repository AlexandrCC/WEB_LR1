// js/model.js

export class TimerModel {
  constructor() {
    this.duration = 25 * 60; // 25 minutes
    this.remaining = this.duration;
    this.sessionCounter = parseInt(localStorage.getItem("pomSessions")) || 0;
  }

  decrement() {
    if (this.remaining > 0) {
      this.remaining--;
      return true;
    }
    return false;
  }

  reset() {
    this.remaining = this.duration;
  }

  incrementSession() {
    this.sessionCounter++;
    localStorage.setItem("pomSessions", this.sessionCounter);
  }
}

export class TaskModel {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("pomTasks")) || [];
  }

  addTask(txt) {
    this.tasks.push(txt);
    this.save();
  }

  editTask(idx, newText) {
    this.tasks[idx] = newText;
    this.save();
  }

  deleteTask(idx) {
    this.tasks.splice(idx, 1);
    this.save();
  }

  save() {
    localStorage.setItem("pomTasks", JSON.stringify(this.tasks));
  }
}
