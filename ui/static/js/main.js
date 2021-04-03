import { Sync } from "./sync.js";
import { Start } from "./start.js";
import { Task } from "./task.js";
import { Storage } from "./storage.js";
import { DefaultEventSystem, Events } from "./event_system.js";

class Main {
  constructor(storage = new Storage(), eventSystem = DefaultEventSystem()) {
    this.storage = storage;
    this.eventSystem = eventSystem;
    new Start(storage.user, eventSystem).listen();

    if (storage.user.hasOngoingSession()) {
      this.listen();
    } else {
      this.onNewSession();
    }
  }

  onNewSession() {
    this.eventSystem.listen(Events.NEW_SESSION, () => {
      this.storage.newSession()
      this.listen();
    });
  }

  listen() {
    new Task(this.storage.user.currentPomodoro()).listen();
  }
}
new Main();
new Sync();
