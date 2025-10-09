import { AppHelper } from "./AppHelper";
import { EventUpdateManager } from "@mde/markdown-core";
export class TableObserver {
    appContext;
    updated;
    eventManager;
    constructor(appContext, updated) {
        this.appContext = appContext;
        this.updated = updated;
        this.eventManager = new EventUpdateManager(300);
        this.eventManager.updated.push(() => {
            this.tableUpdate();
        });
    }
    textChanged(e) {
        this.lazyUpdate();
    }
    selectChanged(e) {
        this.lazyUpdate();
    }
    otherChanged(e) {
        // テキスト変更やセレクション変更以外、つまりエディタの変更時などは即時更新。
        this.eventManager.update();
    }
    lazyUpdate() {
        this.eventManager.lazyUpdate();
    }
    tableUpdate() {
        const tables = new AppHelper(this.appContext).getTableContents();
        //console.log(tables)
        this.updated(tables);
    }
}
//# sourceMappingURL=TableObserver.js.map