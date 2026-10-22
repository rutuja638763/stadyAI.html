
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const taskCount = document.getElementById("taskCount");
const completedCount = document.getElementById("completedCount");
const remainingCount = document.getElementById("remainingCount");
const progressText = document.getElementById("progressText");
const progressLabel = document.getElementById("progressLabel");
const progressFill = document.getElementById("progressFill");
const progressBar = document.getElementById("progressBar");

// Mobile sidebar
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

menuToggle.addEventListener("click", function () {
  const isOpen = sidebar.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close mobile sidebar after navigation
document.querySelectorAll(".nav-link-custom").forEach(function (link) {
  link.addEventListener("click", function () {
    sidebar.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Study planner
let tasks = [];
let nextTaskId = 1;

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = taskInput.value.trim();
  if (!name) return;

  tasks.push({
    id: nextTaskId++,
    name: name,
    completed: false
  });

  taskInput.value = "";
  renderTasks();
});

function renderTasks() {
  taskList.replaceChildren();

  if (tasks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";

    const icon = document.createElement("i");
    icon.className = "bi bi-journal-plus";

    const message = document.createElement("p");
    message.textContent = "No tasks yet. Add your first study task!";

    empty.append(icon, message);
    taskList.appendChild(empty);
  }

  tasks.forEach(function (task) {
    const item = document.createElement("li");
    item.className = "task-item";

    if (task.completed) {
      item.classList.add("done");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Complete " + task.name);

    checkbox.addEventListener("change", function () {
      task.completed = checkbox.checked;
      renderTasks();
    });

    const name = document.createElement("span");
    name.className = "task-name";
    name.textContent = task.name;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-task";
    remove.innerHTML = '<i class="bi bi-trash3"></i>';
    remove.setAttribute("aria-label", "Remove " + task.name);

    remove.addEventListener("click", function () {
      tasks = tasks.filter(function (entry) {
        return entry.id !== task.id;
      });

      renderTasks();
    });

    item.append(checkbox, name, remove);
    taskList.appendChild(item);
  });

  updateStats();
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(function (task) {
    return task.completed;
  }).length;

  const remaining = total - completed;
  const percent = total === 0
    ? 0
    : Math.round((completed / total) * 100);

  taskCount.textContent = total;
  completedCount.textContent = completed;
  remainingCount.textContent = remaining;
  progressText.textContent = percent + "%";
  progressLabel.textContent = percent + "%";

  progressFill.style.width = percent + "%";
  progressBar.setAttribute("aria-valuenow", String(percent));
}

// Demo chatbot — predefined responses only
const chatForm = document.getElementById("chatForm");
const question = document.getElementById("question");
const chatBox = document.getElementById("chatBox");

chatForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const message = question.value.trim();
  if (!message) return;

  addMessage("You", message, true);

  const text = message.toLowerCase();
  let answer;

  if (text.includes("html")) {
    answer = "HTML defines the structure of a webpage.";
  } else if (text.includes("bootstrap")) {
    answer = "Bootstrap provides reusable components and responsive grid classes.";
  } else if (text.includes("css")) {
    answer = "CSS controls the colors, layout, spacing and appearance of a webpage.";
  } else if (text.includes("javascript") || text.includes("js")) {
    answer = "JavaScript adds behavior, event handling and dynamic interactions.";
  } else {
    answer = "This is a demo assistant. Real AI integration is our next upgrade!";
  }

  addMessage("StudyAI", answer, false);
  question.value = "";
});

function addMessage(sender, message, isUser) {
  const wrapper = document.createElement("div");
  wrapper.className = "chat-message " +
    (isUser ? "user-message" : "bot-message");

  const title = document.createElement("strong");
  title.textContent = sender;

  const content = document.createElement("p");
  content.textContent = message;

  wrapper.append(title, content);
  chatBox.appendChild(wrapper);

  chatBox.scrollTop = chatBox.scrollHeight;
}

// Initial dashboard state
renderTasks();
