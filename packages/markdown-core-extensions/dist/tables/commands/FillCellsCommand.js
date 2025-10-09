import { TableCellCommandBase } from "./TableCellCommandBase";
import { TableCell } from "../MarkdownTableContent";
// fillCells()のパラメータを取得するよう変更。
export class FillCellsCommand extends TableCellCommandBase {
    canExecuteOverride(cellInfo, parameter) {
        return true;
    }
    executeOverride(cellInfo, parameter, focus) {
        FillCellsCommand.fillCells(cellInfo.table);
        focus.setFocusedCellInfo(cellInfo?.getForcus());
        focus.format();
    }
    /**
     * 穴あき状態のセルを埋めます。
     * @param insertCellWords
     * @param
     */
    static fillCells(table, insertCellWords = (r, c) => '') {
        const width = table.columnLength;
        for (const [idx, row] of table.rows.entries()) {
            while (row.cells.length < width) {
                row.cells.push(new TableCell(insertCellWords(idx, row.cells.length)));
            }
        }
    }
}
//# sourceMappingURL=FillCellsCommand.js.map