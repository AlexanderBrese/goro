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

  complete(completionDate) {
    this.completionDate = completionDate;
  }

  completed() {
    return this.completionDate !== undefined;
  }

  completedPomodoros() {
    return this.pomodoros.filter((pom) => pom.completed());
  }

  newPomodoro() {
    this.pomodoros.push(new Pomodoro());
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
    task = "",
    breaks = [],
    paused = true,
    startDate = new Date(),
    feltProductive = false,
    quote = "",
  ) {
    this.paused = paused;
    this.task = task;
    this.startDate = startDate;
    this.breaks = breaks;
    this.feltProductive = feltProductive;
    this.quote = quote;
  }

  pause() {
    this.paused = true;
    this.newBreak();
  }

  resume() {
    if (this.breaks.length > 0) {
      this.breaks[this.breaks.length - 1].complete();
    }
    this.paused = false;
  }

  completed() {
    return this.completionDate !== undefined;
  }

  changeTask(task) {
    this.task = task;
  }

  complete() {
    this.paused = true;
    this.completionDate = new Date();
  }

  toggleFeedBack() {
    this.feltProductive = !this.feltProductive;
  }

  newBreak() {
    this.breaks.push(new Break());
  }

  toJSON() {
    return {
      task: this.task,
      startDate: this.startDate,
      completionDate: this.completionDate,
      breaks: this.breaks,
      feltProductive: this.feltProductive,
      quote: this.quote,
    };
  }
}

export class Break {
  construct() {
    this.startDate = new Date();
    this.completionDate = this.startDate;
  }

  complete() {
    this.completionDate = new Date();
  }

  duration() {
    this.completionDate - this.startDate;
  }
}
