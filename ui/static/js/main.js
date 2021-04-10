import { LiveReload } from "./util/live_reload.js";
import { RouteHandlers } from "./routeHandlers.js";
import { Routes } from "./routes.js";
import { Routing } from "./util/routing.js";
import { UserStorage } from "./util/user_storage.js";
import { Theme } from "./component/theme.js";
import { Daemon } from "./daemon.js";

class Main {
  constructor(userStorage = new UserStorage()) {
    this.userStorage = userStorage;
  }

  async run() {
    await this.userStorage.load();
    new Theme(this.userStorage.user.settings.dark).apply();
    new Routing(Routes, RouteHandlers, this.userStorage).start();
  }
}
new Main().run();
new LiveReload();
//new Daemon().start();
