import { User, DefaultUser } from "./model/user.js";
import { Settings } from "./model/settings.js";
import { Break, Pomodoro, Session } from "./model/pomodoro.js";

const StorageKey = new Date().toLocaleDateString();

export class UserStorage {
  newSession() {
    this.user.newSession();
    this.store();
  }

  newPomodoro() {
    this.user.currentSession().newPomodoro();
    this.store();
  }

  store() {
    localforage.setItem(StorageKey, this.serialize(this.user));
  }

  async load() {
    let u = await localforage.getItem(StorageKey);
    if (!u || u === "undefined") {
      this.user = DefaultUser();
      return this.user;
    }

    u = this.deserialize(u);

    this.user = new User(u.name, u.settings, u.sessions);
    return this.user;
  }

  deserialize(user) {
    let d = JSON.parse(user, (key, value) => {
      if (key === "startDate" || key === "completionDate") {
        return new Date(value);
      }
      return value;
    });

    d.settings.__proto__ = Settings.prototype;
    d.sessions = d.sessions.map((session) => {
      session.__proto__ = Session.prototype;
      session.pomodoros = session.pomodoros.map((pomodoro) => {
        pomodoro["paused"] = true;
        pomodoro.__proto__ = Pomodoro.prototype;
        pomodoro.breaks.map((_break) => {
          _break.__proto__ = Break.prototype;
          return _break;
        });
        return pomodoro;
      });
      return session;
    });

    return d;
  }

  serialize(user) {
    return JSON.stringify(user);
  }
}
