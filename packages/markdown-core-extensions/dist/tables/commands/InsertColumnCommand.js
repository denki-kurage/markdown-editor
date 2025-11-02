import { CellInfoHelper } from "./TableCellCommandBase";
import { TableCell, TableAlignmentCell, MarkdownTableAlignments, } from "../MarkdownTableContent";
import { InsertCommandBase } from "./CommandBaseClasses";
export class InsertColumnCommand extends InsertCommandBase {
    canExecuteOverride(cellInfo, parameter) {
        return !cellInfo.row.isFirstOrLast(cellInfo.cell);
    }
    executeOverride(cellInfo, parameter, focus) {
        for (const row of cellInfo.table) {
            if (row.hasCell(cellInfo.columnIndex)) {
                const factory = row instanceof MarkdownTableAlignments ?
                    () => TableAlignmentCell.createCellFromWAlignWord('---') :
                    () => new TableCell('');
                const ba = cellInfo.tablePosition.newAdded(this.getInsertColumnDirection(parameter)).columnIndex;
                CellInfoHelper.insertCell(row, ba, factory);
            }
        }
        focus.format();
        const f = cellInfo.newCellInfo()?.getForcus();
        focus.setFocusedCellInfo(f);
    }
}
//# sourceMappingURL=InsertColumnCommand.js.map