import { IAppContext, IDocumentPosition, IEditorDecorateSelection, MarkdownRange } from "@kurage/markdown-core";
import { CellRangeInfo, MarkdownTableContent, TableCell } from "./MarkdownTableContent";

export class TableDecorator
{
    public constructor(
        private readonly appContext: IAppContext)
    {

    }


    private getDecorationInternal(center: TableCell, cells: CellRangeInfo[], before: string, after: string, def: string)
    {
        const firstPosition = 0;
        const lastPosition = cells.length - 1;
        return cells.map<[CellRangeInfo, string, boolean]>((ci, index) => {
            const isCenter = ci.cell === center;
            const className = isCenter ? 'center' : firstPosition === index ? before : lastPosition === index ? after : def;
            return [ ci, className, def === 'column' ]
        })
    }

    private toDecSelection(r: MarkdownRange, cn: string, docIndex: number): IEditorDecorateSelection
    {
        return ({
            classes: [cn],
            selection: {
                sPos: { docIndex, charIndex: r.begin },
                ePos: { docIndex, charIndex: r.end }
            }
        })        
    }

    public decorate(table: MarkdownTableContent, docPos: IDocumentPosition)
    {
        const tableInfo = table.getCellInfo(docPos);
        if(!tableInfo) return;

        const beginPoint = table.range.begin;
        const centerCell = tableInfo.cell;
        const stringCounter = this.appContext.getStringCounter();
        const docIndex = docPos.docIndex;

        const rows = [...tableInfo.row.getCellInfomations(stringCounter)].filter(ci => !tableInfo.row.isFirstOrLast(ci.cell)).map(ci => ci)
        const columns = [...table.rows.entries()].map(([, row]) => row.getCellInfomationFromColumnIndex(tableInfo.columnIndex)).filter(ci => !!ci)
        //.filter(c => c.cell !== centerCell); // 縦はcenterを外す

        const rowDecs = this.getDecorationInternal(centerCell, rows, 'left', 'right', 'row');
        const columnDecs = this.getDecorationInternal(centerCell, columns, 'top', 'bottom', 'column');

        const dc = [
            ...rowDecs.map(([ci, cn], index) => this.toDecSelection(ci.range, cn, docIndex)),
            ...columnDecs.map(([ci, cn], index) => this.toDecSelection(ci.range, cn, beginPoint + 2 + index))
        ]

        this.appContext.getDecorator().decorate(dc);
    }

}

