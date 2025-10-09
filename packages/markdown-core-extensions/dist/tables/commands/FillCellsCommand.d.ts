import { TableCellCommandBase } from "./TableCellCommandBase";
import { MarkdownTableContent, TableCellInfo } from "../MarkdownTableContent";
import { IFormattableParameter, IInsertCellWord } from "@mde/markdown-core";
export declare class FillCellsCommand extends TableCellCommandBase<void> {
    protected canExecuteOverride(cellInfo: TableCellInfo, parameter: void): boolean;
    protected executeOverride(cellInfo: TableCellInfo, parameter: void, focus: IFormattableParameter): void;
    /**
     * 穴あき状態のセルを埋めます。
     * @param insertCellWords
     * @param
     */
    static fillCells(table: MarkdownTableContent, insertCellWords?: IInsertCellWord): void;
}
//# sourceMappingURL=FillCellsCommand.d.ts.map