let taskData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#Progress");
const done = document.querySelector("#done");
let dragElement = null;
const columns = [todo, progress, done];


function addTask(title, description, column) {
  const div = document.createElement("div");

  div.classList.add("task");
  div.setAttribute("draggable", "true");

  div.innerHTML = `
    <h2>${title}</h2>
    <p>${description}</p>
    <button>Delete</button>
    `;

  column.appendChild(div);
  div.addEventListener("drag", (e) => {
    dragElement = div;
  });

  const deleteButton = div.querySelector("button");
  deleteButton.addEventListener("click",()=>{
    div.remove();
    updateTaskCount();
  })
  return div;
}

function updateTaskCount(){
    columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");

    taskData[col.id] = Array.from(tasks).map((t) => {
      return {
        title: t.querySelector("h2").innerText,
        description: t.querySelector("p").innerText,
      };
    });

    localStorage.setItem("tasks", JSON.stringify(taskData));
    count.innerText = tasks.length;
  });
}

if (localStorage.getItem("tasks")) {
  const data = JSON.parse(localStorage.getItem("tasks"));
  columns.forEach((column)=>{
    const colId = column.id;
    if(data[colId]){
      data[colId].forEach((task)=>{
        addTask(task.title,task.description,column)
      })
    }
  })
  updateTaskCount();
}





function addDragEventsOnColumn(column) {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });
  column.addEventListener("dragleave", (e) => {
    e.preventDefault();
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();

    column.appendChild(dragElement);
    column.classList.remove("hover-over");

    updateTaskCount();
  });
}

addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const addTaskBtn = document.querySelector("#add-new-task");
const modal = document.querySelector(".modal");

toggleModalButton.addEventListener("click", () => {
  modal.classList.toggle("active");
});

modalBg.addEventListener("click", () => {
  modal.classList.remove("active");
});

addTaskBtn.addEventListener("click", () => {
  const taskTitle = document.querySelector("#task-title-input").value;
  const taskDescription = document.querySelector(
    "#task-description-input"
  ).value;

  addTask(taskTitle,taskDescription,todo);

  updateTaskCount();

  modal.classList.remove("active");
  document.querySelector("#task-title-input").value = "";
  document.querySelector(
    "#task-description-input"
  ).value = "";
});
