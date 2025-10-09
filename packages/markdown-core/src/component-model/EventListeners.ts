import { IDisposable } from "./IDisposable";
import { IEventListener } from "./IEventListener";

export class EventListeners<T>
{
    private listeners: Array<IEventListener<T>> = [];

    public addListener(listener: IEventListener<T>): IDisposable
    {
        this.listeners.push(listener);
        return { dispose: () => this.removeListener(listener) }
    }

    public removeListener(listener: IEventListener<T>): void
    {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    public emit(value: T): void
    {
        this.listeners.forEach(listener => listener(value));
    }
}
