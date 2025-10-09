import { IReplaceText } from "./IReplaceText";
import { IDocumentPosition } from "./IDocumentPosition";
import { ISelection } from "./ISelection";
export interface IEditorModel {
    getText(pos: ISelection): string;
    getCursor(): IDocumentPosition | undefined;
    getSelections(): ISelection[];
    setSelections(selections: ISelection[]): void;
    replaces(items: IReplaceText[]): void;
    scroll(docIndex: number): void;
}
//# sourceMappingURL=IEditorModel.d.ts.map