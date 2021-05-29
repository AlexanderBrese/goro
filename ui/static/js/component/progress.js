import { Counting } from "../util/counting.js";
import { WebElement } from "../util/web_element.js";

export class Progress {
  constructor(
    currentPomodoro,
    duration,
    dispatch,
    pomodoroFinishedSound,
    buttonClickedSound,
    timeText = new WebElement(".progress--time"),
    progressBar = new WebElement(".progress--bar"),
    resumeBtn = new WebElement(".progress--resume"),
    finishBtn = new WebElement(".progress--finish")
  ) {
    this.duration = duration;
    this.currentPomodoro = currentPomodoro;
    this.pomodoroFinishedSound = pomodoroFinishedSound;
    this.buttonClickedSound = buttonClickedSound;
    this.dispatch = dispatch;
    this.counting = new Counting(
      duration,
      (elapsed) => this.onChange(elapsed),
      () => this.onFinishCounting()
    );
    this.timeText = timeText.get();
    this.progressBar = progressBar.get();
    this.progressBar.max = duration;
    this.resumeBtn = resumeBtn.get();
    this.finishBtn = finishBtn.get();
  }

  update() {
    this.onChange(this.duration * 60);
    this.removeButtons();
  }

  listen() {
    this.resumeBtn.addEventListener("click", () => this.onResume());
    this.finishBtn.addEventListener("click", () => this.onFinish());
  }

  onResume() {
    this.buttonClickedSound.play();
    if (this.currentPomodoro.paused) {
      this.currentPomodoro.resume();
      this.counting.resume();
      this.resumeBtn.textContent = "Pause";
      this.resumeBtn.classList.remove("is-error");
      this.resumeBtn.classList.add("is-warning");
    } else {
      this.currentPomodoro.pause();
      this.counting.pause();
      this.resumeBtn.textContent = "Resume";
      this.resumeBtn.classList.remove("is-warning");
      this.resumeBtn.classList.add("is-error");
    }
  }

  onChange(elapsed) {
    const elapsedMinutes = elapsed / 60;

    if (elapsedMinutes > 0) {
      this.updateText(Math.floor(elapsedMinutes));
    }
    this.updateProgressBar(elapsedMinutes);
  }

  updateText(elapsedMinutes) {
    if (elapsedMinutes === 1) {
      this.timeText.textContent = this.timeText.textContent.replace(
        "Minutes",
        "Minute"
      );
    } else if (this.timeText.textContent.match(/.*Minute$/)) {
      this.timeText.textContent = this.timeText.textContent.replace(
        "Minute",
        "Minutes"
      );
    }
    this.timeText.textContent = this.timeText.textContent.replace(
      /\d/,
      elapsedMinutes
    );
  }

  updateProgressBar(elapsedMinutes) {
    this.progressBar.value = elapsedMinutes;
    const progress = Math.floor(
      (this.progressBar.value / this.progressBar.max) * 100
    );
    const classes = this.progressBar.classList;
    if (progress > 25 && progress <= 50 && !classes.contains("is-warning")) {
      classes.remove("is-error");
      classes.add("is-warning");
    } else if (
      progress > 90 &&
      progress <= 100 &&
      !classes.contains("is-success")
    ) {
      classes.remove("is-warning");
      classes.remove("is-error");
      classes.add("is-success");
    }
  }

  onFinish() {
    this.buttonClickedSound.play();
    this.counting.finish();
    this.updateProgressBar(this.duration);
  }

  onFinishCounting() {
    this.currentPomodoro.complete();
    this.pomodoroFinishedSound.play();
    this.removeButtons();
    this.dispatch();
  }

  removeButtons() {
    this.resumeBtn.classList.add("hidden");
    this.finishBtn.classList.add("hidden");
  }
}
