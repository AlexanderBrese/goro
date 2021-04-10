export class Settings {
  constructor(
    sound,
    dark,
    muted,
    notification,
    duration,
    smallPause,
    pause,
    dailyGoal
  ) {
    this.sound = sound;
    this.dark = dark;
    this.muted = muted;
    this.notification = notification;
    this.duration = duration;
    this.smallPause = smallPause;
    this.pause = pause;
    this.dailyGoal = dailyGoal;
  }

  toggleSetting(setting) {
    this[setting] = !this[setting]
  }

  changeSetting(setting, value) {
    this[setting] = value
  }
}

export function DefaultSettings() {
  return new Settings("pristine-609.ogg", false, false, true, 3, 5, 10, 4);
}
