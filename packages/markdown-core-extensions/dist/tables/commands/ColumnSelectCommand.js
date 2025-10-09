import { TableCellInfo } from "../MarkdownTableContent";
import { TablePosition } from "../TablePosition";
import { TableCellCommandBase } from "./TableCellCommandBase";
export var SelectType;
(function (SelectType) {
    SelectType[SelectType["None"] = 0] = "None";
    SelectType[SelectType["Empty"] = 1] = "Empty";
    SelectType[SelectType["Full"] = 2] = "Full";
})(SelectType || (SelectType = {}));
export class ColumnSelectCommand extends TableCellCommandBase {
    type;
    constructor(commandContext, type) {
        super(commandContext);
        this.type = type;
    }
    canExecuteOverride(cellInfo, parameter) {
        return true;
    }
    executeOverride(cellInfo, parameter, focus) {
        const columnIndex = cellInfo.columnIndex;
        const check = (info) => {
            const st = info.cell.empty ? SelectType.Empty : SelectType.Full;
            return (this.type & st) !== 0;
        };
        const selections = cellInfo.table.rows
            .map((v, idx) => TableCellInfo.createInstanceFromTablePosition(cellInfo.table, new TablePosition(idx, columnIndex)))
            .filter(_ => !!_ && check(_))
            .map(_ => _.getWordSelection());
        focus.setFocusedCellInfo(...selections);
    }
}
//# sourceMappingURL=ColumnSelectCommand.js.map