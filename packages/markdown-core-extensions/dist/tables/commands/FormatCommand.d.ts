import { IFormattableParameter } from "@mde/markdown-core";
import { TableCellInfo } from "../MarkdownTableContent";
import { FormatCommandBase } from "./CommandBaseClasses";
export declare class FormatCommand extends FormatCommandBase {
    protected canExecuteOverride(cellInfo: TableCellInfo, parameter: void): boolean;
    protected executeOverride(cellInfo: TableCellInfo, parameter: void, focus: IFormattableParameter): void;
    put(cp: TableCellInfo | undefined, tag: string): void;
}
//# sourceMappingURL=FormatCommand.d.ts.map