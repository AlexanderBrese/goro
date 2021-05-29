import { WebElement } from "../util/web_element.js";
import { Typing } from "../util/typing.js";

export class Greeting {
  constructor() {
    this.greeting = new WebElement(".greeting").get();
    this.greetingText = new WebElement(".greeting--text").get();
    this.greeting.classList.remove("hidden");
    this.typing = new Typing(this.greetingText, this.greetingText.textContent);
  }

  async type() {
    await this.typing.do();
  }
}
