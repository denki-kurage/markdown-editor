import { IDocumentPosition } from "./IDocumentPosition";
import { ISelection } from "./ISelection";
export declare class Utils {
    static indexToPosition(str: string, index: number): IDocumentPosition;
    static positionToIndex(str: string, pos: IDocumentPosition): number;
    static IndexToSelection(str: string, start: number, end: number): ISelection;
}
//# sourceMappingURL=Utils.d.ts.map