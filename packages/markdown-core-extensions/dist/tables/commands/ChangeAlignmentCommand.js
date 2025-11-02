import { ChangeAlignmentCommandBase } from "./CommandBaseClasses";
export class ChangeAlignmentCommand extends ChangeAlignmentCommandBase {
    canExecuteOverride(cellInfo, parameter) {
        return !!this.getAlignmentCell(cellInfo);
    }
    executeOverride(cellInfo, parameter, focus) {
        const ac = this.getAlignmentCell(cellInfo);
        if (ac) {
            ac.updateAlign(parameter);
            const rp = cellInfo.relativeCursorInnerPosition;
            focus.format();
            const f = cellInfo.newCellInfo(rp)?.getForcus();
            focus.setFocusedCellInfo(f);
        }
    }
    getAlignmentCell(cellInfo) {
        return cellInfo.table.alignments.cells[cellInfo.columnIndex];
    }
}
//# sourceMappingURL=ChangeAlignmentCommand.js.map