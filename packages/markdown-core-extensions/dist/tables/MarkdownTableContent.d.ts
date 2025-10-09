import { IDocumentPosition, ISelection, IStringCounter, MarkdownContentBase, MarkdownRange } from '@mde/markdown-core';
import { TablePosition } from './TablePosition';
import { Direction } from './Direction';
import { MarkdownAlignments } from './MarkdownAlignments';
export declare class TablePositionDirections {
    static readonly top: TablePosition;
    static readonly bottom: TablePosition;
    static readonly left: TablePosition;
    static readonly right: TablePosition;
    static readonly before: number;
    static readonly after: number;
    static getPositionFromDirection(direction: Direction): TablePosition;
}
export interface ICellResult {
    readonly row: MarkdownTableRows;
    readonly cell: TableCell;
}
export declare class MarkdownTableContent extends MarkdownContentBase {
    readonly headers: MarkdownTableRows;
    readonly alignments: MarkdownTableAlignments;
    readonly rows: Array<MarkdownTableRows>;
    get columnLength(): number;
    get rowLength(): number;
    get tableRowLength(): number;
    [Symbol.iterator](): Generator<MarkdownTableRows | MarkdownTableAlignments, void, unknown>;
    constructor(headers: MarkdownTableRows, alignments: MarkdownTableAlignments, rows: Array<MarkdownTableRows>);
    /**
     * ヘッダを含まない行であるかをチェックします。
     * @param rowIndex
     */
    isRow(rowIndex: number): boolean;
    /**
     * ヘッダ含む行であるかをチェックします。
     * @param tableRowIndex -2からrowLength未満の値。
     */
    isTableRow(tableRowIndex: number): boolean;
    /**
     * ヘッダを含む行番号に変換して取得します。
     * ヘッダ行は-2, アライメント行は-1になります。
     * 範囲を超える値も変換されるので使用する際は範囲のチェックが必要です。
     * @param docIndex ドキュメント上の行番号
     */
    getTableRowIndex(docIndex: number): number;
    /**
     * ドキュメントレベルのポジションをテーブルレベルのポジションに変換します。
     * @param docPosition
     */
    toTablePosition(docPosition: IDocumentPosition): TablePosition | undefined;
    toDocumentPosition(tablePosition: TablePosition): IDocumentPosition | undefined;
    /**
     * 行を安全に取得します。取得できない場合はundefinedが返ります。
     * @param tableRowIndex
     */
    getTableRow(tableRowIndex: number): MarkdownTableRows | undefined;
    /**
     * セル(及び行)を安全に取得します。
     * 厳密に見つからなければundefinedを返します。
     */
    getCell(tableRowIndex: number, columnIndex: number): ICellResult | undefined;
    /**
     * セル(ヘッダも含む)からポジションを取得します。
     * @param cell
     */
    getTablePosition(cell: TableCell): TablePosition | undefined;
    getVerticalTableRows(columnIndex: number, all?: boolean): IterableIterator<ICellResult | undefined>;
    getVerticalOnlyTableRows(column: number): IterableIterator<ICellResult>;
    /**
     * 安全にセル情報を取得します。
     */
    getCellInfo(docPosition: IDocumentPosition): TableCellInfo | undefined;
}
export declare class TableCellInfo {
    readonly table: MarkdownTableContent;
    readonly row: MarkdownTableRows;
    readonly docPosition: IDocumentPosition;
    readonly tablePosition: TablePosition;
    readonly cellInfo: CellRangeInfo;
    static cnt: number;
    static count(): void;
    serial: number;
    isRow(): boolean;
    get docIndex(): number;
    get charIndex(): number;
    get rowIndex(): number;
    get columnIndex(): number;
    get cellRange(): MarkdownRange;
    get cell(): TableCell;
    get isOuterSide(): boolean;
    /**
     * 空白を含む文字列からの、トリミング文字列先頭位置。
     * '   abc  ' = 3
     */
    get wordInnerPosition(): number;
    /**
     * 空白を含む文字列先頭からの選択位置。
     * '   ab|c' = 5
     */
    get cursorInnerPosition(): number;
    /**
     * トリミング文字列先頭からの相対的な選択位置。
     *
     * '   ab|c' = 2
     */
    get relativeCursorInnerPosition(): number;
    /**
     * 相対位置を元に文字列先頭からの位置を取得します。範囲を超えていた場合は調整されます。
     * @param relativeCursorInnerPosition
     */
    getPosFromRelativeCursorPosition(relativeCursorInnerPosition: number): number;
    /**
     * 相対位置からのDocIndexを取得します。
     * @param relativeCursorInnerPosition
     */
    getDocCharIndex(relativeCursorInnerPosition: number): number;
    /**
     * 行のセル数を返します。table.columnLengthはヘッダのセル数であることに注意してください。
     */
    get rowCellsLength(): number;
    private constructor();
    static createInstance(table: MarkdownTableContent, docPosition: IDocumentPosition): TableCellInfo | undefined;
    /**
     * tablePositionからTableCellInfoを作成しますが、カーソル位置は捨てられて０になります。
     * 理由は、tablePositionをdocPositionに変換後、docPosition.charIndexにカーソル分を足してcreateInstance()を呼び出すと、tablePositionの範囲を超える(他のセルを取得してしまう)可能性があるからです。
     * カーソル分が必要な場合はcreateInstanceFromTablePositionAndCursor()を使用してください。
     * @param table
     * @param tablePosition
     */
    static createInstanceFromTablePosition(table: MarkdownTableContent, tablePosition: TablePosition): TableCellInfo | undefined;
    /**
     * relativeCursorPosition
     * @param table
     * @param tablePosition
     * @param relativeCursorPosition
     */
    static createInstanceFromTablePositionAndCursor(table: MarkdownTableContent, tablePosition: TablePosition, relativeCursorPosition: number): TableCellInfo | undefined;
    /**
     * 現在のセルのインスタンスから新たなセル情報を取得します。
     * セルの状態が変更した時などに再取得します。
     * @param newRelativeCursorPosition 相対カーソル位置を更新する場合は指定します。
     */
    newCellInfo(newRelativeCursorPosition?: number): TableCellInfo | undefined;
    /**
     * セル情報は取得した時点でのもので、テーブルに変更が加わった場合情報が古くなる場合があります。
     * 例えば現在のセルの位置が変わると、tablePositionは嘘の情報になります。
     * その元のポジションには別のセル、あるいは何もない可能性があり、このメソッドでは元のポジションにあるセルから新たなセル情報(後釜)を取得します。
     * もしセルが同じであれば相対カーソル情報を保持したまま(newCellInfo())を返します。
     * @param cellInfo
     */
    befCellInfo(): TableCellInfo | undefined;
    /**
     * 現在のセル情報から相対的な位置にあるセル情報を取得します
     * @param nextPosition TablePositionDirectionsで上下左右を指定することも出来ます。
     */
    getCellFromRelative(nextPosition: TablePosition): TableCellInfo | undefined;
    /**
     * 現在のセル情報のテーブルを元に、絶対的な位置にあるセル情報を取得します。
     * @param tablePosition
     */
    getCellFromAbsolute(tablePosition: TablePosition): TableCellInfo | undefined;
    /**
     * セルから、指定した方角にある一番最初に見つかるセル情報を取得します。
     */
    getCellFromDirection(direction: Direction): TableCellInfo | undefined;
    /**
     * FillFormat後の通常テーブルの範囲内かどうかをチェックします。
     * のこぎり型でも、通常テーブル内としてみなしたうえでチェックします。
     * @param tablePosition
     */
    isTableArea(tablePosition: TablePosition): boolean;
    getForcus(): ISelection;
    getWordSelection(): ISelection;
}
export declare class TableCell {
    private _word;
    get empty(): boolean;
    get word(): string;
    set word(value: string);
    constructor(word: string);
}
export declare class TableAlignmentCell extends TableCell {
    private _align;
    private _alignWord;
    get align(): MarkdownAlignments;
    get alignWord(): AlignWord;
    updateProperties(word: string): boolean;
    updateAlign(align: MarkdownAlignments): void;
    private constructor();
    static createInstance(word: string): TableAlignmentCell | undefined;
    static createCellFromAlignments(align: MarkdownAlignments): TableAlignmentCell;
    static createCellFromWAlignWord(alignWord: AlignWord): TableAlignmentCell;
    static toAlignCell(cell: TableCell): TableAlignmentCell | undefined;
    static convertAlignWord(word: string): AlignWord | undefined;
    static toAlignments(alignWord: AlignWord): MarkdownAlignments;
    static toAlignWord(align: MarkdownAlignments): AlignWord;
}
export type AlignWord = ':--' | '---' | '--:' | ':-:';
export declare class CellRangeInfo {
    private readonly row;
    readonly cell: TableCell;
    readonly range: MarkdownRange;
    /**
     * firstCell/lastCellの場合、或いはすでに行からセルが無い場合は-1が返ります。
     */
    get columnIndex(): number;
    constructor(row: MarkdownTableRows, cell: TableCell, range: MarkdownRange);
}
export declare abstract class TableRowBase<TCell extends TableCell> {
    readonly cells: Array<TCell>;
    readonly firstCell: TableCell | undefined;
    readonly lastCell: TableCell | undefined;
    [Symbol.iterator](): Generator<TableCell, void, unknown>;
    get hasFirstSpritter(): boolean;
    get hasLastSplitter(): boolean;
    get cellLength(): number;
    constructor(cells: Array<TCell>, firstCell: TableCell | undefined, lastCell: TableCell | undefined);
    /**
     * セルを安全に取得します。
     * @param columnIndex
     */
    getCell(columnIndex: number): TCell | undefined;
    hasCell(columnIndex: number): boolean;
    getCellRangeFromCell(cell: TableCell, strCounter?: IStringCounter): MarkdownRange | null;
    /**
     * charIndexにあるセル及びその範囲を取得します。
     * セルはfirstCell/lastCellを含みます。
     * カラム番号はrows.indexOf()から取得してください。
     * @param charIndex
     * @param strCount
     */
    getCellInfomationFromCharacterIndex(charIndex: number, strCounter?: IStringCounter): CellRangeInfo | undefined;
    getCellInfomationFromColumnIndex(columnIndex: number, strCounter?: IStringCounter): CellRangeInfo | undefined;
    getCellInfomations(strCounter?: IStringCounter): IterableIterator<CellRangeInfo>;
    isFirstOrLast(cell: TableCell): boolean;
    /**
     * TODO: 単純なsplitではエスケープ等が分割できない。
     */
    static split(line: string, splitter?: string): Array<TableCell>;
    private static jpSplit;
    /**
     * TODO: 複雑すぎるためリファクタ必須。
     * @param items
     * @param limit
     */
    static adjust(items: Array<TableCell>, limit?: number): MarkdownTableRows | undefined;
    private static joinTableCells;
}
export declare class MarkdownTableRows extends TableRowBase<TableCell> {
    static createInstance(line: string, limit?: number): MarkdownTableRows | undefined;
}
export declare class MarkdownTableAlignments extends TableRowBase<TableAlignmentCell> {
    static createInstance(line: string): MarkdownTableAlignments | undefined;
}
//# sourceMappingURL=MarkdownTableContent.d.ts.map