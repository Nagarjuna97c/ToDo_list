const addTodo = document.querySelector(".add-todo");
const todosContainer = document.querySelector(".todos-container");
const todoInput = document.querySelector(".todo-input");
const searchInput = document.querySelector(".search-input");

let todosList = [];
let filteredList = [];
let selectedSort = "";
let completed = false;

// Get TodosList
let getTodosList = async function () {
  let data;
  todosContainer.innerHTML = `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
  todosContainer.classList.add("center-spinner");
  if (selectedSort === "") {
    data = await fetch("http://localhost:3000/todos");
  } else {
    data = await fetch(`http://localhost:3000/todos?completed=${completed}`);
  }
  todosList = await data.json();
  todosContainer.classList.remove("center-spinner");
  // console.log(todosList);
};

// Setting Filtered List and FilterData function for search functionality
let filterData;
const setData = async function () {
  await getTodosList();
  filteredList = todosList.filter((each) =>
    each.task.includes(searchInput.value)
  );

  filterData = function (filterInput) {
    filteredList = todosList.filter((each) => each.task.includes(filterInput));
    displayTodos();
  };

  displayTodos();
};

setData();

// Function to select sort
function setSort(event) {
  let sortOption = event.target.textContent;
  document.querySelectorAll(".sort-option").forEach((each) => {
    each.style.backgroundColor = "#4e4ec8";
  });
  event.target.style.backgroundColor = "#11a511";
  switch (sortOption) {
    case "All":
      selectedSort = "";
      break;
    case "Ongoing":
      selectedSort = "ongoing";
      completed = false;
      break;
    default:
      selectedSort = "completed";
      completed = true;
      break;
  }
}

// Add Event Listener to sort items
document.querySelectorAll(".sort-option").forEach((each) => {
  each.addEventListener("click", setSort);
  each.addEventListener("click", setData);
});

document.querySelector(".sort-option").style.backgroundColor = "#11a511";

// Display ToDo Item
function displayTodo(todoItem, fadeIn = "") {
  const todo = `<div class= 'todo-task ${fadeIn} ${
    selectedSort == "" && todoItem.completed == true
      ? "completed-background"
      : ""
  }' uniqueId=${todoItem.id}>
      <input type='checkbox' class='status-display'  ${
        todoItem.completed ? "checked" : ""
      } onchange='changeTodoStatus()'/>
      <h3 class='task-name'>${todoItem.task}</h3>
      <button class='edit-todo-button' onclick='openEditModal()'><svg xmlns="http://www.w3.org/2000/svg" class='edit-icon' viewBox="0 0 576 512"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"/></svg></button>
      <button class='delete-todo-button' onclick='deleteToDo()'><svg xmlns="http://www.w3.org/2000/svg" class='delete-icon' viewBox="0 0 448 512"><path d="M160 400C160 408.8 152.8 416 144 416C135.2 416 128 408.8 128 400V192C128 183.2 135.2 176 144 176C152.8 176 160 183.2 160 192V400zM240 400C240 408.8 232.8 416 224 416C215.2 416 208 408.8 208 400V192C208 183.2 215.2 176 224 176C232.8 176 240 183.2 240 192V400zM320 400C320 408.8 312.8 416 304 416C295.2 416 288 408.8 288 400V192C288 183.2 295.2 176 304 176C312.8 176 320 183.2 320 192V400zM317.5 24.94L354.2 80H424C437.3 80 448 90.75 448 104C448 117.3 437.3 128 424 128H416V432C416 476.2 380.2 512 336 512H112C67.82 512 32 476.2 32 432V128H24C10.75 128 0 117.3 0 104C0 90.75 10.75 80 24 80H93.82L130.5 24.94C140.9 9.357 158.4 0 177.1 0H270.9C289.6 0 307.1 9.358 317.5 24.94H317.5zM151.5 80H296.5L277.5 51.56C276 49.34 273.5 48 270.9 48H177.1C174.5 48 171.1 49.34 170.5 51.56L151.5 80zM80 432C80 449.7 94.33 464 112 464H336C353.7 464 368 449.7 368 432V128H80V432z"/></svg></button>
    </div>`;
  todosContainer.insertAdjacentHTML("beforeend", todo);
}

// Display Todo Items

function displayTodos() {
  todosContainer.innerHTML = "";
  filteredList.forEach((todo) => displayTodo(todo));
}

