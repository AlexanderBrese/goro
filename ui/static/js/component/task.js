import { WebElement } from "../util/web_element.js";

export class Task {
  constructor(
    currentPomodoro,
    dispatch,
    autocompletion,
    element = new WebElement(".task").get()
  ) {
    this.currentPomodoro = currentPomodoro;
    this.input = element;
    this.autocompletion = autocompletion;
    this.dispatch = dispatch;
  }

  update() {
    this.input.value = this.currentPomodoro.task;
  }

  listen() {
    this.input.addEventListener("input", (e) => this.onInput(e));
  }

  // TODO: debounce & use autocompletion
  onInput(e) {
    const task = e.target.value;
    this.autocompletion.suggest(task)
    this.currentPomodoro.changeTask(task);
    this.dispatch();
  }
}
