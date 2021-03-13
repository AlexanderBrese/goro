import { DefaultSettings } from "./settings.js"
import { Session } from "./pomodoro.js"

export class User {
    constructor(name = "Joe", settings = DefaultSettings(), sessions = []) {
        this.name = name
        this.settings = settings
        this.sessions = sessions
    }

    newSession() {
        this.sessions.push(new Session(this.settings.smallPause, this.settings.pause, this.settings.duration))
    }

    changeName(name) {
        this.name = name
    }

    changeSettings(settings) {
        this.settings = settings
    }
}

export function DefaultUser() {
    return new User()
}