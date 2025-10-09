export declare class TablePosition {
    readonly rowIndex: number;
    readonly columnIndex: number;
    constructor(rowIndex: number, columnIndex: number);
    equals(tablePosition: TablePosition): boolean;
    newAdded(vector: TablePosition): TablePosition;
    newAddedRowIndex(rowIndex: number): TablePosition;
    newAddedColumnIndex(columnIndex: number): TablePosition;
    newRowIndex(rowIndex: number): TablePosition;
    newColumnIndex(columnIndex: number): TablePosition;
}
//# sourceMappingURL=TablePosition.d.ts.map