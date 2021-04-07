import { LiveReload } from "./utils/live_reload.js";
import { UserStorage } from "./user_storage.js";

import { Goro } from "./goro.js";
import { AutoCompletion } from "./utils/autocompletion.js";

class Main {
  constructor(userStorage = new UserStorage()) {
    this.userStorage = userStorage;
  }

  async main() {
    const user = await this.userStorage.load();
    console.log(user);
    const tasks = await this.userStorage.loadTasks();
    const goro = new Goro(
      user,
      this.userStorage,
      this.eventSystem,
      new AutoCompletion(tasks)
    );

    if (user.hasOngoingSession()) {
      goro.init();
    } else {
      goro.start();
    }
  }
}
new Main().main();
new LiveReload();