// Adding ToDo Item to ToDo List

const addTodoTask = async function () {
  const inputError = document.querySelector(".todo-input-error");
  const todoExists = todosList.find((each) => each.task === todoInput.value);

  if (todoExists === "") {
    inputError.textContent = "Empty Input Field";
    return;
  } else if (todoExists !== undefined) {
    inputError.textContent = "*Todo already exists";
    return;
  } else {
    inputError.textContent = "";
  }

  const todo = {
    task: todoInput.value,
    completed: false,
  };

  const stringifiedTodoItem = JSON.stringify(todo);

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: stringifiedTodoItem,
  };

  todoInput.value = "";
  todo["id"] = todosList[todosList.length - 1].id + 1;

  if (!completed) {
    document
      .querySelector(".scroll-target")
      .scrollIntoView({ behavior: "smooth" });
    displayTodo(todo, "fade-in");
  }

  fetch("http://localhost:3000/todos", options);
  todosList.push(todo);
};

addTodo.addEventListener("click", addTodoTask);
todoInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    addTodoTask();
  }
});

// Check Item to mark completion
function changeTodoStatus(event) {
  const todo = this.event.target.closest("div");
  const todoId = todo.getAttribute("uniqueId");

  const todoItem = todosList.find((each) => each.id === Number(todoId));

  const modifiedTodoItem = {
    task: todoItem.task,
    completed: !todoItem.completed,
    id: todoItem.id,
  };

  // todo
  //   .querySelector(".status-display")
  //   .setAttribute("checked", !todoItem.completed);

  todo.classList.remove("completed-background");

  if (!todoItem.completed) {
    todo.classList.add("completed-background");
  }

  todosList = todosList.map((each) => {
    if (each.id === todoItem.id) {
      return {
        task: todoItem.task,
        completed: !todoItem.completed,
        id: todoItem.id,
      };
    }
    return each;
  });

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(modifiedTodoItem),
  };

  fetch(`http://localhost:3000/todos/${todoId}`, options);
}

//deleteToDo Item in ToDo List
function deleteToDo(event) {
  const todo = this.event.target.closest("div");
  const todoId = todo.getAttribute("uniqueId");

  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  todo.classList.add("fade-out");
  setTimeout(function () {
    todo.remove();
  }, 2000);

  fetch(`http://localhost:3000/todos/${todoId}`, options);
  todosList = todosList.filter((each) => each.id !== Number(todoId));
  console.log(todosList);
}

// Edit ToDo Task
let editTodo;

const modal = document.querySelector(".modal-container");
const editInput = document.querySelector(".todo-edit-input");

function openEditModal() {
  modal.style.display = "flex";
  const todo = this.event.target.closest("div");
  const task = todo.querySelector("h3").textContent;
  document.querySelector(
    ".edit-todo-task"
  ).innerHTML = `<span class='existing-todo'>Existing ToDo:</span>  ${task}`;

  // Using Closure
  editTodo = function () {
    const todoId = todo.getAttribute("uniqueId");
    const editInputValue = editInput.value;

    const todoItem = todosList.find((each) => each.id === Number(todoId));
    const todoExists = todosList.find((each) => each.task === editInputValue);

    const todoError = document.querySelector(".todo-error");

    if (editInputValue === "") {
      todoError.textContent = "*Empty Input Field";
      return;
    } else if (todoExists !== undefined) {
      todoError.textContent = "*Todo already exists";
      return;
    } else {
      todoError.textContent = "";
    }

    const modifiedTodoItem = {
      task: editInputValue,
      completed: todoItem.completed,
      id: todoItem.id,
    };

    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(modifiedTodoItem),
    };

    console.log(todo.querySelector(".task-name"));
    todo.querySelector(".task-name").textContent = editInputValue;

    fetch(`http://localhost:3000/todos/${todoId}`, options);

    todosList = todosList.map((each) => {
      if (each.id === todoItem.id) {
        return {
          task: editInputValue,
          completed: todoItem.completed,
          id: todoItem.id,
        };
      }
      return each;
    });
    modal.style.display = "none";
  };
}

editInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    editTodo();
  }
});

window.addEventListener("click", (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

// Filter using search Input
searchInput.addEventListener("keyup", (event) => {
  filterData(event.target.value);
});
