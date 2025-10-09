import { CellInfoHelper } from "./TableCellCommandBase";
import { MarkdownTableRows, TableCell } from "../MarkdownTableContent";
import { InsertCommandBase } from "./CommandBaseClasses";
export class InsertRowCommand extends InsertCommandBase {
    canExecuteOverride(cellInfo, parameter) {
        return true;
    }
    executeOverride(cellInfo, parameter, focus) {
        const table = cellInfo.table;
        const insertRowIndex = cellInfo.tablePosition.newAdded(this.getInsertRowDirection(this.isBefore)).rowIndex;
        const insertRow = CellInfoHelper.createRow(MarkdownTableRows, table.columnLength, () => new TableCell(''));
        table.rows.splice(insertRowIndex, 0, insertRow);
        // フォーマット
        focus.format();
        // フォーカスは自身
        const f = cellInfo.newCellInfo()?.getForcus();
        focus.setFocusedCellInfo(f);
    }
    isRowOnly() {
        return true;
    }
}
//# sourceMappingURL=InsertRowCommand.js.map