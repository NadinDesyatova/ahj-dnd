export const COLUMN_NAMES = ["todo", "progress", "done"];


export default class TaskField {
  constructor(parentEl) {
    this.parentEl = parentEl;
  }
  
  static get markup() {
    return `
      <div class="card">
        <div class="task-column" name="${COLUMN_NAMES[0]}">
          <h3 class="task-group-title">TODO</h3>
          <div class="task-container"></div>
          <div class="add-task">
            <span class="add-task-span">+ Add Card</span>
          </div>
        </div>
        <div class="task-column" name="${COLUMN_NAMES[1]}">
          <h3 class="task-group-title">IN PROGRESS</h3>
          <div class="task-container"></div>
          <div class="add-task">
            <span class="add-task-span">+ Add Card</span>
          </div>
        </div>
        <div class="task-column" name="${COLUMN_NAMES[2]}">
          <h3 class="task-group-title">DONE</h3>
          <div class="task-container"></div>
          <div class="add-task">
            <span class="add-task-span">+ Add Card</span>
          </div>
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

  static get addTaskSelector() {
    return ".add-task";
  }

  static get addTaskSpanMarkup() {
    return `
      <span class="add-task-span">+ Add Card</span>
    `;
  }
  
  bindToDOM() {
    this.parentEl.insertAdjacentHTML("beforeend", TaskField.markup);
  }
}
  