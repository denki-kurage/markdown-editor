export declare class CacheManagerBase<T> {
    protected readonly newItemFactory?: () => T | undefined;
    private _cachedItem;
    readonly cacheItemUpdated: Array<(newValue: T | undefined, oldValue: T | undefined) => void>;
    /**
     * キャッシュされたアイテムを取得します。無ければundefinedが返ります。
     */
    get cachedItem(): T | undefined;
    /**
     * キャッシュされたアイテム、無ければ新規作成して返します。
     */
    get item(): T | undefined;
    /**
     * 新しくアイテムを生成します。その後updateCacheItem()で更新されることに注意してください。
     * newItemFactoryがundefinedの場合はそのままundefinedが返ります。
     */
    get newItem(): T | undefined;
    /**
     * @param newItemFactory 新しくアイテムを作成する必要があるときに呼び出します。
     */
    constructor(newItemFactory?: () => T | undefined);
    /**
     * アイテムを更新します。
     * @param item
     */
    updateCacheItem(item: T | undefined): T | undefined;
    /**
     *
     * @param nv
     * @param ov
     */
    protected onCacheItemUpdated(nv: T | undefined, ov: T | undefined): void;
    clear(): void;
    hasCachedItem(): boolean;
}
//# sourceMappingURL=CacheManagerBase.d.ts.map