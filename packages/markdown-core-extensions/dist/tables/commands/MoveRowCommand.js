import { MovableArray } from "@mde/markdown-core";
import { MoveCommandBase } from "./CommandBaseClasses";
export class MoveRowCommand extends MoveCommandBase {
    canExecuteOverride(cellInfo, parameter) {
        return !cellInfo.isOuterSide && this.getTargetRowIndex(cellInfo, parameter) !== undefined;
    }
    executeOverride(cellInfo, parameter, focus) {
        const itemRowIndex = cellInfo.rowIndex;
        const targetRowIndex = this.getTargetRowIndex(cellInfo, parameter);
        const ba = this.getInsertLine(parameter);
        new MovableArray(cellInfo.table.rows).move(targetRowIndex, [itemRowIndex], ba);
        focus.format();
        const f = cellInfo.newCellInfo()?.getForcus();
        focus.setFocusedCellInfo(f);
    }
    getTargetRowIndex(cellInfo, p) {
        const targetRowIndex = cellInfo.tablePosition.newAdded(this.getMoveRowDirection(p)).rowIndex;
        if (cellInfo.table.isRow(targetRowIndex)) {
            return targetRowIndex;
        }
    }
    isRowOnly() {
        return true;
    }
}
//# sourceMappingURL=MoveRowCommand.js.map