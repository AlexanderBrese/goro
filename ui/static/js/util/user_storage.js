import { User, DefaultUser } from "../model/user.js";
import { DefaultSettings, Settings } from "../model/settings.js";
import { Break, Pomodoro, Session } from "../model/pomodoro.js";

const UserStorageKey = new Date().toLocaleDateString();
const SettingsStorageKey = "settings";

export class UserStorage {
  newSession() {
    this.user.newSession();
    this.store();
  }

  newPomodoro() {
    this.user.currentSession().newPomodoro();
    this.store();
  }

  newQuotedPomodoro(quote) {
    this.user.currentSession().newPomodoro();
    this.user.currentPomodoro().quote = quote;
    this.store();
  }

  toggleSetting(setting) {
    this.user.settings.toggleSetting(setting);
    this.store();
  }

  changeSetting(setting, value) {
    this.user.settings.changeSetting(setting, value);
    this.store();
  }

  changeName(name) {
    this.user.name = name;
    this.store();
  }

  store() {
    this.storeUser();
    this.storeSettings();
  }

  importUser(key, user) {
    this.storeUser(key, user)
    this.user = user
    this.storeSettings()
  }

  storeUser(key = UserStorageKey, user = this.user) {
    localforage.setItem(key, this.serialize(user));
  }

  storeSettings() {
    localforage.setItem(SettingsStorageKey, this.serialize(this.user.settings));
  }

  async loadTasks() {
    this.tasks = new Map();
    await localforage.iterate((v, k) => {
      if (k === SettingsStorageKey) return;
      JSON.parse(v).sessions.forEach((session) =>
        session.pomodoros.forEach((pom) => {
          if (pom.task !== "") {
            const taskCount = this.tasks.get(pom.task);
            if (taskCount !== undefined) {
              this.tasks.set(pom.task, taskCount + 1);
            } else {
              this.tasks.set(pom.task, 1);
            }
          }
        })
      );
    });
    // sort by value
    this.tasks = new Map([...this.tasks.entries()].sort((a, b) => b[1] - a[1]));
  }

  async loadUser(settings) {
    let u = await localforage.getItem(UserStorageKey);
    if (!u || u === "undefined") {
      this.user = DefaultUser();
      return this.user;
    }

    u = this.deserialize(u);
    this.user = new User(u.name, settings, u.sessions);
  }

  async loadSettings() {
    let s = await localforage.getItem(SettingsStorageKey);
    if (!s) {
      s = DefaultSettings();
    } else {
      s = JSON.parse(s);
      s.__proto__ = Settings.prototype;
    }

    return s;
  }

  async load() {
    const settings = await this.loadSettings();
    await this.loadUser(settings);
    await this.loadTasks();
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
