/**
 * 単純なマイナスを含むint型の範囲を表します。
 */
export class MarkdownRange {
    begin;
    end;
    static _empty = new MarkdownRange(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);
    length;
    static get empty() {
        return this._empty;
    }
    get isBack() {
        return this.begin > this.end;
    }
    get isNext() {
        return this.end > this.begin;
    }
    get isZero() {
        return this.length === 0;
    }
    get isEmptyObject() {
        return MarkdownRange._empty === this;
    }
    constructor(begin, end) {
        this.begin = begin;
        this.end = end;
        this.length = end - begin;
    }
    static fromLength(begin, length) {
        const end = begin + length;
        return new MarkdownRange(begin, end);
    }
    internal(pos) {
        return pos >= this.begin && pos < this.end;
    }
    internalOrZero(pos) {
        return pos >= this.begin && pos <= this.end;
    }
    adjust(index) {
        const min = Math.min(this.begin, this.end);
        const max = Math.max(this.begin, this.end);
        return Math.max(min, Math.min(max, index));
    }
    toString() {
        return `(${this.begin}, ${this.end})`;
    }
}
//# sourceMappingURL=MarkdownRange.js.map