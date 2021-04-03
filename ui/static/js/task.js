import { WebElement } from "./web_element.js";

export class Task {
  constructor(currentPomodoro) {
    this.pomodoro = currentPomodoro;
    
    this.input = new WebElement(".task").parsed();
  }

  listen() {
    this.input.addEventListener("input", (e) => this.onInput(e));
  }

  onInput(e) {
    const task = e.target.value;
    this.pomodoro.changeTask(task)
  }
}
