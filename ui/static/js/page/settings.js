import { Theme } from "../component/theme.js";
import { SettingsChangedSound } from "../util/sound.js";
import { WebElement } from "../util/web_element.js";

export class Settings {
  constructor(userStorage) {
    this.userStorage = userStorage;
  }

  start() {
    const settings = Object.keys(this.userStorage.user.settings);
    for (const setting of settings) {
      const element = new WebElement(`#${setting}`).get();
      this.init(element, setting);
      this.listen(element, setting);
    }
  }

  init(element, setting) {
    const value = this.userStorage.user.settings[setting];
    switch (setting) {
      case "dark":
        if (value) {
          new Theme(true).apply();
        }
      case "muted":
      case "notification":
        element.checked = value;
        break;
      case "sound":
        this.select(element, value);
        break;
      default:
        element.value = value;
        break;
    }
  }

  select(element, value) {
    const options = element.options;
    for (let option, i = 0; (option = options[i]); i++) {
      if (option.value === value) {
        element.selectedIndex = i;
        return;
      }
    }
  }

  listen(element, setting) {
    let event, func;

    switch (setting) {
      case "dark":
        event = "click";
        func = (ev) => {
          SettingsChangedSound.play();
          new Theme(ev.target.checked).apply();
          this.userStorage.toggleSetting(setting);
        };
        break;
      case "muted":
      case "notification":
        event = "click";
        func = () => {
          SettingsChangedSound.play();
          this.userStorage.toggleSetting(setting);
        };
        break;
      case "sound":
        event = "change";
        func = (ev) => {
          SettingsChangedSound.play();
          this.userStorage.changeSetting(setting, ev.target.value);
        };
        break;
      default:
        event = "input";
        func = (ev) => {
          SettingsChangedSound.play();
          this.userStorage.changeSetting(setting, ev.target.value);
        };
        break;
    }

    element.addEventListener(event, func);
  }
}
