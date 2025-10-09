import { IDisposable } from "./IDisposable";
export declare class Disposables implements IDisposable {
    private readonly disposables;
    constructor(disposables?: IDisposable[]);
    add(disposable: IDisposable): void;
    dispose(): void;
}
//# sourceMappingURL=Disposables.d.ts.map