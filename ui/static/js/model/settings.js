export class Settings {
    constructor(sound, dark, volume, notification, duration, smallPause, pause, dailyGoal) {
        this.sound = sound
        this.dark = dark
        this.volume = volume
        this.notification = notification
        this.duration = duration
        this.smallPause = smallPause
        this.pause = pause
        this.dailyGoal = dailyGoal
    }
}

export function DefaultSettings() {
    return new Settings("default.mp3", false, 100, true, 3, 5, 10, 4)
}