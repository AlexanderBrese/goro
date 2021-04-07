import { WebElement, MainElement, NewCongratulations } from "./utils/web_element.js";
import { Rendering } from "./utils/rendering.js";

export class Congratulations {
  constructor(sessionProgress) {
    new Rendering(MainElement, NewCongratulations.get()).dom();
    if (sessionProgress == 100) {
      this.showStar(".congratulations--star-4");
    }
    if (sessionProgress >= 75) {
      this.showStar(".congratulations--star-3");
    }
    if (sessionProgress >= 50) {
      this.showStar(".congratulations--star-2");
    }
    if (sessionProgress >= 25) {
      this.showStar(".congratulations--star-1");
    }
  }

  showStar(el) {
    new WebElement(el).get().classList.remove("is-empty");
  }
}