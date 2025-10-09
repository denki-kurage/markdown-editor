import { SortCommandBase } from "./CommandBaseClasses";
export class SortCommand extends SortCommandBase {
    canExecuteOverride(cellInfo, parameter) {
        return true;
    }
    executeOverride(cellInfo, parameter, focus) {
        this.sortNumber(cellInfo, this.isAsc);
        focus.format();
        const f = cellInfo.newCellInfo()?.getForcus();
        focus.setFocusedCellInfo(f);
    }
    sortNumber(cellInfo, isAsk) {
        const columnIndex = cellInfo.columnIndex;
        const arr = cellInfo.table.rows;
        const nanVals = [];
        for (let i = arr.length - 1; i >= 0; i--) {
            const nbr = this.toNumber(arr[i], columnIndex);
            if (isNaN(nbr)) {
                nanVals.push([i, arr[i]]);
                arr.splice(i, 1);
            }
        }
        arr.sort((a, b) => this.compare(a, b, columnIndex, isAsk));
        nanVals.reverse().forEach(_ => arr.splice(_[0], 0, _[1]));
    }
    compare(a, b, ci, isAsk) {
        const an = this.toNumber(a, ci);
        const bn = this.toNumber(b, ci);
        // TODO: 後で変更。
        return isAsk ? an - bn : bn - an;
    }
    toNumber(row, columnIndex) {
        const cell = row.getCell(columnIndex);
        if (cell) {
            return parseFloat(cell.word);
        }
        return Number.NaN;
    }
}
//# sourceMappingURL=SortCommand.js.map