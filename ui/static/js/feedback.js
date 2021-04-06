import { WebElement } from "./web_element.js";

export class Feedback {
  constructor(
    currentPomodoro,
    dispatch,
    productiveBtn = new WebElement(".productive--btn")
  ) {
    this.currentPomodoro = currentPomodoro;
    this.dispatch = dispatch;
    this.productiveBtn = productiveBtn.get();
  }

  update() {
    if(this.currentPomodoro.feltProductive) {
      this.productiveBtn.classList.remove("is-empty");
    }
  }

  listen() {
    this.productiveBtn.addEventListener("click", () => this.onClick());
  }

  onClick() {
    this.currentPomodoro.toggleFeedBack();
    if (this.productiveBtn.classList.contains("is-empty")) {
      this.productiveBtn.classList.remove("is-empty");
    } else {
      this.productiveBtn.classList.add("is-empty");
    }

    this.dispatch();
  }
}
