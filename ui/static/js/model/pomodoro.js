export class Session {
  constructor(
    smallPause = 5,
    pause = 10,
    duration = 25,
    startDate = new Date(),
    pomodoros = []
  ) {
    this.pomodoros = pomodoros;
    this.pause = pause;
    this.startDate = startDate;
    this.smallPause = smallPause;
    this.duration = duration;
  }

  changeCompletionDate(completionDate) {
    this.completionDate = completionDate;
  }

  newPomodoro(pomodoro) {
    this.pomodoros.push(pomodoro);
  }

  changePomodoro(pomodoro, newPomodoro) {
    this.pomodoros.map((p) => (p.id === pomodoro.id ? newPomodoro : p));
  }

  currentPomodoro() {
    return this.pomodoros[this.pomodoros.length - 1];
  }

  isCurrent() {
    const currentDate = new Date();
    return (
      currentDate.getDate() === this.startDate.getDate() &&
      currentDate.getMonth() === this.startDate.getMonth() &&
      currentDate.getFullYear() === this.startDate.getFullYear()
    );
  }
}

export class Pomodoro {
  constructor(
    id,
    task = "Work",
    paused = true,
    breaks = [],
    startDate = new Date(),
    feltProductive = false
  ) {
    this.id = id;
    this.task = task;
    this.paused = paused;
    this.startDate = startDate;
    this.breaks = breaks;
    this.feltProductive = feltProductive;
  }

  pause() {
    this.paused = true;
    this.newBreak()
  }

  resume() {
    this.paused = false;
    this.breaks[this.breaks.length - 1].complete()
  }

  completed() {
    return this.completionDate !== undefined;
  }

  changeTask(task) {
    this.task = task;
  }

  changeCompletionDate(completionDate) {
    this.completionDate = completionDate;
  }

  changeFeltProductive(feltProductive) {
    this.feltProductive = feltProductive;
  }

  newBreak() {
    this.breaks.push(new Break());
  }
}

export class Break {
  construct() {
    this.startDate = new Date()
    this.completionDate = this.startDate
  }

  complete() {
    this.completionDate = new Date()
  }

  duration() {
    this.completionDate - this.startDate
  }
}
