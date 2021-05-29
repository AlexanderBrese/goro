import { WebElement } from "../util/web_element.js";

export class Start {
  constructor(hasOngoingSession, dispatch, buttonClickedSound) {
    this.hasOngoingSession = hasOngoingSession;
    this.dispatch = dispatch;
    this.buttonClickedSound = buttonClickedSound;
    this.btn = new WebElement("#sure").get();
    this.click = function () {
      this.onClick();
    }.bind(this);
  }

  listen() {
    if (this.hasOngoingSession) {
      this.disable();
    } else {
      this.btn.addEventListener("click", this.click);
    }
  }

  onClick() {
    this.buttonClickedSound.play();
    this.btn.classList.add("scaleInOut");
    this.disable();
    this.dispatch();
  }

  disable() {
    this.btn.classList.remove("is-empty");
    this.btn.onclick = null;
    this.btn.removeEventListener("click", this.click);
  }
}
