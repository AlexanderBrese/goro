export class Session {
    constructor(smallPause = 5, pause = 10, duration = 25, completionDate = new Date(), pomodoros = []) {
        this.pomodoros = pomodoros
        this.completionDate = completionDate
        this.pause = pause
        this.smallPause = smallPause
        this.duration = duration
    }

    changeCompletionDate(completionDate) {
        this.completionDate = completionDate
    }

    newPomodoro(pomodoro) {
        this.pomodoros.push(pomodoro)
    }

    changePomodoro(pomodoro, newPomodoro) {
        this.pomodoros.map(p => p.id === pomodoro.id ? newPomodoro : p)
    }
}

export class Pomodoro {
    constructor(id, description = "", paused = true, duration = 0, breaks = [], completionDate = new Date(), feltProductive = false) {
        this.id = id
        this.description = description
        this.paused = paused
        this.duration = duration
        this.breaks = breaks
        this.completionDate = completionDate
        this.feltProductive = feltProductive
    }

    pause() {
        this.paused = true
    }

    resume() {
        this.paused = false
    }

    changeDescription(description) {
        this.description = description
    }

    changeCompletionDate(completionDate) {
        this.completionDate = completionDate
    }

    changeDuration(duration) {
        this.duration = duration
    }

    changeFeltProductive(feltProductive) {
        this.feltProductive = feltProductive
    }

    newBreak(duration) {
        this.breaks.push(Break(duration))
    }
}

export class Break {
    construct(duration) {
        this.duration = duration
    }
}