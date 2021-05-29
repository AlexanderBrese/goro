export class Theme {
  constructor(dark = false) {
    this.dark = dark;
    this.containers = document.getElementsByClassName("nes-container");
    this.baloons = document.getElementsByClassName("nes-balloon");
    this.selects = document.getElementsByClassName("nes-select");
    this.inputs = document.getElementsByClassName("nes-input");
    this.checkboxes = document.getElementsByClassName("nes-checkbox");
    this.body = document.getElementsByTagName("body");
    this.header = document.getElementsByTagName("header");
    this.level = document.getElementById("level--badge")
    this.name = document.getElementById("name--badge")
  }

  apply() {
    Object.keys(this)
      .filter((key) => !["dark"].includes(key))
      .forEach((key) => {
        for (let i = 0; i < this[key].length; i++) {
          const element = this[key].item(i);
          this.applyStyle(element);
        }
      });
    if(this.dark) {
        this.level.classList.add("is-primary")
        this.level.classList.remove("is-dark")
        this.name.classList.add("is-warning")
        this.name.classList.remove("is-dark")
    } else {
        this.level.classList.add("is-dark")
        this.level.classList.remove("is-primary")
        this.name.classList.add("is-dark")
        this.name.classList.remove("is-warning")
    }
  }

  applyStyle(element) {
    if (this.dark) {
      element.classList.add("is-dark");
    } else {
      element.classList.remove("is-dark");
    }
  }
}
