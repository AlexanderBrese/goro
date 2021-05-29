import { WebElement } from "./web_element.js";
import { User } from "../model/user.js";

export class Import {
  constructor(userStorage) {
    this.element = new WebElement("#import").get();
    this.element.addEventListener("change", () => this.upload());
    this.userStorage = userStorage;
  }

  async upload() {
    const file = this.element.files[0];
    const date = file.name.split("-")[1].split(".")[0].replace(/_/g,"/");
    const text = await file.text();
    let user = this.userStorage.deserialize(text);
    user = new User(user.name, user.settings, user.sessions);
    this.userStorage.importUser(date, user);
    window.location.reload()
  }
}
