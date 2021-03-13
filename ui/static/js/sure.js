export class Sure {
    constructor(store) {
        let sureBtn = document.getElementById("sure")
        sureBtn.onclick = () => this.onClick(store, sureBtn)
    }

    onClick(store, sureBtn) {
        console.log('clicked')
        store.newSession()
        sureBtn.classList.remove("is-empty")
        sureBtn.onclick = null
    }
}