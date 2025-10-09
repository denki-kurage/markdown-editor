export class TablePosition {
    rowIndex;
    columnIndex;
    constructor(rowIndex, columnIndex) {
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
    }
    equals(tablePosition) {
        return this.rowIndex === tablePosition.rowIndex && this.columnIndex === tablePosition.columnIndex;
    }
    newAdded(vector) {
        return new TablePosition(this.rowIndex + vector.rowIndex, this.columnIndex + vector.columnIndex);
    }
    newAddedRowIndex(rowIndex) {
        return this.newAdded(new TablePosition(rowIndex, 0));
    }
    newAddedColumnIndex(columnIndex) {
        return this.newAdded(new TablePosition(0, columnIndex));
    }
    newRowIndex(rowIndex) {
        return new TablePosition(rowIndex, this.columnIndex);
    }
    newColumnIndex(columnIndex) {
        return new TablePosition(this.rowIndex, columnIndex);
    }
}
//# sourceMappingURL=TablePosition.js.map