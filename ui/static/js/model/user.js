import { DefaultSettings } from "./settings.js";
import { Session, Pomodoro } from "./pomodoro.js";

export class User {
  constructor(name = "Joe", settings = DefaultSettings(), sessions = []) {
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
    s.newPomodoro(new Pomodoro())
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
}

export function DefaultUser() {
  return new User();
}
