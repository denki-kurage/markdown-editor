import { TableCellInfo } from "../MarkdownTableContent";
import { InsertCommandBase } from "./CommandBaseClasses";
import { IFormattableParameter } from "@mde/markdown-core";
export declare class InsertColumnCommand extends InsertCommandBase {
    protected canExecuteOverride(cellInfo: TableCellInfo, parameter: boolean): boolean;
    protected executeOverride(cellInfo: TableCellInfo, parameter: boolean, focus: IFormattableParameter): void;
}
//# sourceMappingURL=InsertColumnCommand.d.ts.map