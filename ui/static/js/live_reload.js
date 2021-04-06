export class LiveReload {
    constructor(port = 3000, route = '/sync', tryTimeout = 2000) {
        this.port = port
        this.route = route
        this.tryTimeout = tryTimeout
        this.tryConnect()
    }

    tryConnect() {
        try {
            if (window["WebSocket"]) {
                this.connect()
            } else {
                console.log("Your browser does not support WebSocket, cannot connect to the reload service.");
            }
        } catch (ex) {
            console.log('Exception during connecting to reload:', ex);
        }
    }

    connect() {
        this.conn = new WebSocket(`ws://localhost:${this.port}${this.route}`)
        this.conn.onclose = this.onClose
        this.conn.onmessage = this.onMessage
    }


    onClose() {
        setTimeout(this.tryConnect, this.tryTimeout);
    }

    onMessage() {
        location.reload()
    }
}