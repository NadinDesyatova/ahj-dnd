import Task from "./task";
import TaskField from "./task-field";
import AddTaskForm from "./add-task-form";
import StorageTask from "./storage-task";
import DragAndDropTasks from "./drag-and-drop-tasks";
import taskFieldsNames from "../task-fields-names.json";



export default class TasksWidget {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this._tasks = [];
    this._storageTasks = new StorageTask();

    this.addTask = this.addTask.bind(this);
    this.removeTask = this.removeTask.bind(this);
    this.moveTask = this.moveTask.bind(this);

    this.addTaskContainerToggle = this.addTaskContainerToggle.bind(this);

    this.onClickAddTaskSpan = this.onClickAddTaskSpan.bind(this);
    this.onClickAddTaskBtn = this.onClickAddTaskBtn.bind(this);
    this.onClickCloseFormIcon = this.onClickCloseFormIcon.bind(this);
    this.onClickRemoveTaskIcon = this.onClickRemoveTaskIcon.bind(this);

    this.isClickAddTaskSpan = this.isClickAddTaskSpan.bind(this);
    this.isClickRemoveTaskIcon = this.isClickRemoveTaskIcon.bind(this); 
  }

  bindToDOM() {
    this.parentEl.insertAdjacentHTML("beforeend", "<div class='card'></div>");
    const card = this.parentEl.querySelector(".card");

    taskFieldsNames.forEach(
      (item) => {
        const field = new TaskField(card, item["name"], item["title-text"]);
        field.bindToDOM();
      }
    );

    this.taskContainers = card.querySelectorAll(TaskField.taskContainerSelector);

    if (this._storageTasks.checkStorage()) {
      this.taskContainers.forEach((c) => {
        const name = c.closest(TaskField.taskColumnSelector).getAttribute("name");
  
        const storedHTML = this._storageTasks.getHTML(name);
  
        if (storedHTML) {
          c.insertAdjacentHTML("beforeend", storedHTML);
        }
      });

      this._storageTasks.addToTasksArray(card);

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

  addTaskContainerToggle(container) {
    const addTaskContentElements = container.querySelectorAll(TaskField.addTaskContentSelector);
    addTaskContentElements.forEach(elem => elem.classList.toggle("add-task_content__overlapped"));
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

      const formEl = addTaskContainer.querySelector(AddTaskForm.formSelector);
      
      if (formEl) {
        this.addTaskContainerToggle(addTaskContainer);

        return;
      }

      const newForm = new AddTaskForm(addTaskContainer);

      const newFormEl = newForm.bindToDOM();

      this.addTaskContainerToggle(addTaskContainer);

      const addBtn = newFormEl.querySelector(AddTaskForm.btnSelector);

      const closeFormIcon = newFormEl.querySelector(AddTaskForm.closeIconSelector);

      addBtn.addEventListener("click", this.onClickAddTaskBtn);

      closeFormIcon.addEventListener("click", this.onClickCloseFormIcon);
    }
  }

  onClickAddTaskBtn(e) {
    e.preventDefault();

    const addBtn = e.target;

    const form = addBtn.closest(AddTaskForm.formSelector);

    const currentColumn = form.closest(TaskField.taskColumnSelector);
    
    const input = form.querySelector(AddTaskForm.inputSelector);

    const value = input.value.trim();

    if (!value) {
      return;
    }

    this.addTaskContainerToggle(currentColumn);

    this.addTask(currentColumn, value);

    form.reset();
  }

  onClickCloseFormIcon(e) {
    e.preventDefault();

    const closeFormIcon = e.target;

    const container = closeFormIcon.closest(TaskField.addTaskSelector);

    this.addTaskContainerToggle(container);

    closeFormIcon.closest(AddTaskForm.formSelector).reset();
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
