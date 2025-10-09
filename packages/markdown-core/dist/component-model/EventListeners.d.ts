import { IDisposable } from "./IDisposable";
import { IEventListener } from "./IEventListener";
export declare class EventListeners<T> {
    private listeners;
    addListener(listener: IEventListener<T>): IDisposable;
    removeListener(listener: IEventListener<T>): void;
    emit(value: T): void;
}
//# sourceMappingURL=EventListeners.d.ts.map