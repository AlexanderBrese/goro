export class Sound {
  constructor(file, muted = false) {
    this.audio = new Audio(`/static/sound/${file}`);
    if (muted) {
      this.mute();
    } else {
      this.unmute();
    }
  }

  mute() {
    this.audio.muted = true;
  }

  unmute() {
    this.audio.muted = false;
  }

  async play() {
    await this.audio.play();
  }
}

export const BreakFinishedSound = (muted) =>
  new Sound("goes-without-saying-608.ogg", muted);
export const ButtonClickedSound = (muted) => new Sound("base-403.ogg", muted);
export const SettingsChangedSound = (muted) =>
  new Sound("tweet-416.ogg", muted);
