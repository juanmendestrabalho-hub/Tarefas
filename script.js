
let data = JSON.parse(localStorage.getItem("tasks")) || {
  todo: [],
  doing: [],
  done: []
};

function save() {
  localStorage.setItem("tasks", JSON.stringify(data));
  render();
}

function addTask() {
  const input = document.getElementById("taskInput");
  if (!input.value.trim()) return;

  data.todo.push({
    id: Date.now(),
    text: input.value
  });

  input.value = "";
  save();
}

function deleteTask(column, id) {
  data[column] = data[column].filter(t => t.id !== id);
  save();
}

function render() {
  ["todo","doing","done"].forEach(col => {
    const el = document.getElementById(col);
    el.innerHTML = "";

    data[col].forEach(task => {
      const div = document.createElement("div");
      div.className = "task";
      div.draggable = true;

      div.ondragstart = e => {
        e.dataTransfer.setData("id", task.id);
        e.dataTransfer.setData("from", col);
      };

      div.innerHTML = `
        ${task.text}
        <span class="delete" onclick="deleteTask('${col}', ${task.id})">✖</span>
      `;

      el.appendChild(div);
    });
  });
}

function allowDrop(e){ e.preventDefault(); }

function drop(e){
  e.preventDefault();

  const id = Number(e.dataTransfer.getData("id"));
  const from = e.dataTransfer.getData("from");
  const to = e.currentTarget.querySelector(".list").id;

  const task = data[from].find(t => t.id === id);

  data[from] = data[from].filter(t => t.id !== id);
  data[to].push(task);

  save();
}

document.querySelectorAll(".column").forEach(col=>{
  col.ondragover = allowDrop;
  col.ondrop = drop;
});

render();
