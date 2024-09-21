document.addEventListener("DOMContentLoaded", function () {
  const todoList = document.getElementById("todoList");
  const inProgressList = document.getElementById("inProgressList");
  const doneList = document.getElementById("doneList");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const newTaskInput = document.getElementById("newTaskInput");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function loadTasks() {
    todoList.innerHTML = "";
    inProgressList.innerHTML = "";
    doneList.innerHTML = "";

    tasks.forEach((task) => {
      addTaskToDOM(task);
    });
  }

  function addTaskToDOM(task) { //добавление в DOM
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.setAttribute("data-id", task.id);
    li.innerHTML = `
            <span>${task.text}</span>
            <div>
                ${
                  task.status !== "Done"
                    ? `<button class="btn btn-success next-btn">Next</button>`
                    : ""
                }
                <button class="btn btn-danger delete-btn">X</button>
            </div>
        `;

    if (task.status === "To Do") {
      todoList.appendChild(li);
    } else if (task.status === "In Progress") {
      inProgressList.appendChild(li);
    } else if (task.status === "Done") {
      doneList.appendChild(li);
    }
  }
  
  addTaskBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const taskText = newTaskInput.value.trim();
    if (taskText === "") return;

    const newTask = {
      id: Date.now(),
      text: taskText,
      status: "To Do",
    };
    tasks.push(newTask);
    addTaskToDOM(newTask);
    saveTasks();

    newTaskInput.value = "";
  });

  document.addEventListener("click", function (e) {
    e.preventDefault();
    if (e.target.classList.contains("next-btn")) {
      const taskId = e.target.closest("li").getAttribute("data-id");
      updateTaskStatus(taskId);
    } else if (e.target.classList.contains("delete-btn")) {
      const taskId = e.target.closest("li").getAttribute("data-id");
      deleteTask(taskId);
    }
  });

  function updateTaskStatus(id) { // функция статуса 
    tasks = tasks.map((task) => {
      if (task.id == id) {
        if (task.status === "To Do") {
          task.status = "In Progress";
        } else if (task.status === "In Progress") {
          task.status = "Done";
        }
      }
      return task;
    });
    saveTasks();
    loadTasks();
  }

  function deleteTask(id) {
    tasks = tasks.filter((task) => task.id != id);
    saveTasks();
    loadTasks();
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  loadTasks();
});
