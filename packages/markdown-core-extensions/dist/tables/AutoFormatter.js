import { AppHelper } from "./AppHelper";
import { EventUpdateManager } from "@mde/markdown-core";
/**
 * 現在キャッシュされているテーブルを文字列化したものと、
 * そのテーブルの範囲(行数)のテキストソースの文字列が違った場合再フォーマットする
 */
export class AutoFormatter {
    appContext;
    cache;
    formatted;
    getFormatterContext;
    updateManager;
    docPos;
    constructor(appContext, cache, formatted, getFormatterContext) {
        this.appContext = appContext;
        this.cache = cache;
        this.formatted = formatted;
        this.getFormatterContext = getFormatterContext;
        this.updateManager = new EventUpdateManager(500);
        this.updateManager.updated.push(() => this.requestReplace());
    }
    textChanged(e) {
        this.docPos = e.startPosition;
        //
        this.updateManager.lazyUpdate();
        //
        // 
        // this.updateManager.update();
        //
        //
        //
    }
    selectChanged(e) {
        // console.log(this.appContext.getCursor())
        // this.updateManager.hasUpdate();
    }
    otherChanged(e) {
        //this.updateManager.hasUpdate();
    }
    /**
     *
     */
    requestReplace() {
        if (!this.docPos)
            return;
        // 自動フォーマットなのでキャッシュではなく直接取得。
        let table = this.cache.newItem;
        if (table) {
            const helper = new AppHelper(this.appContext);
            // しまった、ここでテーブルの構造に変化が加わるので、
            const fmt = helper.formatAndRender(table, this.getFormatterContext()); // 改行コードなし
            const doc = helper.getDocumentText(table.range); // 改行コードあり
            // 新しくテーブルを再取得する必要がある。
            table = this.cache.newItem;
            const newPos = this.appContext.getEditorModel().getCursor();
            if (table && newPos && fmt !== doc) {
                this.formatted();
                //this.appMain.commandFactory.createBeautifulFormat().execute();
                //this.updateManager.clearTimeout();
            }
        }
        // ちょっとリファクタ必要かな
        this.docPos = undefined;
    }
}
//# sourceMappingURL=AutoFormatter.js.map