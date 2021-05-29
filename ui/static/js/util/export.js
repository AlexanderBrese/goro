import { WebElement } from "../util/web_element.js";

export class Export {
  constructor(user) {
    this.user = user;
    this.filename = `${user.name}-${new Date().toLocaleDateString()}.json`;
    new WebElement("#export").get().addEventListener("click", () => this.export());
  }

  export() {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," +
        encodeURIComponent(JSON.stringify(this.user, null, 4))
    );
    element.setAttribute("download", this.filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
