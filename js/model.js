// js/model.js

// Модель таймера (Pomodoro)
export class TimerModel {
  constructor() {
    this.duration = 25 * 60; // 25 хвилин
    this.remaining = this.duration;
    this.sessionCounter = parseInt(localStorage.getItem("pomodoroSessions")) || 0;
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
    localStorage.setItem("pomodoroSessions", this.sessionCounter);
  }
}

// Модель завдань (To‑Do List)
export class TaskModel {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  }
  
  addTask(task) {
    this.tasks.push(task);
    this.save();
  }
  
  editTask(index, newTask) {
    if (index >= 0 && index < this.tasks.length) {
      this.tasks[index] = newTask;
      this.save();
    }
  }
  
  removeTask(index) {
    if (index >= 0 && index < this.tasks.length) {
      this.tasks.splice(index, 1);
      this.save();
    }
  }
  
  save() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }
}

// Модель користувача (авторизація)
export class UserModel {
  constructor() {
    this.user = JSON.parse(localStorage.getItem("user")) || null;
  }
  
  register(userData) {
    localStorage.setItem("user", JSON.stringify(userData));
    this.user = userData;
  }
  
  login(email, password) {
    if (this.user && this.user.email === email && this.user.password === password) {
      return true;
    }
    return false;
  }
  
  logout() {
    localStorage.removeItem("user");
    this.user = null;
  }
}
