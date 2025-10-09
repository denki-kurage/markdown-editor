import { MarkdownTableContent, TableCell, TableAlignmentCell, MarkdownTableRows, MarkdownTableAlignments } from "./MarkdownTableContent";
import { MarkdownAlignments } from "./MarkdownAlignments";
import { ITableConverter } from "./ITableConverter";
export interface IColumnRenderSizeInfo {
    width: number;
    align: MarkdownAlignments;
}
export declare enum MarkdownTableRenderMode {
    /**
     * 出来るだけ元を崩さず自然な状態でフォーマットします。
     */
    Natural = 0,
    /**
     * 奇麗に整えられた状態でフォーマットします。
     */
    Beautiful = 1
}
/**
 *
 */
export declare class MarkdownTableConverter implements ITableConverter<string> {
    readonly renderMode: MarkdownTableRenderMode;
    private readonly returnKey;
    constructor(renderMode: MarkdownTableRenderMode, returnKey: string);
    toTable(data: string): MarkdownTableContent;
    fromTable(table: MarkdownTableContent): string;
    protected createRow(row: MarkdownTableRows): string;
    protected natural(row: MarkdownTableRows): string;
    protected beautiful(row: MarkdownTableRows): string;
}
/**
 * テーブルフォーマットの設定情報
 */
export interface ITableFormatterConfig {
    readonly leftSpaceLength: number;
    readonly rightSpaceLength: number;
}
export interface IMarkdownTableFormatter {
    format(table: MarkdownTableContent): void;
}
export declare class MarkdownTableFormatter implements IMarkdownTableFormatter {
    readonly config: ITableFormatterConfig;
    readonly cellFormatter: CellFormatter;
    readonly alignFormatter: AlignFormatter;
    constructor(config: ITableFormatterConfig, cellFormatter: CellFormatter, alignFormatter: AlignFormatter);
    static createInstance(leftSpaceLength?: number, rightSpaceLength?: number): MarkdownTableFormatter;
    format(table: MarkdownTableContent): void;
    protected formatCell(row: MarkdownTableRows, columnInfo: Array<IColumnRenderSizeInfo>): void;
    protected formatAlign(align: MarkdownTableAlignments, columnInfo: Array<IColumnRenderSizeInfo>): void;
    private getColumnRenderSizeInfo;
    protected adjustWidth(width: number): number;
}
export declare class CellFormatter {
    format(cell: TableCell, columnInfo: IColumnRenderSizeInfo, config: ITableFormatterConfig): void;
    private getSpace;
    private splitNumber;
}
export declare class AlignFormatter {
    format(align: TableAlignmentCell, columnInfo: IColumnRenderSizeInfo): void;
}
//# sourceMappingURL=MarkdownTableConverter.d.ts.map