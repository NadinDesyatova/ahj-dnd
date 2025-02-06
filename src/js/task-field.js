export default class TaskField {
  constructor(parentEl, name, titleText) {
    this.parentEl = parentEl;
    this.name = name;
    this.titleText = titleText;
  }
  
  static get markup() {
    return `
      <div class="task-column">
        <h3 class="task-group-title"></h3>
        <div class="task-container"></div>
        <div class="add-task">
          <span class="add-task_content add-task-span">+ Add Card</span>
        </div>
      </div>
    `;
  }
  
  static get taskColumnSelector() {
    return ".task-column";
  }

  static get taskContainerSelector() {
    return ".task-container";
  }

  static get taskGroupTitleSelector() {
    return ".task-group-title";
  }

  static get addTaskSelector() {
    return ".add-task";
  }

  static get addTaskContentSelector() {
    return ".add-task_content";
  }
  
  bindToDOM() {
    this.parentEl.insertAdjacentHTML("beforeend", TaskField.markup);

    const columns = this.parentEl.querySelectorAll(TaskField.taskColumnSelector);

    const currentColumn = columns[columns.length - 1];

    currentColumn.setAttribute("name", this.name);
    currentColumn.querySelector(TaskField.taskGroupTitleSelector).textContent = this.titleText;
  }
}
  