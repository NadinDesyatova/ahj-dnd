export default class AddTaskForm {
  constructor(parentEl) {
    this.parentEl = parentEl;
  }

  static get markup() {
    return `
      <form class="control">
        <input type="text" name="task" class="input-task" placeholder="Enter a title for this card...">
        <div>
          <button class="add-btn">Add Card</button>
          <a href="#" class="input-task__close">&times;</a>
        </div>
      </form>
    `;
  }

  static get formSelector() {
    return ".control";
  }

  static get inputSelector() {
    return ".input-task";
  }

  static get btnSelector() {
    return ".add-btn";
  } 

  static get closeIconSelector() {
    return ".input-task__close";
  }

  bindToDOM() {
    this.parentEl.insertAdjacentHTML("beforeend", AddTaskForm.markup);

    const form = this.parentEl.querySelector(AddTaskForm.formSelector);

    return form;
  }  
}