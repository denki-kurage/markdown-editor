import { CellInfoHelper } from "./TableCellCommandBase";
import { TableCell } from "../MarkdownTableContent";
import { MoveCommandBase } from "./CommandBaseClasses";
import { MovableArray } from "@mde/markdown-core";
export class MoveColumnCommand extends MoveCommandBase {
    canExecuteOverride(cellInfo, parameter) {
        return !cellInfo.row.isFirstOrLast(cellInfo.cell) && !!this.getTargetHeaderCell(cellInfo);
    }
    /**
     * |A|B|C|   .1
     * |A|B|     .2
     * |A|       .3
     *
     * index 1を左右に移動した場合のパターン。
     *
     * .2   left 1         〇                 |A|B|   -> |B|A|
     * .2   right 1        addCell(2) -> 〇   |A|B| | -> |A| |B|
     * .1   left 1         addCell(1) -> 〇   |A| |   -> | |A|
     * .1   right 1        ×
     *
     * addCell(セルを埋める位置)でセル埋めし、そのうえで移動を実行する。
     *
     * @param cellInfo
     * @param parameter
     */
    executeOverride(cellInfo, parameter, focus) {
        const targetHeaderPos = this.getTargetHeaderCell(cellInfo);
        const itemColumnIndex = cellInfo.columnIndex;
        const targetColumnIndex = targetHeaderPos.columnIndex;
        for (const row of cellInfo.table) {
            const itemCell = row.getCell(itemColumnIndex);
            const targetCell = row.getCell(targetColumnIndex);
            // 対象位置までセルを埋める。
            if (!(itemCell || targetCell)) {
                const fillIndex = Math.max(itemColumnIndex, targetColumnIndex);
                CellInfoHelper.fillCells(row, fillIndex, () => new TableCell(''));
            }
            // 移動させます。
            const ba = this.getInsertLine(this.isBefore);
            const movable = new MovableArray(row.cells);
            movable.move(targetColumnIndex, [itemColumnIndex], ba);
        }
        focus.format();
        focus.setFocusedCellInfo(cellInfo.newCellInfo()?.getForcus());
    }
    getTargetHeaderCell(cellInfo) {
        const cellPos = cellInfo.tablePosition;
        const targetHeaderPos = cellPos.newAdded(this.getMoveColumnDirection(this.isBefore)).newRowIndex(-2);
        return cellInfo.getCellFromAbsolute(targetHeaderPos);
    }
}
//# sourceMappingURL=MoveColumnCommand.js.map