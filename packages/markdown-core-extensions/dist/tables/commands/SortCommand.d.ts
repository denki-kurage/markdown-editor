import { IFormattableParameter } from "@mde/markdown-core";
import { TableCellInfo } from "../MarkdownTableContent";
import { SortCommandBase } from "./CommandBaseClasses";
export declare class SortCommand extends SortCommandBase {
    protected canExecuteOverride(cellInfo: TableCellInfo, parameter: boolean): boolean;
    protected executeOverride(cellInfo: TableCellInfo, parameter: boolean, focus: IFormattableParameter): void;
    private sortNumber;
    private compare;
    private toNumber;
}
//# sourceMappingURL=SortCommand.d.ts.map