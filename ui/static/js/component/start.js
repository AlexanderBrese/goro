import { ButtonClickedSound } from "../util/sound.js";
import { WebElement } from "../util/web_element.js";

export class Start {
  constructor(user, dispatch) {
    this.user = user;
    this.dispatch = dispatch;
    this.btn = new WebElement("#sure").get();
    this.click = function() {
      this.onClick()
    }.bind(this)
  }

  listen() {
    if (this.user.hasOngoingSession()) {
      this.disable();
    } else {
      this.btn.addEventListener("click", this.click);
    }
  }

  onClick() {
    ButtonClickedSound.play()
    this.disable();
    this.dispatch();
  }

  disable() {
    this.btn.classList.remove("is-empty");
    this.btn.onclick = null;
    this.btn.removeEventListener("click", this.click)
  }
}
