class Todos {
  constructor() {
    this.id = 0;
    this.todoList = {};
    const todos = JSON.parse(localStorage.getItem('todos'));
    if (todos) {
      todos.forEach(todo => {
        this.todoList[todo.id] = todo;
        this.id++;
      });
    }

    const searchInput = document.querySelector('#search-todos');
    searchInput.addEventListener('input', () => {
      if (searchInput.value.length > 0 && searchInput.value.length < 3) {
        return;
      }
      this.drawTodoList();
    });

    const addButton = document.querySelector('#add-todo');
    addButton.addEventListener('click', () => {
      const title = document.querySelector('#new-todo-title').value;
      if (title.length < 3) {
        alert('Title must be at least 3 characters long');
        return;
      }

      const date = document.querySelector('#new-todo-date').value;
      if (date && new Date(date) <= new Date()) {
        alert('Date must be in the future');
        return;
      }

      this.addTodo({
        title,
        date,
        done: false
      });
    });
  }

  createEditInput(type, value, id, className) {
    const input = document.createElement('input');
    input.type = type;
    input.value = value;
    input.id = id;
    input.className = className;
    return input;
  }

  drawTodoList() {
    let todos = Object.values(this.todoList);

    const searchInput = document.querySelector('#search-todos');
    todos = searchInput.value
      ? todos.filter(todo => todo.title.includes(searchInput.value)) 
      : todos;

    const todoListElement = document.querySelector('#todo-list');
    todoListElement.innerHTML = '';
    if (todos.length === 0) {
      todoListElement.innerHTML = '<li>No todos found</li>';
    } else {
    todos.forEach(todo => {
      const todoElement = document.createElement('li');
      const displayTitle = searchInput.value 
        ? todo.title.replaceAll(searchInput.value, `<mark>${searchInput.value}</mark>`)
        : todo.title;
      todoElement.innerHTML = `
        <div class="todo" id="todo-${todo.id}">
          <div class="todo-content">
            <div class="todo-status">
              <input type="checkbox" id="checkbox-todo-${todo.id}" ${todo.done ? 'checked' : ''} />
              <span class="todo-title" id="todo-title-${todo.id}">${displayTitle}</span>
            </div>
            <span class="todo-date" id="todo-date-${todo.id}">${todo.date || "-"}</span>
          </div>
          <button id="remove-todo-${todo.id}">Remove</button>
        </div>
      `;
      todoListElement.appendChild(todoElement);

      // Add remove button event listener
      const removeButton = todoElement.querySelector(`#remove-todo-${todo.id}`);
      removeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        this.removeTodo(todo.id);
      });

      // Add checkbox event listener
      const checkbox = todoElement.querySelector(`#checkbox-todo-${todo.id}`);
      checkbox.addEventListener('change', () => {
        this.updateTodo(todo.id, {
          done: checkbox.checked
        });
      });

      // Add edit event listener
      const todoElementDiv = todoElement.querySelector(`#todo-${todo.id}`);
      const titleElement = todoElement.querySelector(`#todo-title-${todo.id}`);
      const dateElement = todoElement.querySelector(`#todo-date-${todo.id}`);
      let boundEditEventListener;
      todoElementDiv.addEventListener('click', (event) => {
        event.stopPropagation();
        const titleInput = this.createEditInput('text', todo.title, todo.id, titleElement.className);
        const dateInput = this.createEditInput('date', todo.date, todo.id, dateElement.className);
        dateElement.replaceWith(dateInput);
        titleElement.replaceWith(titleInput);
        titleInput.focus();

        function editEventListener (event) {
          if (event.target !== titleInput && event.target !== dateInput) {
            this.updateTodo(todo.id, {
              title: titleInput.value,
              date: dateInput.value
            });
          }

          titleInput.replaceWith(titleElement);
          dateInput.replaceWith(dateElement);
          document.removeEventListener('click', boundEditEventListener);
        }

        boundEditEventListener = editEventListener.bind(this);
        document.addEventListener('click', boundEditEventListener);
      });
    });

    }
  }

  saveTodos() {
    const todos = Object.values(this.todoList);
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  addTodo(todo) {
    this.todoList[this.id] = { ...todo, id: this.id };
    this.id++;
    this.saveTodos();
    this.drawTodoList();
  };

  removeTodo(id) {
    delete this.todoList[id];
    this.saveTodos();
    this.drawTodoList();
  }

  updateTodo(id, newInfo) {
    this.todoList[id] = { ...this.todoList[id], ...newInfo};
    this.saveTodos();
    this.drawTodoList();
  }

  initTodoList() {
    this.todoList = JSON.parse(localStorage.getItem('todos'));
    this.drawTodoList();
  }
}

const todos = new Todos();
todos.drawTodoList();