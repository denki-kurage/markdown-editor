import { IFormattableParameter } from "@mde/markdown-core";
import { TableCellInfo } from "../MarkdownTableContent";
import { TextSortCommandBase } from "./CommandBaseClasses";
export declare class TextSortCommand extends TextSortCommandBase {
    protected canExecuteOverride(cellInfo: TableCellInfo, parameter: void): boolean;
    protected executeOverride(cellInfo: TableCellInfo, parameter: void, focus: IFormattableParameter): void;
    private sortText;
    private compare;
    private getStr;
}
//# sourceMappingURL=TextSortCommand.d.ts.map