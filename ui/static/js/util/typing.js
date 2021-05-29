import { wait } from "../util/wait.js";

export class Typing {
  constructor(element, text, delay = 40) {
    this.element = element;
    this.delay = delay;
    this.text = text;
  }

  async do() {
    let letters = this.text.split("");
    this.element.textContent = "";
    for (const letter of letters) {
      await wait(this.delay);
      this.element.append(letter);
    }
  }
}
