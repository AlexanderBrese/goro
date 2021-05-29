import { Requesting } from "../util/requesting.js";
import { WebElement } from "../util/web_element.js";
import { wait } from "../util/wait.js";

const contentTypes = {
  Json: "application/json",
};

export class Navigation {
  constructor(user, buttonClickedSound) {
    this.buttonClickedSound = buttonClickedSound;
    this.user = user;
    this.statisticsBtn = new WebElement("#statistics").get();
    this.settingsBtn = new WebElement("#settings").get();
  }

  listen() {
    this.settingsBtn.addEventListener(
      "click",
      async () => await this.onSettingsClick()
    );
    
    this.statisticsBtn.addEventListener("click", () =>
      this.onStatisticsClick()
    );
    
  }

  async onStatisticsClick() {
    /*
    const content = await new Requesting(
      routes.Statistics,
      JSON.stringify(this.user),
      contentTypes.Json
    ).post();
    */
    await this.buttonClickedSound.play();
  }

  async onSettingsClick() {
    await this.buttonClickedSound.play();
    await wait(150);
    window.location.replace("/settings");
  }
}
