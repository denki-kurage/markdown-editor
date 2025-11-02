import { TableCellInfo } from "../MarkdownTableContent";
import { InsertCommandBase } from "./CommandBaseClasses";
import { IFormattableParameter } from "@mde/markdown-core";
export declare class InsertRowCommand extends InsertCommandBase {
    protected canExecuteOverride(cellInfo: TableCellInfo, parameter: boolean): boolean;
    protected executeOverride(cellInfo: TableCellInfo, parameter: boolean, focus: IFormattableParameter): void;
    protected isRowOnly(): boolean;
}
//# sourceMappingURL=InsertRowCommand.d.ts.map