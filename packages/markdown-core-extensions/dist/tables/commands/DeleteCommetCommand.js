import { TableCellCommandBase } from "./TableCellCommandBase";
export class DeleteCommentCommand extends TableCellCommandBase {
    canExecuteOverride(cellInfo, parameter) {
        return !!this.getCommentRows(cellInfo).length;
    }
    executeOverride(cellInfo, parameter, focus) {
        const rows = this.getCommentRows(cellInfo);
        rows.forEach(_ => _.lastCell ? _.lastCell.word = '' : '');
        focus.format();
        const f = cellInfo.newCellInfo()?.getForcus();
        focus.setFocusedCellInfo(f);
    }
    getCommentRows(cellInfo) {
        return cellInfo.table.rows.filter(row => !!row.lastCell);
    }
}
//# sourceMappingURL=DeleteCommetCommand.js.map