import TasksWidget from "./tasks-widget";


const container = document.querySelector(".content");

document.addEventListener("DOMContentLoaded", () => {
  const tasksWidget= new TasksWidget(container);
  tasksWidget.bindToDOM();
  tasksWidget.isClickAddTaskSpan();
  tasksWidget.isClickRemoveTaskIcon();
  tasksWidget.moveTask();
});
