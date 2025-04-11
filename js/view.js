// js/view.js

export class TimerView {
  constructor(timerEl, sessionEl) {
    this.timerEl = timerEl;
    this.sessionEl = sessionEl;
  }

  renderTimer(remaining) {
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    this.timerEl.textContent = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  renderSessions(count) {
    this.sessionEl.textContent = "Completed sessions: " + count;
  }

  showAlert(msg) {
    alert(msg);
  }
}

export class TaskView {
  constructor(listEl) {
    this.listEl = listEl;
  }

  render(tasks) {
    this.listEl.innerHTML = "";
    tasks.forEach((task, idx) => {
      const li = document.createElement("li");
      li.textContent = task;

      const btnDiv = document.createElement("div");

      const btnEdit = document.createElement("button");
      btnEdit.textContent = "Edit";
      btnEdit.style.marginRight = "6px";
      btnEdit.addEventListener("click", () => {
        const newText = prompt("Edit your task:", task);
        if (newText && newText.trim()) {
          // Pass control back to the controller (which we'll handle in controller)
          // Or we can do a simpler approach here if we have direct access to model
          // But let's do the simpler approach: We fire an event?
          // Instead, for minimal example, we directly modify tasks array
          // But let's keep it minimal and pass the event upwards.
          const evt = new CustomEvent("editTask", {
            bubbles: true,
            detail: { idx, newText: newText.trim() }
          });
          this.listEl.dispatchEvent(evt);
        }
      });

      const btnDel = document.createElement("button");
      btnDel.textContent = "Delete";
      btnDel.addEventListener("click", () => {
        const evt = new CustomEvent("deleteTask", {
          bubbles: true,
          detail: { idx }
        });
        this.listEl.dispatchEvent(evt);
      });

      btnDiv.appendChild(btnEdit);
      btnDiv.appendChild(btnDel);

      li.appendChild(btnDiv);
      this.listEl.appendChild(li);
    });
  }
}
