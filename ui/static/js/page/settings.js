import { Theme } from "../component/theme.js";
import { SettingsChangedSound } from "../util/sound.js";
import { WebElement } from "../util/web_element.js";
import { Export } from "../util/export.js";
import { Import } from "../util/import.js";


export class Settings {
  constructor(userStorage) {
    this.userStorage = userStorage;
    this.settings = userStorage.user.settings;

    new Export(this.userStorage.user)
    new Import(this.userStorage)
  }

  start() {
    const level = this.userStorage.user.level();
    
    new WebElement("#level--text").get().textContent = level;
    new WebElement("#level").get().value = level;
    const settings = Object.keys(this.settings);
    for (const setting of settings) {
      const element = new WebElement(`#${setting}`).get();
      this.init(element, setting);
      this.listen(element, setting);
    }
    const name = this.userStorage.user.name;
    new WebElement("#name").get().value = name;
  }

  init(element, setting) {
    const value = this.settings[setting];
    switch (setting) {
      case "dark":
        element.checked = value;
        break;
      case "muted":
        element.checked = !value;
        break;
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
          SettingsChangedSound(this.settings.muted).play();
          new Theme(ev.target.checked).apply();
          this.userStorage.toggleSetting(setting);
        };
        break;
      case "muted":
        event = "click";
        func = () => {
          SettingsChangedSound(!this.settings.muted).play();
          this.userStorage.toggleSetting(setting);
        };
        break;
      case "notification":
        event = "click";
        func = () => {
          SettingsChangedSound(this.settings.muted).play();
          this.userStorage.toggleSetting(setting);
        };
        break;
      case "sound":
        event = "change";
        func = (ev) => {
          SettingsChangedSound(this.settings.muted).play();
          this.userStorage.changeSetting(setting, ev.target.value);
        };
        break;
      default:
        event = "input";
        func = (ev) => {
          SettingsChangedSound(this.settings.muted).play();
          this.userStorage.changeSetting(setting, ev.target.value);
        };
        break;
    }

    element.addEventListener(event, func);
    new WebElement("#name").get().addEventListener("input", (ev) => {
      this.userStorage.changeName(ev.target.value);
    });
  }
}
