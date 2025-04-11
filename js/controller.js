// js/controller.js
import { TimerModel, TaskModel, UserModel } from "./model.js";
import { TimerView, TaskView, UserView } from "./view.js";

/** Контролер для таймера та тасків */
export class AppController {
  constructor(timerModel, taskModel, timerView, taskView) {
    this.timerModel = timerModel;
    this.taskModel = taskModel;
    this.timerView = timerView;
    this.taskView = taskView;
    this.timerInterval = null;
    
    // Прив'язка методів
    this.onStartTimer = this.onStartTimer.bind(this);
    this.onResetTimer = this.onResetTimer.bind(this);
    this.onAddTask = this.onAddTask.bind(this);
    this.onTaskListClick = this.onTaskListClick.bind(this);
  }
  
  init() {
    // Початкове відображення
    if (this.timerView)
      this.timerView.render(this.timerModel.remaining, this.timerModel.sessionCounter);
    if (this.taskView)
      this.taskView.render(this.taskModel.tasks);
    
    // Прив'язка подій за ID
    const startBtn = document.getElementById("startTimerBtn");
    const resetBtn = document.getElementById("resetTimerBtn");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskInput = document.getElementById("taskInput");
    
    if (startBtn) startBtn.addEventListener("click", this.onStartTimer);
    if (resetBtn) resetBtn.addEventListener("click", this.onResetTimer);
    if (addTaskBtn) addTaskBtn.addEventListener("click", this.onAddTask);
    if (taskInput) {
      taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.onAddTask();
      });
    }
    
    const taskListEl = document.getElementById("taskList");
    if (taskListEl) taskListEl.addEventListener("click", this.onTaskListClick);
  }
  
  onStartTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.timerModel.decrement()) {
        this.timerView.render(this.timerModel.remaining, this.timerModel.sessionCounter);
      } else {
        clearInterval(this.timerInterval);
        this.timerView.showAlert("Time's up! Take a break.");
        this.timerModel.incrementSession();
        this.timerModel.reset();
        this.timerView.render(this.timerModel.remaining, this.timerModel.sessionCounter);
      }
    }, 1000);
  }
  
  onResetTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerModel.reset();
    this.timerView.render(this.timerModel.remaining, this.timerModel.sessionCounter);
  }
  
  onAddTask() {
    const taskInput = document.getElementById("taskInput");
    const text = taskInput.value.trim();
    if (text) {
      this.taskModel.addTask(text);
      taskInput.value = "";
      this.taskView.render(this.taskModel.tasks);
    }
  }
  
  onTaskListClick(e) {
    const index = e.target.dataset.index;
    if (e.target.textContent === "Edit") {
      const newTask = prompt("Edit your task:", this.taskModel.tasks[index]);
      if (newTask !== null && newTask.trim() !== "") {
        this.taskModel.editTask(index, newTask.trim());
        this.taskView.render(this.taskModel.tasks);
      }
    }
    if (e.target.textContent === "Delete") {
      this.taskModel.removeTask(index);
      this.taskView.render(this.taskModel.tasks);
    }
  }
}

/** Контролер для авторизації користувача */
export function initUserAuth() {
  // Реєстрація
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    const signupMessage = document.getElementById("signupMessage");
    const userModel = new UserModel();
    const userView = new UserView(signupForm, signupMessage);
    
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nickname = document.getElementById("nicknameInput")?.value.trim();
      const gender = document.querySelector('input[name="genderRadio"]:checked')?.value || "";
      const email = document.getElementById("emailInput")?.value.trim();
      const phone = document.getElementById("phoneInput")?.value.trim();
      const password = document.getElementById("passwordInput")?.value.trim();
      
      if (!nickname || !gender || !email || !phone || !password) {
        userView.showMessage("Please fill in all fields.", "danger");
        return;
      }
      userModel.register({ nickname, gender, email, phone, password });
      userView.showMessage("Registration successful! You can now sign in.", "success");
      signupForm.reset();
    });
  }
  
  // Вхід
  const signinForm = document.getElementById("signinForm");
  if (signinForm) {
    const signinMessage = document.getElementById("signinMessage");
    const userModel = new UserModel();
    const userView = new UserView(signinForm, signinMessage);
    
    signinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const loginValue = document.getElementById("loginInput")?.value.trim();
      const passwordValue = document.getElementById("passwordInput")?.value.trim();
      
      if (!loginValue || !passwordValue) {
        userView.showMessage("Please enter both login and password.", "danger");
        return;
      }
      if (userModel.login(loginValue, passwordValue)) {
        userView.showMessage("Login successful!", "success");
        setTimeout(() => {
          window.location.href = "profile.html";
        }, 1000);
      } else {
        userView.showMessage("Invalid credentials.", "danger");
      }
    });
  }
  
  // Сторінка профілю
  const profileContainer = document.getElementById("userProfile");
  if (profileContainer) {
    const userModel = new UserModel();
    if (!userModel.user) {
      profileContainer.innerHTML = `<div class
