import { IDisposable } from "./IDisposable";
interface IMethodSelector<TEvent> {
    select(selector: (obj: Partial<TEvent>) => any): any;
}
export declare class EventCollection<TEvent> implements IMethodSelector<TEvent> {
    private events;
    add(e: Partial<TEvent>): IDisposable;
    remove(e: Partial<TEvent>): void;
    deliver(callback: (p: IMethodSelector<TEvent>) => TEvent): TEvent;
    select(selector: (obj: Partial<TEvent>) => any): any;
}
export {};
//# sourceMappingURL=EventCollection.d.ts.map