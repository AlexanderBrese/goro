import { LiveReload } from "./live_reload.js";
import { UserStorage } from "./user_storage.js";
import { DefaultEventSystem } from "./event_system.js";
import { Goro } from "./goro.js";

class Main {
  constructor(
    userStorage = new UserStorage(),
    eventSystem = DefaultEventSystem()
  ) {
    this.userStorage = userStorage;
    this.eventSystem = eventSystem;
  }

  async main() {
    const user = await this.userStorage.load();
    console.log(user);
    const goro = new Goro(user, this.userStorage, this.eventSystem);

    if (user.hasOngoingSession()) {
      goro.init();
    } else {
      goro.start();
    }
  }
}
new Main().main();
new LiveReload();
