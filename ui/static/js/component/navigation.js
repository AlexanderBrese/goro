import { Requesting } from "../util/requesting.js";
import { ButtonClickedSound } from "../util/sound.js";
import { WebElement } from "../util/web_element.js";
import { wait } from "../util/wait.js";

const routes = {
    Statistics: '/statistics',
}

const contentTypes = {
    Json: "application/json"
}

export class Navigation {
    constructor(user) {
        this.user = user
        this.statisticsBtn = new WebElement("#statistics").get()
        this.settingsBtn = new WebElement("#settings").get()
    }

    listen() {
        this.settingsBtn.addEventListener("click", async () => await this.onSettingsClick())
        this.statisticsBtn.addEventListener("click", () => this.onStatisticsClick());
    }

    async onStatisticsClick() {
        const content = await new Requesting(routes.Statistics, JSON.stringify(this.user), contentTypes.Json).post();
        console.log(content)
    }

    async onSettingsClick() {
        await ButtonClickedSound.play()
        await wait(100)
        window.location.replace("/settings")
    }
}