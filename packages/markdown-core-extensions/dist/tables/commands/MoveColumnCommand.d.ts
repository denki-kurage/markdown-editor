import { TableCellInfo } from "../MarkdownTableContent";
import { MoveCommandBase } from "./CommandBaseClasses";
import { IFormattableParameter } from "@mde/markdown-core";
export declare class MoveColumnCommand extends MoveCommandBase {
    protected canExecuteOverride(cellInfo: TableCellInfo, parameter: boolean): boolean;
    /**
     * |A|B|C|   .1
     * |A|B|     .2
     * |A|       .3
     *
     * index 1を左右に移動した場合のパターン。
     *
     * .2   left 1         〇                 |A|B|   -> |B|A|
     * .2   right 1        addCell(2) -> 〇   |A|B| | -> |A| |B|
     * .1   left 1         addCell(1) -> 〇   |A| |   -> | |A|
     * .1   right 1        ×
     *
     * addCell(セルを埋める位置)でセル埋めし、そのうえで移動を実行する。
     *
     * @param cellInfo
     * @param parameter
     */
    protected executeOverride(cellInfo: TableCellInfo, parameter: boolean, focus: IFormattableParameter): void;
    private getTargetHeaderCell;
}
//# sourceMappingURL=MoveColumnCommand.d.ts.map