import { MarkdownRange } from "./MarkdownRange";
export class MarkdownContentBase {
    _range = MarkdownRange.empty;
    get range() {
        return this._range;
    }
    get lineLength() {
        return this._range.length;
    }
    decision(range) {
        this._range = range;
    }
    documentIndexFromContentIndex(contentIndex) {
        return contentIndex + this._range.begin;
    }
    contentIndexFromDocumentIndex(documentIndex) {
        return documentIndex - this._range.begin;
    }
    isContentIndex(contentIndex) {
        return new MarkdownRange(0, this.lineLength).internal(contentIndex);
    }
}
//# sourceMappingURL=MarkdownContentBase.js.map