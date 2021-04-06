export class WebElement {
  constructor(identifier, resolveOption = Options.RESOLVE_LATEST, pos = -1) {
    this.resolveOption = resolveOption;
    this.pos = pos;
    this.identifierType = identifier.charAt(0);
    if (this.identifierType === "#" || this.identifierType === ".") {
      this.identifier = identifier.substr(1);
    } else {
      this.identifier = identifier;
    }
  }

  get() {
    switch (this.identifierType) {
      case "#":
        return this.byId();
      case ".":
        return this.byClass();
      default:
        return this.byTag();
    }
  }

  cloned() {
    return this.get().cloneNode(true);
  }

  byId() {
    return document.getElementById(this.identifier);
  }

  element(els) {
    switch (this.resolveOption) {
      case Options.RESOLVE_LATEST:
        return this.lastElement(els);
      case Options.RESOLVE_OLDEST:
        return this.firstElement(els);
      case Options.RESOLVE_DEFINED:
        return els.item(this.pos);
    }
  }

  byClass() {
    return this.element(document.getElementsByClassName(this.identifier));
  }

  byTag() {
    return this.element(document.getElementsByTagName(this.identifier));
  }

  firstElement(els) {
    return els.item(0);
  }

  lastElement(els) {
    let last = els.length - 1;
    return els.item(last);
  }
}

export const Options = {
  RESOLVE_LATEST: "resolvelatest",
  RESOLVE_OLDEST: "resolveoldest",
  RESOLVE_DEFINED: "resolvedefined",
};
export const MainElement = new WebElement("main", Options.RESOLVE_OLDEST);
export const NewSessionPart = new WebElement(
  ".session--part",
  Options.RESOLVE_OLDEST
);
export const NewPomodoroElement = new WebElement(
  ".pomodoro",
  Options.RESOLVE_OLDEST
);
export const DailyGoalElement = new WebElement("#dailyGoal");
export const NewCongratulations = new WebElement(".congratulations", Options.RESOLVE_OLDEST)