import { Rendering } from "../util/rendering.js";
import { Typing } from "../util/typing.js";
import { QuoteElement, WebElement } from "../util/web_element.js";

export class Quote {
  constructor(quote) {
    this.quote = quote;

    this.show();
    this.quoteText = new WebElement(".quote--text").get();
    this.typing = new Typing(this.quoteText, this.quote);
    this.renderText();
  }

  show() {
    new Rendering(new WebElement("main").get(), QuoteElement.get()).dom();
  }

  async renderText() {
    await this.typing.do();
  }
}
