import { IFormattableParameter } from "@mde/markdown-core";
import { TableCellInfo } from "../MarkdownTableContent";
import { RemoveCommandBase } from "./CommandBaseClasses";
export declare class RemoveRowCommand extends RemoveCommandBase {
    protected canExecuteOverride(cellInfo: TableCellInfo, parameter: void): boolean;
    protected executeOverride(cellInfo: TableCellInfo, parameter: void, focus: IFormattableParameter): void;
    private getInfo;
}
//# sourceMappingURL=RemoveRowCommand.d.ts.map