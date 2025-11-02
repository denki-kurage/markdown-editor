import { TableCellInfo } from "../MarkdownTableContent";
import { FocusCommandBase } from "./CommandBaseClasses";
import { Direction } from "../Direction";
import { IFormattableParameter } from "@mde/markdown-core";
export declare class FocusCommand extends FocusCommandBase {
    protected canExecuteOverride(cellInfo: TableCellInfo, parameter: Direction): boolean;
    protected executeOverride(cellInfo: TableCellInfo, parameter: Direction, focus: IFormattableParameter): void;
    private getNextCellInfo;
    protected isRowOnly(): boolean;
}
//# sourceMappingURL=FocusCommand.d.ts.map