import { MarkdownCore } from "@mde/markdown-core";
import { MarkdownTable } from "./MarkdownTable";
export class ExMarkdownCore extends MarkdownCore {
    table;
    constructor(appContext, eventRegister, configStorage) {
        super(appContext, eventRegister, configStorage);
        this.table = this.createMarkdownTable();
    }
    createMarkdownTable() {
        return new MarkdownTable(this.appContext, this.eventCollection, this.configStorage);
    }
    init() {
        /*
        markdownApp.eventCollection.add({ cursorChanged: onCursorPositionChanged });

        const table = this.table;
        table.tableUpdated.addListener(tables => onTablesChanged(tables));
        table.currentTableChanged.addListener(currentTable => onCurrentTableChanged(currentTable));
        */
    }
}
//# sourceMappingURL=ExMarkdownCore.js.map