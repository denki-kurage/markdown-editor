import { TableCellInfo } from "../MarkdownTableContent";
import { InsertCommandBase } from "./CommandBaseClasses";
import { IFormattableParameter } from "@mde/markdown-core";
export declare class InsertColumnCommand extends InsertCommandBase {
    protected canExecuteOverride(cellInfo: TableCellInfo, parameter: number): boolean;
    protected executeOverride(cellInfo: TableCellInfo, parameter: number, focus: IFormattableParameter): void;
}
//# sourceMappingURL=InsertColumnCommand.d.ts.map