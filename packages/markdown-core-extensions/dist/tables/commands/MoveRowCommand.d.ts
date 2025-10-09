import { IFormattableParameter } from "@mde/markdown-core";
import { TableCellInfo } from "../MarkdownTableContent";
import { MoveCommandBase } from "./CommandBaseClasses";
export declare class MoveRowCommand extends MoveCommandBase {
    protected canExecuteOverride(cellInfo: TableCellInfo, parameter: number): boolean;
    protected executeOverride(cellInfo: TableCellInfo, parameter: number, focus: IFormattableParameter): void;
    private getTargetRowIndex;
    protected isRowOnly(): boolean;
}
//# sourceMappingURL=MoveRowCommand.d.ts.map