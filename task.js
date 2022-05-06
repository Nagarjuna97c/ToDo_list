const addTodo = document.querySelector(".add-todo");
const todosContainer = document.querySelector(".todos-container");
const todoInput = document.querySelector(".todo-input");
const searchInput = document.querySelector(".search-input");

let todosList = [];
let filteredList = [];
let selectedSort = "";
let completed = false;

// Get and Filter Data
let filterData;

let getData = async function () {
  let data;
  if (selectedSort === "") {
    data = await fetch("http://localhost:3000/todos");
  } else {
    data = await fetch(`http://localhost:3000/todos?completed=${completed}`);
  }

  todosList = await data.json();
  filteredList = todosList.filter((each) =>
    each.task.includes(searchInput.value)
  );

  filterData = function (filterInput) {
    filteredList = todosList.filter((each) => each.task.includes(filterInput));
    displayTodos();
  };
  displayTodos();
};

getData();

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
  each.addEventListener("click", getData);
});

document.querySelector(".sort-option").style.backgroundColor = "#11a511";

// Display ToDo Item
function displayTodo(todoItem, fadeIn = "") {
  const todo = `<div class= 'todo-task ${fadeIn}' uniqueId=${todoItem.id}>
      <input type='checkbox'  ${
        todoItem.completed ? "checked" : ""
      } onchange='changeTodoStatus()'/>
      <h3 class='task-name'>${todoItem.task}</h3>
      <button class='todo-button' onclick='openEditModal()'>Edit</button>
      <button class='todo-button' onclick='deleteToDo()'>delete</button>
    </div>`;
  todosContainer.insertAdjacentHTML("beforeend", todo);
}

// Display Todo Items

const displayTodos = function () {
  todosContainer.innerHTML = "";

  filteredList.forEach((todo) => displayTodo(todo));
};

// Adding ToDo Item to ToDo List

const addTodoTask = async function () {
  const todoExists = todosList.find((each) => each.task === todoInput.value);
  if (todoExists !== undefined) return;
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

  todo["id"] = todosList.length + 2;

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
  const todoId = this.event.target.closest("div").getAttribute("uniqueId");

  const todoItem = todosList.find((each) => each.id === Number(todoId));

  const modifiedTodoItem = {
    task: todoItem.task,
    completed: !todoItem.completed,
  };

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(modifiedTodoItem),
  };

  fetch(`http://localhost:3000/todos/${todoId}`, options);

  todosContainer.innerHTML = "";
  displayTodos();
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

  todosList = fetch(`http://localhost:3000/todos/${todoId}`, options);

  let id = 1;
  document.querySelectorAll(".todo-task").forEach((each) => {
    each.setAttribute("uniqueId", id);
    ++id;
  });
}

// Edit ToDo Task
let editTodo;

const modal = document.querySelector(".modal-container");

function openEditModal() {
  modal.style.display = "flex";
  const todo = this.event.target.closest("div");
  const task = todo.querySelector("h3").textContent;
  document.querySelector(".edit-todo-task").textContent = "ToDo:" + task;

  // Using Closure
  editTodo = function () {
    const todoId = todo.getAttribute("uniqueId");
    const editInput = document.querySelector(".todo-edit-input").value;
    const todoItem = todosList.find((each) => each.id === Number(todoId));

    const modifiedTodoItem = {
      task: editInput,
      completed: todoItem.completed,
    };

    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(modifiedTodoItem),
    };

    fetch(`http://localhost:3000/todos/${todoId}`, options);
  };
}

window.addEventListener("click", (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

// Filter using search Input
searchInput.addEventListener("keyup", (event) => {
  filterData(event.target.value);
});
