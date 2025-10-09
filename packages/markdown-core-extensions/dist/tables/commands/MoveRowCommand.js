import { MovableArray } from "@mde/markdown-core";
import { MoveCommandBase } from "./CommandBaseClasses";
export class MoveRowCommand extends MoveCommandBase {
    canExecuteOverride(cellInfo, parameter) {
        return !cellInfo.isOuterSide && this.getTargetRowIndex(cellInfo) !== undefined;
    }
    executeOverride(cellInfo, parameter, focus) {
        const itemRowIndex = cellInfo.rowIndex;
        const targetRowIndex = this.getTargetRowIndex(cellInfo);
        const ba = this.getInsertLine(this.isBefore);
        new MovableArray(cellInfo.table.rows).move(targetRowIndex, [itemRowIndex], ba);
        focus.format();
        const f = cellInfo.newCellInfo()?.getForcus();
        focus.setFocusedCellInfo(f);
    }
    getTargetRowIndex(cellInfo) {
        const targetRowIndex = cellInfo.tablePosition.newAdded(this.getMoveRowDirection(this.isBefore)).rowIndex;
        if (cellInfo.table.isRow(targetRowIndex)) {
            return targetRowIndex;
        }
    }
    isRowOnly() {
        return true;
    }
}
//# sourceMappingURL=MoveRowCommand.js.map