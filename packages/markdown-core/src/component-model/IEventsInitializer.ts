import { IDisposable } from "./IDisposable";

export interface IEventsInitializer<TEvents>
{
	initializeEvents(events: TEvents): IDisposable;
}

