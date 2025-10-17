export class Utils {
    static indexToPosition(str, index) {
        const arr = str.substring(0, index).split("\n");
        const docIndex = arr.length - 1;
        const charIndex = arr.pop().length;
        return { docIndex, charIndex };
    }
    static positionToIndex(str, pos) {
        const arr = str.split("\n");
        let index = 0;
        for (let i = 0; i < pos.docIndex && i < arr.length; i++) {
            index += arr[i].length + 1;
        }
        index += Math.min(pos.charIndex, arr[pos.docIndex]?.length ?? 0);
        return index;
    }
    static IndexToSelection(str, start, end) {
        const sPos = this.indexToPosition(str, start);
        const ePos = this.indexToPosition(str, end);
        return { sPos, ePos };
    }
}
//# sourceMappingURL=Utils.js.map