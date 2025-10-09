import { TableCellCommandBase } from "./TableCellCommandBase";
import { TableCellInfo, MarkdownTableRows } from "../MarkdownTableContent";
import { IFormattableParameter } from "@mde/markdown-core";
export declare class DeleteCommentCommand extends TableCellCommandBase<void> {
    protected canExecuteOverride(cellInfo: TableCellInfo, parameter: void): boolean;
    protected executeOverride(cellInfo: TableCellInfo, parameter: void, focus: IFormattableParameter): void;
    protected getCommentRows(cellInfo: TableCellInfo): Array<MarkdownTableRows>;
}
//# sourceMappingURL=DeleteCommetCommand.d.ts.map