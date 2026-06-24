
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


function classifyTask(text) {
  const t = text.toLowerCase();

  // concluído
  if (
    t.includes("feito") ||
    t.includes("finalizado") ||
    t.includes("concluído") ||
    t.includes("done")
  ) return "done";

  // em progresso
  if (
    t.includes("em andamento") ||
    t.includes("trabalhando") ||
    t.includes("progresso") ||
    t.includes("develop") ||
    t.includes("implement")
  ) return "doing";

  // padrão
  return "todo";
}

function showAIToast(msg) {
  const div = document.createElement("div");

  div.textContent = msg;
  div.style.position = "fixed";
  div.style.bottom = "20px";
  div.style.left = "50%";
  div.style.transform = "translateX(-50%)";
  div.style.padding = "12px 18px";
  div.style.background = "rgba(0,245,255,0.2)";
  div.style.backdropFilter = "blur(10px)";
  div.style.border = "1px solid #00f5ff";
  div.style.borderRadius = "12px";
  div.style.color = "white";
  div.style.zIndex = "9999";
  div.style.animation = "fadeIn 0.3s ease";

  document.body.appendChild(div);

  setTimeout(() => div.remove(), 2500);
}
