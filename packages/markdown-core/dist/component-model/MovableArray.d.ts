import { IMovableCollection } from "./IMovableCollection";
export declare class MovableArray<T> implements IMovableCollection<T> {
    readonly arr: Array<T>;
    constructor(arr: Array<T>);
    move(targetItem: T, items: ReadonlyArray<T>, pos?: number): void;
    move(targetIndex: number, itemIndices: ReadonlyArray<number>, pos?: number): void;
    /**
     *
     * @param targetIndex
     * @param itemIndices
     * @param pos targetIndexの前に挿入される。前に挿入するなら-1を指定。
     */
    private moveByIndex;
    private moveByItem;
    getIndexItems(itemIndices: ReadonlyArray<number>): Array<T>;
    removeIndexItems(itemIndices: ReadonlyArray<number>): Array<T>;
    insert(index: number, items: ReadonlyArray<T>): void;
    containsIndex(index: number): boolean;
    floatIndex(index: number): number;
    count(): number;
}
//# sourceMappingURL=MovableArray.d.ts.map