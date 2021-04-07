import { Requesting } from "./utils/requesting.js";
import { WebElement } from "./utils/web_element.js";

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
    }

    listen() {
        this.statisticsBtn.addEventListener("click", () => this.onStatisticsClick());
    }

    async onStatisticsClick() {
        const content = await new Requesting(routes.Statistics, JSON.stringify(this.user), contentTypes.Json).post();
        console.log(content)
    }
}