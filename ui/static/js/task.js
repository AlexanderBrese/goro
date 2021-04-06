import { WebElement } from "./web_element.js";

export class Task {
  constructor(currentPomodoro, dispatch, element = new WebElement(".task")) {
    this.currentPomodoro = currentPomodoro;
    this.input = element.get();
    this.dispatch = dispatch
  }

  update() {
    this.input.value = this.currentPomodoro.task
  }

  listen() {
    this.input.addEventListener("input", (e) => this.onInput(e));
  }

  onInput(e) {
    const task = e.target.value;
    this.currentPomodoro.changeTask(task)
    this.dispatch()
  }
}
