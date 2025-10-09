import { IDocumentPosition } from "./IDocumentPosition";
import { ISelection } from "./ISelection";

export class Utils
{
    public static indexToPosition(str: string, index: number): IDocumentPosition
    {
        const arr = str.substring(0, index).split("\n");
        const docIndex = arr.length - 1;
        const charIndex = arr.pop().length;
        return { docIndex, charIndex };
    }

    public static IndexToSelection(str: string, start: number, end: number): ISelection
    {
        const sPos = this.indexToPosition(str, start);
        const ePos = this.indexToPosition(str, end);
        return { sPos, ePos }; 
    }
}


