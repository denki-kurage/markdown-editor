import { IReplaceText } from "./IReplaceText";
import { IDocumentPosition } from "./IDocumentPosition";
import { ISelection } from "./ISelection";


export interface IEditorModel
{
	getText(selection: ISelection|undefined): string;
	getCursor(): IDocumentPosition | undefined;
	getSelections(): ISelection[];
	setSelections(selections: ISelection[]): void;
	replaces(items: IReplaceText[], reselect?: (text: string, newSelection: ISelection) => ISelection): void;

	/** undo に参加させずに単一上書き */
	rewrite(item: IReplaceText[]): void;

	positionToIndex(position: IDocumentPosition): number;
	indexToPosition(docIndex: number): IDocumentPosition;
	scroll(docIndex: number): void;
}
