import { TableCellInfo, TableCell, TableRowBase } from "../MarkdownTableContent";
import { MarkdownTableRenderMode } from "../MarkdownTableConverter";
import { TablePosition } from "../TablePosition";
import { TableCommandBase } from "./TableCommandBase";
import { IFormattableParameter } from "@mde/markdown-core";
import { ICommandContext } from "../ICommandContext";
/**
 * セル上で成り立つコマンドの基底クラスを表します。
 * move系、insert系などはセル上にカーソルがあることが前提で実行するコマンドです。
 * 逆に、フォーマット系などはセル上にある必要はありません。例えばfirstCell/lastCell上でも実行できるタイプのコマンドです。
 */
export declare abstract class TableCellCommandBase<T> extends TableCommandBase<T> {
    protected readonly commandContext: ICommandContext;
    protected readonly sealValue?: T;
    constructor(commandContext: ICommandContext, sealValue?: T);
    protected getCellInfo(): TableCellInfo | undefined;
    protected canExecuteGeneric(parameter: T | undefined): boolean;
    protected executeGeneric(parameter: T | undefined): void;
    protected abstract canExecuteOverride(cellInfo: TableCellInfo, parameter: T | undefined): boolean;
    protected abstract executeOverride(cellInfo: TableCellInfo, parameter: T | undefined, focus: IFormattableParameter): void;
    /**
     * この実行条件がヘッダを覗く行のみを対象とする場合にtrueを返します。
     * 行の移動や追加などでtrueを返します。
     */
    protected isRowOnly(): boolean;
    private checkIsRowOnly;
    protected get defaultRenderMode(): MarkdownTableRenderMode;
    protected getInsertColumnDirection(isBefore: boolean): TablePosition;
    protected getInsertRowDirection(isBefore: boolean): TablePosition;
    protected getMoveColumnDirection(isBefore: boolean): TablePosition;
    protected getMoveRowDirection(isBefore: boolean): TablePosition;
    protected getColumnCell(cellInfo: TableCellInfo, isBefore: boolean): TableCellInfo | undefined;
    protected getRowCell(cellInfo: TableCellInfo, isBefore: boolean): TableCellInfo | undefined;
    protected getInsertLine(isBefore: boolean): number;
}
export declare class CellInfoHelper {
    static getColumn(cellInfo: TableCellInfo): {
        cellInfos: Array<TableCellInfo | undefined>;
        hasAll: boolean;
    };
    static createRow<TCell extends TableCell, TRow extends TableRowBase<TCell>>(constructor: ITableRowConstructor<TCell, TRow>, length: number, cellFactory: () => TCell): TRow;
    static fillCells<TCell extends TableCell, TRow extends TableRowBase<TCell>>(row: TRow, pos: number, cellFactory: () => TCell): void;
    static insertCell<TCell extends TableCell, TRow extends TableRowBase<TCell>>(row: TRow, pos: number, cellFactory: () => TCell): void;
}
export interface ITableRowConstructor<TCell extends TableCell, TRow extends TableRowBase<TCell>> {
    new (cells: Array<TCell>, firstCell: TableCell | undefined, lastCell: TableCell | undefined): TRow;
}
//# sourceMappingURL=TableCellCommandBase.d.ts.map