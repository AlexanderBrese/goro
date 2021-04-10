import { ButtonClickedSound } from "../util/sound.js";
import { WebElement } from "../util/web_element.js";

export class Start {
  constructor(user, dispatch) {
    this.user = user;
    this.dispatch = dispatch;
    this.btn = new WebElement("#sure").get();
  }

  listen() {
    if (this.user.hasOngoingSession()) {
      this.disable();
    } else {
      this.btn.addEventListener("click", () => this.onClick());
    }
  }

  async onClick() {
    ButtonClickedSound.play()
    this.disable();
    this.dispatch();
  }

  disable() {
    this.btn.classList.remove("is-empty");
    this.btn.onclick = null;
  }
}
