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

    public static positionToIndex(str: string, pos: IDocumentPosition): number
    {
        const arr = str.split("\n");
        let index = 0;

        for(let i = 0; i < pos.docIndex && i < arr.length; i++)
        {
            index += arr[i].length + 1;
        }

        index += Math.min(pos.charIndex, arr[pos.docIndex]?.length ?? 0);

        return index;
    }

    public static IndexToSelection(str: string, start: number, end: number): ISelection
    {
        const sPos = this.indexToPosition(str, start);
        const ePos = this.indexToPosition(str, end);
        return { sPos, ePos }; 
    }
}


