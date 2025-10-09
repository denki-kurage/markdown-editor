import { IMarkdownEvents } from "@mde/markdown-core";
import { TableCacheManager } from "./TableCacheManager";
import { ISelectChanged, ITextChanged } from "@mde/markdown-core/dist/ITextEventReciever";
export declare class CacheUpdater implements Partial<IMarkdownEvents> {
    protected readonly cache: TableCacheManager;
    private updateManager;
    constructor(cache: TableCacheManager);
    textChanged(e: ITextChanged): void;
    selectChanged(e: ISelectChanged): void;
    otherChanged(e: any): void;
    private onUpdated;
}
//# sourceMappingURL=CacheUpdater.d.ts.map