import { IReplaceText } from "./IReplaceText";
import { IDocumentPosition } from "./IDocumentPosition";
import { ISelection } from "./ISelection";


export interface IEditorModel
{
	getText(pos: ISelection): string;
	getCursor(): IDocumentPosition | undefined;
	getSelections(): ISelection[];
	setSelections(selections: ISelection[]): void;
	replaces(items: IReplaceText[]): void;
	//positionToIndex(position: IDocumentPosition): number;
	//indexToPosition(docIndex: number): IDocumentPosition | undefined;
	scroll(docIndex: number): void;
}
