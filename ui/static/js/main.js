import { LiveReload } from "./util/live_reload.js";
import { RouteHandlers } from "./routeHandlers.js";
import { Routes } from "./routes.js";
import { Routing } from "./util/routing.js";
import { UserStorage } from "./util/user_storage.js";
import { Theme } from "./component/theme.js";
import { Daemon } from "./daemon.js";
import { Navigation } from "./component/navigation.js";
import { ScrollUp } from "./component/scroll_up.js";
import { ButtonClickedSound } from "./util/sound.js";
import { LevelBadge } from "./component/level_badge.js";
import { WebElement } from "./util/web_element.js";
import { Name } from "./component/name.js";


class Main {
  constructor(userStorage = new UserStorage()) {
    this.userStorage = userStorage;
  }

  async run() {
    await this.userStorage.load();
    console.log(this.userStorage)
    const user = this.userStorage.user;
    new Navigation(user, ButtonClickedSound(user.settings.muted)).listen();
    new LevelBadge(new WebElement("#level--badge").get(), user.level());
    new ScrollUp(ButtonClickedSound(user.settings.muted));
    new Name(new WebElement("#name--badge").get(), user.name)
    new Theme(user.settings.dark).apply();
    new Routing(Routes, RouteHandlers, this.userStorage).start();
  }
}
new Main().run();
new LiveReload();
//new Daemon().start();
