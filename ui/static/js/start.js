import { Rendering } from "./rendering.js";
import { WebElement } from "./web_element.js";
import { Requesting } from "./requesting.js";
import { Events } from "./event_system.js";

export class Start {
  constructor(user, eventSystem) {
    this.user = user;
    this.eventSystem = eventSystem;
    this.btn = new WebElement("#sure").parsed();
  }

  listen() {
    if (this.user.hasOngoingSession()) {
      this.disable();
    } else {
      this.btn.addEventListener("click", () => this.onClick());
    }
  }

  async onClick() {
    this.disable();

    const content = await new Requesting("/newSession").post();
    new Rendering(new WebElement("main"), content).start();

    this.eventSystem.dispatch(Events.NEW_SESSION);
  }

  disable() {
    this.btn.classList.remove("is-empty");
    this.btn.onclick = null;
  }
}
