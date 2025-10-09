export class TextSource {
    _lines;
    constructor(str) {
        this._lines = str.split(/\r\n|\n|\r/);
    }
    lineAt(index) {
        return this._lines[index];
    }
    hasLine(index) {
        return index >= 0 && index < this._lines.length;
    }
}
//# sourceMappingURL=TextSource.js.map