import { ITextChanged, ISelectChanged } from "./ITextEventReciever";

/*
export class MarkdownEventListeners
{
	public readonly textChanged: EventListeners<ITextChanged> = new EventListeners();
	public readonly selectChanged: EventListeners<ISelectChanged> = new EventListeners();
	public readonly otherChanged: EventListeners<any> = new EventListeners();
	public readonly cursorChanged: EventListeners<number> = new EventListeners();
	public readonly formatRequest: EventListeners<void> = new EventListeners();
}
*/


export interface IMarkdownEvents {
	textChanged: (e: ITextChanged) => void;
	selectChanged: (e: ISelectChanged) => void;
	otherChanged: (e: any) => void;
	cursorChanged: (e: number) => void;
	formatRequest: (e: void) => void;
}
