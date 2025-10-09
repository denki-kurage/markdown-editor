import { RemoveCommandBase } from "./CommandBaseClasses";
export class RemoveColumnCommand extends RemoveCommandBase {
    canExecuteOverride(cellInfo, parameter) {
        return !cellInfo.isOuterSide;
    }
    executeOverride(cellInfo, parameter, focus) {
        for (const row of cellInfo.table) {
            row.cells.splice(cellInfo.columnIndex, 1);
        }
        focus.format();
        const bef = cellInfo.befCellInfo();
        if (bef) {
            focus.setFocusedCellInfo(bef.newCellInfo(0)?.getForcus() || bef?.getForcus());
        }
    }
}
//# sourceMappingURL=RemoveColumnCommand.js.map