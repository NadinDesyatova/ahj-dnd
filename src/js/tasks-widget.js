import Task from "./task";
import TaskField from "./task-field";
import AddTaskForm from "./add-task-form";
import StorageTask from "./storage-task";
import DragAndDropTasks from "./drag-and-drop-tasks";


export default class TasksWidget {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this._tasks = [];
    this._storageTasks = new StorageTask();

    this.addTask = this.addTask.bind(this);
    this.removeTask = this.removeTask.bind(this);
    this.moveTask = this.moveTask.bind(this);

    this.onClickAddTaskSpan = this.onClickAddTaskSpan.bind(this);
    this.onClickAddTaskBtn = this.onClickAddTaskBtn.bind(this);
    this.onClickCloseFormIcon = this.onClickCloseFormIcon.bind(this);
    this.onClickRemoveTaskIcon = this.onClickRemoveTaskIcon.bind(this);

    this.isClickAddTaskSpan = this.isClickAddTaskSpan.bind(this);
    this.isClickRemoveTaskIcon = this.isClickRemoveTaskIcon.bind(this); 
  }

  bindToDOM() {
    const field = new TaskField(this.parentEl);
    field.bindToDOM();

    this.taskContainers = this.parentEl.querySelectorAll(TaskField.taskContainerSelector);

    if (this._storageTasks.checkStorage()) {
      this.taskContainers.forEach((c) => {
        const name = c.closest(TaskField.taskColumnSelector).getAttribute("name");
  
        const storedHTML = this._storageTasks.getHTML(name);
  
        if (storedHTML) {
          c.insertAdjacentHTML("beforeend", storedHTML);
        }
      });

      this._storageTasks.addToTasksArray(this.parentEl);

      this._tasks = this._storageTasks.tasks;
    }
  }  

  addTask(column, value) {
    const newTask = new Task(column, value);
    const taskEl = newTask.bindToDOM();

    const id = performance.now();

    this._tasks.push({
      id,
      element: taskEl,
    });

    taskEl.dataset.taskId = id;

    const columnContainer = column.querySelector(TaskField.taskContainerSelector);

    this._storageTasks.save(column.getAttribute("name"), columnContainer);
  }

  removeTask(id) {
    const task = this._tasks.find((task) => task.id === Number(id));

    const taskEl = task.element;

    const column = taskEl.closest(TaskField.taskColumnSelector);
    const columnName = column.getAttribute("name");

    taskEl.remove();

    this._tasks = this._tasks.filter((t) => t.id !== Number(id));

    const columnTasks = column.querySelectorAll(Task.taskSelector);

    if (!columnTasks.length) {
      this._storageTasks.remove(columnName);
    }

    this._storageTasks.save(columnName, column.querySelector(TaskField.taskContainerSelector));
  }

  onClickAddTaskSpan(e) {
    if (e.target.classList.contains("add-task-span")) {
      e.preventDefault();

      const addTaskSpan = e.target;

      const addTaskContainer = addTaskSpan.closest(TaskField.addTaskSelector);

      const form = new AddTaskForm(addTaskContainer);

      addTaskSpan.remove();

      const formEl = form.bindToDOM();
    
      const addBtn = formEl.querySelector(AddTaskForm.btnSelector);

      const closeFormIcon = formEl.querySelector(AddTaskForm.closeIconSelector);

      addBtn.addEventListener("click", this.onClickAddTaskBtn);

      closeFormIcon.addEventListener("click", this.onClickCloseFormIcon);
    }
  }

  onClickAddTaskBtn(e) {
    e.preventDefault();

    const addBtn = e.target;

    const currentColumn = addBtn.closest(TaskField.taskColumnSelector);

    const closeFormIcon = currentColumn.querySelector(AddTaskForm.closeIconSelector);
    
    const input = currentColumn.querySelector(AddTaskForm.inputSelector);

    const value = input.value.trim();

    if (!value) {
      return;
    }
    
    addBtn.removeEventListener("click", this.onClickAddTaskBtn);

    closeFormIcon.removeEventListener("click", this.onClickCloseFormIcon);

    this.addTask(currentColumn, value);
  }

  onClickCloseFormIcon(e) {
    e.preventDefault();

    const closeFormIcon = e.target;

    const addTaskEl = closeFormIcon.closest(TaskField.addTaskSelector);
    
    const addBtn = addTaskEl.querySelector(AddTaskForm.btnSelector);

    const form = addTaskEl.querySelector(AddTaskForm.formSelector);

    addBtn.removeEventListener("click", this.onClickAddTaskBtn);

    closeFormIcon.removeEventListener("click", this.onClickCloseFormIcon);

    form.remove();

    addTaskEl.insertAdjacentHTML("beforeend", TaskField.addTaskSpanMarkup);
  }

  onClickRemoveTaskIcon(e) {
    if (e.target.classList.contains("task-remove")) {
      e.preventDefault();

      const currentTask = e.target.closest(Task.taskSelector);

      const id = currentTask.dataset.taskId;
      
      this.removeTask(id);
    }
  } 

  isClickAddTaskSpan() {
    this.parentEl.addEventListener("click", this.onClickAddTaskSpan);
  }

  isClickRemoveTaskIcon() {
    this.parentEl.addEventListener("click", this.onClickRemoveTaskIcon);
  }

  moveTask() {
    const dragAndDrop = new DragAndDropTasks(this.parentEl);

    dragAndDrop.isMouseDown();
  }
}
