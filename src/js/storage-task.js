import Task from "./task";
import { COLUMN_NAMES } from "./task-field";


export default class StorageTask {
  constructor() {
    this.tasks = [];
  }

  save(name, taskContainer) {
    localStorage.setItem(name, taskContainer.innerHTML);
  }

  getHTML(name) {
    const storedColumn = localStorage.getItem(name);
    if (!storedColumn) {
      return;
    }

    return storedColumn;
  }

  remove(name) {
    localStorage.removeItem(name);
  }

  addToTasksArray(parent) {
    const tasksElements = parent.querySelectorAll(Task.taskSelector);
    tasksElements.forEach(task => {
      this.tasks.push({
        id: Number(task.dataset.taskId),
        element: task
      })
    });
  }

  checkStorage() {
    const storageKeys = Object.keys(localStorage);
    
    return storageKeys.some((key) => COLUMN_NAMES.includes(key));
  }
}
