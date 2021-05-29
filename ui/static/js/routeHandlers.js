import { Routes } from "./routes.js";

import { Home } from "./page/home.js";
import { Settings } from "./page/settings.js";

export const RouteHandlers = {
  [Routes.HOME]: (userStorage) => homeHandler(userStorage),
  [Routes.SETTINGS]: (userStorage) => settingsHandler(userStorage),
  [Routes.STATISTICS]: (userStorage) => statisticsHandler(userStorage),
};

async function homeHandler(userStorage) {
  const home = new Home(userStorage);

  if (userStorage.user.hasOngoingSession()) {
    await home.init();
  } else {
    home.start();
  }
}

function settingsHandler(userStorage) {
  new Settings(userStorage).start();
}

function statisticsHandler(userStorage) {
  
}
