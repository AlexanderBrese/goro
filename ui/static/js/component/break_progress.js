import { WebElement } from "../util/web_element.js";
import { Counting } from "../util/counting.js";
import { BreakFinishedSound } from "../util/sound.js";

export class BreakProgress {
  constructor(
    duration,
    dispatch,
    progressBar = new WebElement(".break--progress"),
    progressTitle = new WebElement(".break--title")
  ) {
    this.duration = duration;
    this.dispatch = dispatch;
    this.progressBar = progressBar.get();
    this.progressBar.value = 0.1;
    this.progressBar.max = duration;
    this.progressTitle = progressTitle.get();
    this.progressTitle.textContent += " " + duration + " Minutes";
    this.counting = new Counting(
      duration,
      (elapsed) => this.onChange(elapsed),
      () => this.onFinish()
    );
  }

  start() {
    this.counting.resume();
  }

  update() {
    this.onChange(this.duration * 60);
  }

  // TODO: Refactor -> ProgressBar
  onChange(elapsed) {
    const elapsedMinutes = Math.floor(elapsed / 60);
    if (elapsedMinutes > 0) {
      this.updateProgressBar(elapsedMinutes);
    }
  }

  onFinish() {
    BreakFinishedSound.play()
    this.dispatch();
  }

  updateProgressBar(elapsedMinutes) {
    this.progressBar.value = elapsedMinutes;
  }
}
