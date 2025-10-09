import { RemoveCommandBase } from "./CommandBaseClasses";
export class RemoveRowCommand extends RemoveCommandBase {
    canExecuteOverride(cellInfo, parameter) {
        return this.getInfo(cellInfo) !== undefined;
    }
    executeOverride(cellInfo, parameter, focus) {
        const removeRowIndex = this.getInfo(cellInfo);
        cellInfo.table.rows.splice(removeRowIndex, 1);
        focus.format();
        const bef = cellInfo.befCellInfo();
        if (bef) {
            focus.setFocusedCellInfo(bef.newCellInfo(0)?.getForcus() || bef?.getForcus());
        }
    }
    getInfo(cellInfo) {
        if (cellInfo.table.isRow(cellInfo.rowIndex)) {
            return cellInfo.rowIndex;
        }
    }
}
//# sourceMappingURL=RemoveRowCommand.js.map