export const RenderingTypes = {
    APPEND: 'beforeend'
}

export class Rendering {
    constructor(parent, child, method = RenderingTypes.APPEND) {
        this.parent = parent
        this.child = child
        this.method = method
    }

    html() {
        this.parent.insertAdjacentHTML(this.method, this.child)
    }

    dom() {
        const child = this.child.cloned()
        this.parent.get().appendChild(child)
        this.show(child)
    }
    
    show(node) {
        node.classList.remove("hidden")
    }
}

export function DefaultRendering() {
    return new Rendering(null, null)
}