import {
  WebElement,
  MainElement,
  NewCongratulations,
} from "../util/web_element.js";
import { Rendering } from "../util/rendering.js";
import { wait } from "../util/wait.js";

export class Congratulations {
  constructor(sessionProgress) {
    this.sessionProgress = sessionProgress;
  }

  async show() {
    this.render();
    await this.showStars();
  }

  async showStars() {
    if (this.sessionProgress >= 25) {
      await this.showStar(".congratulations--star-1");
    }
    if (this.sessionProgress >= 50) {
      await this.showStar(".congratulations--star-2");
    }
    if (this.sessionProgress >= 75) {
      await this.showStar(".congratulations--star-3");
    }
    if (this.sessionProgress == 100) {
      await this.showStar(".congratulations--star-4");
    }
  }

  async showStar(id) {
    const element = new WebElement(id).get();
    await wait(600);
    element.classList.remove("is-empty");
    element.classList.add("scaleInOut");
  }

  render() {
    new Rendering(MainElement, NewCongratulations.get()).dom();
  }
}
