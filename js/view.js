// js/view.js

// Представлення таймера (Pomodoro)
export class TimerView {
  constructor(timerEl, sessionCounterEl) {
    this.timerEl = timerEl;
    this.sessionCounterEl = sessionCounterEl;
  }
  
  render(remaining, sessionCounter) {
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    if (this.timerEl)
      this.timerEl.textContent = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    if (this.sessionCounterEl)
      this.sessionCounterEl.textContent = "Completed sessions: " + sessionCounter;
  }
  
  showAlert(message) {
    alert(message);
  }
}

// Представлення списку завдань (To‑Do List)
export class TaskView {
  constructor(taskListEl) {
    this.taskListEl = taskListEl;
  }
  
  render(tasks) {
    if (!this.taskListEl) return;
    this.taskListEl.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.textContent = task;
      
      // Кнопка "Edit"
      const editBtn = document.createElement("button");
      editBtn.className = "btn btn-sm btn-outline-primary me-2";
      editBtn.textContent = "Edit";
      editBtn.dataset.index = index;
      
      // Кнопка "Delete"
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

// Представлення користувача (Sign In, Sign Up, Profile)
export class UserView {
  constructor(formElement, messageElement) {
    this.formElement = formElement;
    this.messageElement = messageElement;
  }
  
  showMessage(msg, type = "info") {
    if (!this.messageElement) return;
    this.messageElement.textContent = msg;
    this.messageElement.className = "alert alert-" + type;
  }
  
  clearMessage() {
    if (!this.messageElement) return;
    this.messageElement.textContent = "";
    this.messageElement.className = "";
  }
}
