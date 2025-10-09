import { TableCacheManager } from "./TableCacheManager";
import { IFormatterContext } from "./IFormatterContext";
import { IAppContext, IMarkdownEvents } from "@mde/markdown-core";
import { ISelectChanged, ITextChanged } from "@mde/markdown-core/dist/ITextEventReciever";
/**
 * 現在キャッシュされているテーブルを文字列化したものと、
 * そのテーブルの範囲(行数)のテキストソースの文字列が違った場合再フォーマットする
 */
export declare class AutoFormatter implements Partial<IMarkdownEvents> {
    protected readonly appContext: IAppContext;
    protected readonly cache: TableCacheManager;
    protected readonly formatted: () => void;
    protected readonly getFormatterContext: () => IFormatterContext;
    private updateManager;
    private docPos;
    constructor(appContext: IAppContext, cache: TableCacheManager, formatted: () => void, getFormatterContext: () => IFormatterContext);
    textChanged(e: ITextChanged): void;
    selectChanged(e: ISelectChanged): void;
    otherChanged(e: any): void;
    /**
     *
     */
    private requestReplace;
}
//# sourceMappingURL=AutoFormatter.d.ts.map