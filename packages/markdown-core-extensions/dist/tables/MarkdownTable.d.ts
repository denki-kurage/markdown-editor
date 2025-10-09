import { AppHelper } from "./AppHelper";
import { IFormatterContext } from "./IFormatterContext";
import { MarkdownTableRenderMode } from "./MarkdownTableConverter";
import { TableCacheManager } from "./TableCacheManager";
import { MarkdownConfigurations } from "./configurations/MarkdownConfigurations";
import { EventListeners, IAppContext, ICommand, ICommandsMap, IConfigureStorage, MarkdownEventCollection } from "@mde/markdown-core";
import { MarkdownTableContent } from "./MarkdownTableContent";
export declare class MarkdownTable implements ICommandsMap {
    readonly editorContext: IAppContext;
    readonly eventCollection: MarkdownEventCollection;
    readonly storage: IConfigureStorage;
    protected readonly appHelper: AppHelper;
    protected readonly cache: TableCacheManager;
    protected readonly configuration: MarkdownConfigurations;
    private readonly commands;
    private enableCommandNames;
    readonly tableUpdated: EventListeners<MarkdownTableContent[]>;
    readonly currentTableChanged: EventListeners<MarkdownTableContent | undefined>;
    readonly formatRequest: EventListeners<void>;
    getCommandsMap(): Map<string, ICommand>;
    getCommandNames(): {
        format: string[];
        focus: string[];
        align: string[];
        insert: string[];
        remove: string[];
        move: string[];
        'multi-select': string[];
        sort: string[];
    };
    getEnabledCommandNames(): string[];
    constructor(editorContext: IAppContext, eventCollection: MarkdownEventCollection, storage: IConfigureStorage);
    registerRecievers(eventCollection: MarkdownEventCollection, cache: TableCacheManager): void;
    protected createSwitcher(eventCollection: MarkdownEventCollection, storage: IConfigureStorage, editorContext: IAppContext): MarkdownConfigurations;
    /**
     * @param nv
     * @param ov
     *
     * テーブルに変更があった場合呼び出されます。
     * セレクションのたびにテーブルの変更をチェックしますが、テーブルに変更が無ければ呼び出されません。
     * これにより
     */
    protected onCurrentTableChanged(nv: MarkdownTableContent | undefined, ov: MarkdownTableContent | undefined): void;
    dispose(): void;
    /**
     * フォーマット要求があった場合に呼び出されます。
     * 必ず既定のメソッドよ呼び出してください。
     */
    protected onFormatRequest(): void;
    /**
     * @param tables テーブル一覧
     *
     * ポーリング中、テーブル一覧に更新があった場合呼び出されます。
     */
    protected onTableUpdated(tables: MarkdownTableContent[]): void;
    protected createCommands(editorContext: IAppContext, cache: TableCacheManager): Map<string, ICommand>;
    protected createFormatterContext(editorContext: IAppContext): IFormatterContext;
    protected getFormatMode(): MarkdownTableRenderMode;
    private checkEnabledCommandNames;
}
//# sourceMappingURL=MarkdownTable.d.ts.map