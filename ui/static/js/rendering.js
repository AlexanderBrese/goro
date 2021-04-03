export const RenderingTypes = {
    APPEND: 'beforeend'
}

export class Rendering {
    constructor(webElement, content, method = RenderingTypes.APPEND) {
        this.element = webElement.parsed()
        this.content = content
        this.method = method
    }

    start() {
        this.element.insertAdjacentHTML(this.method, this.content)
    }
    
}