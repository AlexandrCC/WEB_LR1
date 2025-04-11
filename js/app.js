// js/app.js

/********** TIMER & TASKS MVC **********/

// --- Model for Timer ---
class TimerModel {
  constructor() {
    this.duration = 25 * 60;            // 25 minutes
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

// --- Model for Tasks ---
class TaskModel {
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

// --- View for Timer ---
class TimerView {
  constructor(timerEl, sessionCounterEl) {
    this.timerEl = timerEl;
    this.sessionCounterEl = sessionCounterEl;
  }
  
  render(remaining, sessionCounter) {
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    this.timerEl.textContent = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    if (this.sessionCounterEl) {
      this.sessionCounterEl.textContent = "Completed sessions: " + sessionCounter;
    }
  }
  
  showAlert(message) {
    alert(message);
  }
}

// --- View for Tasks ---
class TaskView {
  constructor(taskListEl) {
    this.taskListEl = taskListEl;
  }
  
  render(tasks) {
    this.taskListEl.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.textContent = task;
      
      // Create Edit button
      const editBtn = document.createElement("button");
      editBtn.className = "btn btn-sm btn-outline-primary me-2";
      editBtn.textContent = "Edit";
      editBtn.dataset.index = index;
      
      // Create Delete button
      const delBtn = document.createElement("button");
      delBtn.className = "btn btn-sm btn-outline-danger";
      delBtn.textContent = "Delete";
      delBtn.dataset.index = index;
      
      const btnDiv = document.createElement("div");
      btnDiv.appendChild(editBtn);
      btnDiv.appendChild(delBtn);
      
      li.appendChild(btnDiv);
      this.taskListEl.appendChild(li);
    });
  }
}

// --- Controller for Timer & Tasks ---
class AppController {
  constructor(timerModel, taskModel, timerView, taskView) {
    this.timerModel = timerModel;
    this.taskModel = taskModel;
    this.timerView = timerView;
    this.taskView = taskView;
    this.timerInterval = null;
    
    // Bind event handlers
    this.onStartTimer = this.onStartTimer.bind(this);
    this.onResetTimer = this.onResetTimer.bind(this);
    this.onAddTask = this.onAddTask.bind(this);
    this.onTaskListClick = this.onTaskListClick.bind(this);
  }
  
  init() {
    // Initial render if elements exist
    if (this.timerView) {
      this.timerView.render(this.timerModel.remaining, this.timerModel.sessionCounter);
    }
    if (this.taskView) {
      this.taskView.render(this.taskModel.tasks);
    }
    
    // Timer buttons
    const startBtn = document.querySelector(".btn.btn-success");
    const resetBtn = document.querySelector(".btn.btn-warning");
    if (startBtn) startBtn.addEventListener("click", this.onStartTimer);
    if (resetBtn) resetBtn.addEventListener("click", this.onResetTimer);
    
    // Add Task button
    const addTaskBtn = document.querySelector(".btn.btn-outline-secondary");
    const taskInput = document.getElementById("taskInput");
    if (addTaskBtn) addTaskBtn.addEventListener("click", this.onAddTask);
    if (taskInput) {
      taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.onAddTask();
        }
      });
    }
    
    // Task List events (edit, delete)
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
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
      this.taskModel.addTask(taskText);
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

/********** USER AUTHENTICATION (for Signup, Signin, Profile) **********/

// --- Model for User ---
class UserModel {
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

// --- View for User ---
class UserView {
  constructor(formElement, messageElement) {
    this.formElement = formElement;
    this.messageElement = messageElement;
  }
  
  showMessage(message, type = "info") {
    this.messageElement.textContent = message;
    this.messageElement.className = "alert alert-" + type;
  }
  
  clearMessage() {
    this.messageElement.textContent = "";
    this.messageElement.className = "";
  }
}

// --- Controller for User Authentication ---
function initUserAuth() {
  // Sign Up Form
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    const signupMessage = document.getElementById("signupMessage");
    const userModel = new UserModel();
    const userView = new UserView(signupForm, signupMessage);
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nickname = document.getElementById("nicknameInput").value.trim();
      const gender = document.querySelector('input[name="genderRadio"]:checked')?.value || "";
      const email = document.getElementById("emailInput").value.trim();
      const phone = document.getElementById("phoneInput").value.trim();
      const password = document.getElementById("passwordInput").value.trim();
      if (!nickname || !gender || !email || !phone || !password) {
         userView.showMessage("Please fill in all fields", "danger");
         return;
      }
      const userData = { nickname, gender, email, phone, password };
      userModel.register(userData);
      userView.showMessage("Registration successful! You can now sign in.", "success");
      signupForm.reset();
    });
  }
  
  // Sign In Form
  const signinForm = document.getElementById("signinForm");
  if (signinForm) {
    const signinMessage = document.getElementById("signinMessage");
    const userModel = new UserModel();
    const userView = new UserView(signinForm, signinMessage);
    signinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const loginValue = document.getElementById("loginInput").value.trim();
      const passwordValue = document.getElementById("passwordInput").value.trim();
      if (!loginValue || !passwordValue) {
         userView.showMessage("Please enter both login and password", "danger");
         return;
      }
      // Here we assume the login field holds the email
      if (userModel.login(loginValue, passwordValue)) {
         userView.showMessage("Login successful!", "success");
         setTimeout(() => {
           window.location.href = "profile.html";
         }, 1000);
      } else {
         userView.showMessage("Invalid credentials", "danger");
      }
    });
  }
  
  // Profile Page: Display user data and allow logout.
  const profileContainer = document.getElementById("userProfile");
  if (profileContainer) {
    const userModel = new UserModel();
    if (!userModel.user) {
      profileContainer.innerHTML = `<div class="alert alert-warning">Please sign in to view your profile.</div>`;
    } else {
      const { nickname, gender, email, phone } = userModel.user;
      profileContainer.innerHTML = `
        <h2>User Profile</h2>
        <table class="table table-bordered">
          <tr><th>Nickname</th><td>${nickname}</td></tr>
          <tr><th>Gender</th><td>${gender}</td></tr>
          <tr><th>Email</th><td>${email}</td></tr>
          <tr><th>Phone</th><td>${phone}</td></tr>
        </table>
        <button id="logoutBtn" class="btn btn-danger">Logout</button>
      `;
      document.getElementById("logoutBtn").addEventListener("click", () => {
        userModel.logout();
        window.location.reload();
      });
    }
  }
}

/********** INITIALIZATION **********/

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Timer & Task MVC if timer page elements exist
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
  
  // Initialize user authentication on pages that have related elements
  initUserAuth();
});
