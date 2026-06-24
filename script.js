
let data = JSON.parse(localStorage.getItem("tasks")) || {
  todo: [],
  doing: [],
  done: []
};

let xpData = JSON.parse(localStorage.getItem("xp")) || {
  xp: 0,
  level: 1,
  streak: 0,
  lastDate: null
};

/* ================= XP SYSTEM ================= */

function addXP(value = 10) {
  xpData.xp += value;

  const needed = xpData.level * 50;

  if (xpData.xp >= needed) {
    xpData.level++;
    showAIToast("🏆 Level Up!");
  }

  updateStreak();
  saveXP();
}

function updateStreak() {
  const today = new Date().toDateString();

  if (xpData.lastDate !== today) {
    xpData.streak += 1;
    xpData.lastDate = today;
  }
}

function saveXP() {
  localStorage.setItem("xp", JSON.stringify(xpData));
  updateXPUI();
}

function updateXPUI() {
  document.getElementById("xp").innerText = xpData.xp;
  document.getElementById("level").innerText = xpData.level;
  document.getElementById("streak").innerText = xpData.streak;

  const progress = (xpData.xp % (xpData.level * 50)) / (xpData.level * 50) * 100;
  document.getElementById("progress").style.width = progress + "%";
}

/* ================= TASK SYSTEM ================= */

function save() {
  localStorage.setItem("tasks", JSON.stringify(data));
  render();
  updateXPUI();
}

function addTask() {
  const input = document.getElementById("taskInput");

  if (!input.value.trim()) return;

  data.todo.push({
    id: Date.now(),
    text: input.value,
    done: false
  });

  input.value = "";
  save();
}

function deleteTask(column, id) {
  data[column] = data[column].filter(t => t.id !== id);
  save();
}

/* ================= COMPLETE TASK (GANHA XP) ================= */

function completeTask(column, id) {
  const task = data[column].find(t => t.id === id);
  if (!task) return;

  addXP(10);

  task.done = true;
  save();
}

/* ================= RENDER ================= */

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
        <span style="text-decoration:${task.done ? 'line-through' : 'none'}">
          ${task.text}
        </span>

        <div>
          <span onclick="completeTask('${col}', ${task.id})">✔</span>
          <span onclick="deleteTask('${col}', ${task.id})">✖</span>
        </div>
      `;

      el.appendChild(div);
    });
  });
}

/* ================= DRAG & DROP ================= */

function allowDrop(e){ e.preventDefault(); }

function drop(e){
  e.preventDefault();

  const id = Number(e.dataTransfer.getData("id"));
  const from = e.dataTransfer.getData("from");
  const to = e.currentTarget.querySelector(".list").id;

  const task = data[from].find(t => t.id === id);
  if (!task) return;

  data[from] = data[from].filter(t => t.id !== id);
  data[to].push(task);

  save();
}

document.querySelectorAll(".column").forEach(col=>{
  col.ondragover = allowDrop;
  col.ondrop = drop;
});

/* ================= IA ================= */

function classifyTask(text) {
  const t = text.toLowerCase();

  if (t.includes("feito") || t.includes("done")) return "done";
  if (t.includes("progresso") || t.includes("working")) return "doing";

  return "todo";
}

function autoOrganize() {
  const all = [...data.todo, ...data.doing, ...data.done];

  data = { todo: [], doing: [], done: [] };

  all.forEach(task => {
    data[classifyTask(task.text)].push(task);
  });

  save();
  showAIToast("🤖 IA reorganizou tudo!");
}

/* ================= TOAST ================= */

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

  document.body.appendChild(div);

  setTimeout(() => div.remove(), 2500);
}

/* INIT */
updateXPUI();
render();
