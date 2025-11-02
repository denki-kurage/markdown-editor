import { MarkdownAlignments } from "../MarkdownAlignments";
import { TableCellInfo } from "../MarkdownTableContent";
import { ITableCommandParameter } from "./ITableCommandParameter";
import { ChangeAlignmentCommandBase } from "./CommandBaseClasses";
import { IFormattableParameter } from "@mde/markdown-core";
export declare class ChangeAlignmentCommand extends ChangeAlignmentCommandBase {
    protected canExecuteOverride(cellInfo: TableCellInfo, parameter: MarkdownAlignments): boolean;
    protected executeOverride(cellInfo: TableCellInfo, parameter: MarkdownAlignments, focus: IFormattableParameter): void;
    private getAlignmentCell;
}
export interface MarkdownAlignmentsParameter extends ITableCommandParameter {
    align: MarkdownAlignments;
}
//# sourceMappingURL=ChangeAlignmentCommand.d.ts.map