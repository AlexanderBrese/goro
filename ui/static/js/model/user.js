import { DefaultSettings } from "./settings.js";
import { Session } from "./pomodoro.js";

export class User {
  constructor(name = "Anon", settings = DefaultSettings(), sessions = []) {
    this.name = name;
    this.settings = settings;
    this.sessions = sessions;
  }

  newSession() {
    const s = new Session(
      this.settings.smallPause,
      this.settings.pause,
      this.settings.duration
    );
    this.sessions.push(s);
  }

  changeName(name) {
    this.name = name;
  }

  changeSettings(settings) {
    this.settings = settings;
  }

  currentSession() {
    return this.sessions.filter((session) => session.isCurrent).pop();
  }

  currentPomodoro() {
    return this.currentSession().currentPomodoro();
  }

  hasOngoingSession() {
    return this.currentSession() !== undefined;
  }

  isSmallPause() {
    return this.currentSession().pomodoros.length % 2 !== 0;
  }

  currentProgress() {
    return (
      this.currentSession().completedPomodoros().length /
      this.settings.dailyGoal * 100
    );
  }
}

export function DefaultUser() {
  return new User();
}
