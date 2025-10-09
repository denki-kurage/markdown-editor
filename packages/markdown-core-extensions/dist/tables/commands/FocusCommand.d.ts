import { TableCellInfo } from "../MarkdownTableContent";
import { FocusCommandBase } from "./CommandBaseClasses";
import { IFormattableParameter } from "@mde/markdown-core";
export declare class FocusCommand extends FocusCommandBase {
    protected canExecuteOverride(cellInfo: TableCellInfo, parameter: void): boolean;
    protected executeOverride(cellInfo: TableCellInfo, parameter: void, focus: IFormattableParameter): void;
    private getNextCellInfo;
    protected isRowOnly(): boolean;
}
//# sourceMappingURL=FocusCommand.d.ts.map