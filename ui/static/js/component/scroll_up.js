import { Scrolling } from "../util/scrolling.js";
import { WebElement } from "../util/web_element.js";
export class ScrollUp {
  constructor(buttonClickedSound) {
    this.lastScrollTop = 0;
    this.buttonClickedSound = buttonClickedSound;
    this.scrollUpBtn = new WebElement("#scroll-up").get();
    this.scrollUpBtn.addEventListener("click", () => this.do());
    
    this.listen()
  }

  listen() {
    window.addEventListener(
      "scroll",
      () => {
        var st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > this.lastScrollTop) {
          this.show();
        } else {
          this.hide();
        }
        this.lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
      },
      { passive: true }
    );
  }

  do() {
    this.buttonClickedSound.play();
    new Scrolling("body").do();
  }

  show() {
    this.scrollUpBtn.classList.add("active");
  }

  hide() {
    this.scrollUpBtn.classList.remove("active");
  }
}
