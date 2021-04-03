export class WebElement {
  constructor(identifier) {
    this.identifierType = identifier.charAt(0);
    if (this.identifierType === "#" || this.identifierType === ".") {
      this.identifier = identifier.substr(1);
    } else {
      this.identifier = identifier;
    }
  }

  parsed() {
    switch (this.identifierType) {
      case "#":
        return this.byId();
      case ".":
        return this.byClass();
      default:
        return this.byTag();
    }
  }

  byId() {
    return document.getElementById(this.identifier);
  }

  byClass() {
    return this.lastElement(document.getElementsByClassName(this.identifier));
  }

  byTag() {
    return this.lastElement(document.getElementsByTagName(this.identifier));
  }

  lastElement(els) {
    let last = els.length - 1;
    return els.item(last);
  }
}
