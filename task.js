let todosList = [];
let filteredList = [];

const addTodo = document.querySelector(".add-todo");
const todosContainer = document.querySelector(".todos-container");
const todoInput = document.querySelector(".todo-input");
const searchInput = document.querySelector(".search-input");
const allSelected = document.getElementById("all");
const ongoingSelected = document.getElementById("ongoing");
const completedSelected = document.getElementById("completed");

// Get and Filter Data
let filterData;

let getData = async function () {
  let data;
  if (allSelected.checked) {
    data = await fetch("http://localhost:3000/todos");
  } else if (ongoingSelected.checked) {
    data = await fetch("http://localhost:3000/todos?completed=false");
  } else if (completedSelected.checked) {
    data = await fetch("http://localhost:3000/todos?completed=true");
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

// Display Todo Items

const displayTodos = function () {
  todosContainer.innerHTML = "";

  filteredList.forEach((i) => {
    const todo = `<div class="todo-task" uniqueId=${i.id}>
      <input type='checkbox'  ${
        i.completed ? "checked" : ""
      } onchange='changeTodoStatus()'/>
      <h3 class='task-name'>${i.task}</h3>
      <button class='todo-button' onclick='openEditModal()'>Edit</button>
      <button class='todo-button' onclick='deleteToDo()'>delete</button>
    </div>`;
    todosContainer.insertAdjacentHTML("beforeend", todo);
  });
};

// Adding ToDo Item to ToDo List

function addTodoTask() {
  const todoExists = todosList.find((each) => each.task === todoInput.value);
  if (todoExists !== undefined) return;
  const stringifiedTodoItem = JSON.stringify({
    task: todoInput.value,
    completed: false,
  });

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: stringifiedTodoItem,
  };

  fetch("http://localhost:3000/todos", options);

  todoInput.value = "";
  todosContainer.innerHTML = "";
  displayTodos();
}

addTodo.addEventListener("click", addTodoTask);
todoInput.addEventListener("keyup", (event) => {
  if (event.key === enter) {
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
  const todoId = this.event.target.closest("div").getAttribute("uniqueId");

  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  fetch(`http://localhost:3000/todos/${todoId}`, options);

  todosContainer.innerHTML = "";
  displayTodos();
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
