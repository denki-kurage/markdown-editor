export interface IMovableCollection<T> {
    move(targetItem: T, items: ReadonlyArray<T>, pos?: number): void;
    move(targetIndex: number, itemIndexes: ReadonlyArray<number>, pos?: number): void;
}
//# sourceMappingURL=IMovableCollection.d.ts.map