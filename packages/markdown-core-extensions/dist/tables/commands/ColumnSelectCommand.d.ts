import { IFormattableParameter } from "@mde/markdown-core";
import { ICommandContext } from "../ICommandContext";
import { TableCellInfo } from "../MarkdownTableContent";
import { TableCellCommandBase } from "./TableCellCommandBase";
export declare enum SelectType {
    None = 0,
    Empty = 1,
    Full = 2
}
export declare class ColumnSelectCommand extends TableCellCommandBase<void> {
    readonly type: SelectType;
    constructor(commandContext: ICommandContext, type: SelectType);
    protected canExecuteOverride(cellInfo: TableCellInfo, parameter: void): boolean;
    protected executeOverride(cellInfo: TableCellInfo, parameter: void, focus: IFormattableParameter): void;
}
//# sourceMappingURL=ColumnSelectCommand.d.ts.map