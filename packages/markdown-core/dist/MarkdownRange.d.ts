/**
 * 単純なマイナスを含むint型の範囲を表します。
 */
export declare class MarkdownRange {
    readonly begin: number;
    readonly end: number;
    private static _empty;
    readonly length: number;
    static get empty(): MarkdownRange;
    get isBack(): boolean;
    get isNext(): boolean;
    get isZero(): boolean;
    get isEmptyObject(): boolean;
    constructor(begin: number, end: number);
    static fromLength(begin: number, length: number): MarkdownRange;
    internal(pos: number): boolean;
    internalOrZero(pos: number): boolean;
    adjust(index: number): number;
    toString(): string;
}
//# sourceMappingURL=MarkdownRange.d.ts.map