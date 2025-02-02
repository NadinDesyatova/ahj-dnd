import TaskField from "./task-field";
import AddTaskForm from "./add-task-form";


export default class Task {
  constructor(parentEl, value) {
    this.parentEl = parentEl;
    this.value = value;
  }
  
  static get markup() {
    return `
      <div class="task">
        <div class="task__text"></div>
        <div class="task-remove">&times;</div>
      </div>
    `;
  }
  
  static get taskSelector() {
    return ".task";
  }

  static get taskTextSelector() {
    return ".task__text";
  }

  static get taskRemoveSelector() {
    return ".task-remove";
  }
  
  bindToDOM() {
    const container = this.parentEl.querySelector(TaskField.taskContainerSelector);
    container.insertAdjacentHTML("beforeend", Task.markup);

    const addTaskEl = this.parentEl.querySelector(TaskField.addTaskSelector);

    const addTaskForm = addTaskEl.querySelector(AddTaskForm.formSelector);
    addTaskForm.remove();

    addTaskEl.insertAdjacentHTML("beforeend", TaskField.addTaskSpanMarkup);

    const tasks = container.querySelectorAll(Task.taskSelector);

    const currentTask = tasks[tasks.length - 1];
    currentTask.querySelector(Task.taskTextSelector).textContent = this.value;

    return currentTask;
  }
}
