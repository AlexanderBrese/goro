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
      (this.currentSession().completedPomodoros().length /
        this.settings.dailyGoal) *
      100
    );
  }

  level() {
    let exp = 0;
    this.sessions.forEach((session) => {
      if (session.completed) {
        exp += 100;
      }
      session.pomodoros
        .filter((pomodoro) => pomodoro.completed())
        .forEach((pomodoro) => {
          if (pomodoro.duration < 25) {
            exp += 10;
          } else if (pomodoro.duration >= 25) {
            exp += 25;
          } else if (pomodoro.duration >= 50) {
            exp += 50;
          } else if (pomodoro.duration >= 100) {
            exp += 100;
          }
        });
    });
    return this.levelFromExperience(exp);
  }

  levelFromExperience(exp) {
    const level = Math.floor(Math.floor(25 + Math.sqrt(625 + 100 * exp)) / 50);
    return level > 100 ? 100 : level;
  }
}

export function DefaultUser() {
  return new User();
}
