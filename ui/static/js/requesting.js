export class Requesting {
    constructor(url, body = "", contentType = "",) {
        this.contentType = contentType
        this.url = url
        this.body = body
    }

    async send(request) {
        try {
            return await fetch(request)
        } catch (err) {
            console.error('error: ', err)
        }
    }

    async post() {
        let contentType = this.contentType === "" ? "application/json" : this.contentType
        const request = new Request(this.url, {
            method: 'POST',
            body: JSON.stringify(this.body),
            headers: {
                'Content-Type': contentType
            }
        })
        return await this.send(request)
    }

    async get() {
        let contentType = this.contentType === "" ? "text/html" : this.contentType
        const request = new Request(this.url, {
            method: 'GET',
            headers: {
                'Content-Type': contentType
            }
        })
        return await this.send(request)
    }
}