import { Sync } from "./sync.js";
import { Sure } from "./sure.js";
import { Store } from "./store.js";

class Main {
    constructor(store = new Store(), sync = new Sync() ) {
        this.sync = sync
        new Sure(store)
    }
}
const store = new Store()
console.log(store)
new Main(store)