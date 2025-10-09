export class Utils {
    static indexToPosition(str, index) {
        const arr = str.substring(0, index).split("\n");
        const docIndex = arr.length - 1;
        const charIndex = arr.pop().length;
        return { docIndex, charIndex };
    }
    static IndexToSelection(str, start, end) {
        const sPos = this.indexToPosition(str, start);
        const ePos = this.indexToPosition(str, end);
        return { sPos, ePos };
    }
}
//# sourceMappingURL=Utils.js.map