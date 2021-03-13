import { User, DefaultUser } from "./model/user.js";
import { Requesting } from "./requesting.js";

function RetrieveUser() {
    let u = localStorage.getItem("user")
    if (!u) {
        return DefaultUser()
    }
    u = JSON.parse(u)
    return new User(u.name, u.settings, u.sessions)
}

export class Store {
    constructor(user = RetrieveUser()) {
        this.user = user
    }
    async newSession() {
        console.log(this.user)
        this.user.newSession()
        this.updateLocalStorage()

        const res = await new Requesting("/newSession", "", "").post()
        console.log(res)
    }

    updateLocalStorage() {
        localStorage.setItem('user', JSON.stringify(this.user))
    }
}

