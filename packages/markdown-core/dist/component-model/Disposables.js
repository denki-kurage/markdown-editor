export class Disposables {
    disposables;
    constructor(disposables = []) {
        this.disposables = disposables;
    }
    add(disposable) {
        this.disposables.push(disposable);
    }
    dispose() {
        for (const disposable of this.disposables) {
            disposable.dispose();
        }
        this.disposables.splice(0);
    }
}
//# sourceMappingURL=Disposables.js.map