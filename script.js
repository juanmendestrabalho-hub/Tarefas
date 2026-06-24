

// ====== LOAD DATA ======
let data = JSON.parse(localStorage.getItem("tasks")) || {
  todo: [],
  doing: [],
  done: []
};

function save() {
  localStorage.setItem("tasks", JSON.stringify(data));
  render();
}

// ====== ADD TASK ======
function addTask() {
  const input = document.getElementById("taskInput");
  if (!input.value) return;

  data.todo.push({
    id: Date.now(),
    text: input.value
  });

  input.value = "";
  save();
}

// ====== DELETE TASK ======
function deleteTask(column, id) {
  data[column] = data[column].filter(t => t.id !== id);
  save();
}

// ====== DRAG & DROP ======
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.dataset.id);
  ev.dataTransfer.setData("from", ev.target.dataset.column);
}

function drop(ev) {
  ev.preventDefault();

  const id = Number(ev.dataTransfer.getData("text"));
  const from = ev.dataTransfer.getData("from");
  const to = ev.currentTarget.querySelector(".list").id;

  const task = data[from].find(t => t.id === id);
  data[from] = data[from].filter(t => t.id !== id);
  data[to].push(task);

  save();
}

// ====== RENDER ======
function render() {
  ["todo", "doing", "done"].forEach(col => {
    const container = document.getElementById(col);
    container.innerHTML = "";

    data[col].forEach(task => {
      const div = document.createElement("div");
      div.className = "task";
      div.draggable = true;
      div.dataset.id = task.id;
      div.dataset.column = col;

      div.ondragstart = drag;

      div.innerHTML = `
        ${task.text}
        <span class="delete" onclick="deleteTask('${col}', ${task.id})">✖</span>
      `;

      container.appendChild(div);
    });
  });
}

render();
