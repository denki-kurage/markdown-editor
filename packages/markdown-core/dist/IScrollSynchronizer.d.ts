import { IDisposable } from "./component-model";
export interface IScrollSynchronizer {
    scroll(lineNumber: number): void;
    addScrollEventListener(scrolled: (lineNumber: number) => void): IDisposable;
}
//# sourceMappingURL=IScrollSynchronizer.d.ts.map