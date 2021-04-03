import { User, DefaultUser } from "./model/user.js";

const UserKey = "user"

export class Storage {
  constructor(user = this.retrieveUser()) {
    this.user = user
    console.log(this.user)
  }

  newSession() {
    this.user.newSession();
    this.storeUser();
  }

  storeUser(user) {
    localStorage.setItem(UserKey, this.serialize(user));
  }
  
  retrieveUser() {
    let u = localStorage.getItem(UserKey);
    if (!u || u === "undefined") {
      return DefaultUser();
    }
    u = this.deserialize(u);
    return new User(u.name, u.settings, u.sessions);
  }

  // TODO: Date handling
  deserialize(user) {
    return JSON.parse(user)
  }

  // TODO: Date handling
  serialize(user) {
    return JSON.stringify(user)
  }
}
