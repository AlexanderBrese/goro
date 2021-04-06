import { WebElement } from "./web_element.js";

export class Scrolling {
  constructor(element) {
    this.element = element;
  }

  do() {
    new WebElement(this.element).get().scrollIntoView({
        behavior: 'smooth'
    })
  }
}
