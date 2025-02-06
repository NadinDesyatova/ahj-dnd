import Task from "./task";
import taskFieldsNames from "../task-fields-names.json";


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

    const columnNames = taskFieldsNames.map(item => item.name);
    
    return storageKeys.some((key) => columnNames.includes(key));
  }
}
