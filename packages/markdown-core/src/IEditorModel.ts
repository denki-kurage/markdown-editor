import { IReplaceText } from "./IReplaceText";
import { IDocumentPosition } from "./IDocumentPosition";
import { ISelection } from "./ISelection";


export interface IEditorModel
{
	getText(selection: ISelection): string;
	getCursor(): IDocumentPosition | undefined;
	getSelections(): ISelection[];
	setSelections(selections: ISelection[]): void;
	replaces(items: IReplaceText[], reselect?: (text: string, newSelection: ISelection) => ISelection): void;
	positionToIndex(position: IDocumentPosition): number;
	indexToPosition(docIndex: number): IDocumentPosition | undefined;
	scroll(docIndex: number): void;
}
