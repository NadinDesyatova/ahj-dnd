import TaskField from "./task-field";
import StorageTask from "./storage-task";
import Task from "./task";


export default class DragAndDropTasks {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.actualTask = undefined;
    this.lastMouseOverColumn = undefined;
    
    this.deactivateTask = this.deactivateTask.bind(this);
    this.createTransparentEl = this.createTransparentEl.bind(this);
    this.changeStorage = this.changeStorage.bind(this);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    this.removeListeners = this.removeListeners.bind(this);
  }

  createTransparentEl(originElement) {
    const transparentEl = document.createElement("div");
    transparentEl.innerHTML = originElement.innerHTML;
    transparentEl.classList.add("task");
    transparentEl.classList.add("transparent-element");

    return transparentEl;
  }

  deactivateTask() {
    document.body.removeAttribute("style");

    this.transparentEl.remove();

    this.actualTask.classList.remove("dragged");

    this.lastMouseOverColumn = undefined;

    this.actualTask = undefined;
  }
  
  changeStorage(finalColumn) {
    this.parentEl.querySelectorAll(Task.taskSelector).forEach(task => {
      task.removeAttribute("style");
    });

    if (this.initialColumn === finalColumn && this.initialHTML === finalColumn.innerHTML) {
      return;
    }

    const storageTask = new StorageTask();

    const initialColumnName = this.initialColumn.getAttribute("name");
    const finalColumnName = finalColumn.getAttribute("name");

    const initialContainer = this.initialColumn.querySelector(TaskField.taskContainerSelector);
    const finalContainer = finalColumn.querySelector(TaskField.taskContainerSelector);
    
    if (this.initialColumn !== finalColumn) {
      storageTask.save(initialColumnName, initialContainer);
      storageTask.save(finalColumnName, finalContainer);
    } else {
      storageTask.save(finalColumnName, finalContainer)
    }
  }

  removeListeners() {
    document.documentElement.removeEventListener('mouseup', this.onMouseUp);
    document.documentElement.removeEventListener('mouseover', this.onMouseOver);
  }
    
  onMouseOver(e) {
    this.actualTask.style.top = `${e.clientY - this.correctionElemY}px`;
    this.actualTask.style.left = `${e.clientX - this.correctionElemX}px`;

    const column = e.target.closest(TaskField.taskColumnSelector);

    if (!column) {
      return;
    }

    const taskContainer = column.querySelector(TaskField.taskContainerSelector);
    
    this.hoverTask = e.target.closest(Task.taskSelector);

    if (this.hoverTask) {
      (this.hoverTask.offsetHeight / 2) <= (e.y - this.hoverTask.offsetTop)
        ? taskContainer.insertBefore(
          this.transparentEl,
          this.hoverTask.nextSibling
        )
        : taskContainer.insertBefore(
          this.transparentEl,
          this.hoverTask
        );
      this.elemForMouseUp = this.hoverTask;
      return;
    }

    if (this.lastMouseOverColumn !== column) {
      this.elemForMouseUp = column;
      taskContainer.appendChild(this.transparentEl);
  
      this.lastMouseOverColumn = column;
    }
  }
    
  onMouseUp(e) {
    const column = e.target.closest(TaskField.taskColumnSelector);

    if (!column) {
      this.deactivateTask();

      this.removeListeners();

      return;
    }

    const container = column.querySelector(TaskField.taskContainerSelector);

    const mouseUpTask = this.elemForMouseUp.closest(Task.taskSelector);

    mouseUpTask
      ? (mouseUpTask.offsetHeight / 2) <= (e.y - mouseUpTask.offsetTop) 
        ? container.insertBefore(this.actualTask, mouseUpTask.nextSibling)
        : container.insertBefore(this.actualTask, mouseUpTask)
      : container.appendChild(this.actualTask);
  
    this.deactivateTask();

    this.changeStorage(column);

    this.removeListeners();
  }

  onMouseDown(e) { 
    if (e.target.classList.contains("task") || e.target.classList.contains("task__text")) {
      e.preventDefault();

      this.actualTask = e.target.closest(Task.taskSelector);
  
      this.initialColumn = this.actualTask.closest(TaskField.taskColumnSelector);
  
      this.initialHTML = this.initialColumn.querySelector(TaskField.taskContainerSelector).innerHTML;

      document.body.style.cursor = "grabbing";
  
      const { top, left } = this.actualTask.getBoundingClientRect();
        
      this.correctionElemX = e.clientX - left;
      this.correctionElemY = e.clientY - top;
  
      this.actualTask.style.top = `${top}px`;
      this.actualTask.style.left = `${left}px`;
  
      this.transparentEl = this.createTransparentEl(this.actualTask);
        
      const sibling = this.actualTask.nextSiblingElement;
  
      this.elemForMouseUp =
          sibling && sibling.classList.contains("task")
            ? sibling
            : this.actualTask.closest(TaskField.taskContainerSelector);
  
      this.actualTask.classList.add("dragged");
        
      document.documentElement.addEventListener("mouseover", this.onMouseOver);
      document.documentElement.addEventListener("mouseup", this.onMouseUp);
    }
  }

  isMouseDown() {
    this.parentEl.addEventListener('mousedown', this.onMouseDown);
  }
}
