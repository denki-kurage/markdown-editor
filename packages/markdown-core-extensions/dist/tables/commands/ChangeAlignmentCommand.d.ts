import { MarkdownAlignments } from "../MarkdownAlignments";
import { TableCellInfo } from "../MarkdownTableContent";
import { ITableCommandParameter } from "./ITableCommandParameter";
import { ChangeAlignmentCommandBase } from "./CommandBaseClasses";
import { IFormattableParameter } from "@mde/markdown-core";
export declare class ChangeAlignmentCommand extends ChangeAlignmentCommandBase {
    protected canExecuteOverride(cellInfo: TableCellInfo, parameter: void): boolean;
    protected executeOverride(cellInfo: TableCellInfo, parameter: void, focus: IFormattableParameter): void;
    private getAlignmentCell;
}
export interface MarkdownAlignmentsParameter extends ITableCommandParameter {
    align: MarkdownAlignments;
}
//# sourceMappingURL=ChangeAlignmentCommand.d.ts.map