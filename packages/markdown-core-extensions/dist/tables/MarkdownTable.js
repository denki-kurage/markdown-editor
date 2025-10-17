import { AppHelper } from "./AppHelper";
import { DefaultFormatterContext } from "./DefaultFormatterContext";
import { AutoFormatter } from "./AutoFormatter";
import { CacheUpdater } from "./CacheUpdater";
import { DefaultCommandFactory } from "./DefaultCommandFactory";
import { MarkdownTableRenderMode } from "./MarkdownTableConverter";
import { TableCacheManager } from "./TableCacheManager";
import { TableObserver } from "./TableObserver";
import { MarkdownConfigurations } from "./configurations/MarkdownConfigurations";
import { EventListeners } from "@mde/markdown-core";
import { createDefaultCommandItem } from "./createDefaultCommandItem";
export class MarkdownTable {
    editorContext;
    eventCollection;
    storage;
    appHelper;
    cache;
    configuration;
    commands;
    enableCommandNames = [];
    tableUpdated = new EventListeners();
    currentTableChanged = new EventListeners();
    formatRequest = new EventListeners();
    getEnabledCommandNames() {
        return this.enableCommandNames;
    }
    constructor(editorContext, eventCollection, storage) {
        this.editorContext = editorContext;
        this.eventCollection = eventCollection;
        this.storage = storage;
        this.appHelper = new AppHelper(this.editorContext);
        this.cache = new TableCacheManager(() => this.appHelper.getTable());
        this.cache.cacheItemUpdated.push((nv, ov) => {
            this.onCurrentTableChanged(nv, ov);
        });
        this.registerRecievers(eventCollection, this.cache);
        this.commands = this.createCommands(this.editorContext, this.cache);
        this.configuration = this.createSwitcher(eventCollection, storage, this.editorContext);
        // 文字数カウントの設定、仕様が定まらない・・・。
        //StringCounter.counter = this.editorContext.getStringCounter();
        // TODO: 設計上どうかと思うけど面倒だから仕方ない。
        //setAppContext(this.editorContext);
        // TODO: 実験
        this.configuration.decorator.on();
    }
    getCommandsMap() {
        return createDefaultCommandItem(this.commands, 'light');
    }
    registerRecievers(eventCollection, cache) {
        const formatterContext = this.createFormatterContext(this.editorContext);
        const autoFormatter = new AutoFormatter(this.editorContext, cache, () => this.onFormatRequest(), () => formatterContext);
        const cacheUpdater = new CacheUpdater(cache);
        const tableObserver = new TableObserver(this.editorContext, tables => this.onTableUpdated(tables));
        [autoFormatter, cacheUpdater, tableObserver].forEach(item => eventCollection.add(item));
    }
    createSwitcher(eventCollection, storage, editorContext) {
        return new MarkdownConfigurations(eventCollection, storage, editorContext);
    }
    /**
     * @param nv
     * @param ov
     *
     * テーブルに変更があった場合呼び出されます。
     * セレクションのたびにテーブルの変更をチェックしますが、テーブルに変更が無ければ呼び出されません。
     * これにより
     */
    onCurrentTableChanged(nv, ov) {
        this.enableCommandNames = this.checkEnabledCommandNames();
        //this.configuration.decoratorSwitcher.decorate(nv);
        this.configuration.decorator.decorate(nv);
        this.currentTableChanged.emit(nv);
    }
    dispose() {
    }
    /**
     * フォーマット要求があった場合に呼び出されます。
     * 必ず既定のメソッドよ呼び出してください。
     */
    onFormatRequest() {
        const cmd = this.commands.get('format:beautiful');
        cmd?.execute();
        this.formatRequest.emit();
    }
    /**
     * @param tables テーブル一覧
     *
     * ポーリング中、テーブル一覧に更新があった場合呼び出されます。
     */
    onTableUpdated(tables) {
        this.tableUpdated.emit(tables);
    }
    createCommands(editorContext, cache) {
        const formatterContext = this.createFormatterContext(editorContext);
        const factory = new DefaultCommandFactory(editorContext, cache, formatterContext);
        return factory.createCommandFactries();
    }
    createFormatterContext(editorContext) {
        const mode = this.getFormatMode();
        return new DefaultFormatterContext(mode, editorContext.returnKey());
    }
    getFormatMode() {
        return MarkdownTableRenderMode.Beautiful;
    }
    checkEnabledCommandNames() {
        return [...this.commands.entries()]
            .filter(([, command]) => command.canExecute())
            .map(([name]) => name);
    }
}
//# sourceMappingURL=MarkdownTable.js.map