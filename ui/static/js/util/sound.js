export class Sound {
  constructor(file) {
    this.audio = new Audio(`/static/sound/${file}`);
  }

  async play() {
    await this.audio.play();
  }
}

export const BreakFinishedSound = new Sound("goes-without-saying-608.ogg");
export const ButtonClickedSound = new Sound("base-403.ogg");
export const SettingsChangedSound = new Sound("tweet-416.ogg");
