export class Requesting {
    constructor(url, body = "", contentType = "text/html",) {
        this.contentType = contentType
        this.url = url
        this.body = body
    }

    async post() {
        return await this.request('POST')
    }

    async get() {
        return await this.request('GET')
    }

    async request(method) {
        const request = new Request(this.url, {
            method: method,
            body: JSON.stringify(this.body),
            headers: {
                'Content-Type': this.contentType
            }
        })
        return (await this.send(request)).text()
    }

    async send(request) {
        try {
            return await fetch(request)
        } catch (err) {
            console.error('error: ', err)
        }
    }
}