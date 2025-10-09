import { MarkdownParser } from "./MarkdownParser";
import { MarkdownTableContent } from "./MarkdownTableContent";
import { MarkdownTableConverter, MarkdownTableFormatter } from "./MarkdownTableConverter";
import { TextReader } from "@mde/markdown-core";
export class AppHelper {
    appContext;
    constructor(appContext) {
        this.appContext = appContext;
    }
    getTable(pos) {
        const ts = this.appContext.getTextSource();
        pos = pos || this.appContext.getEditorModel().getCursor();
        ;
        if (ts && pos) {
            const parser = new MarkdownParser();
            const content = parser.findContent(ts, pos.docIndex);
            if (content instanceof MarkdownTableContent) {
                return content;
            }
        }
    }
    getTableContents() {
        const ts = this.appContext.getTextSource();
        if (ts) {
            const parser = new MarkdownParser();
            return [...parser.parse(ts)].filter(_ => _ instanceof MarkdownTableContent);
        }
        return [];
    }
    formatTable(table, renderMode) {
        const formatter = MarkdownTableFormatter.createInstance();
        formatter.format(table);
        const converter = new MarkdownTableConverter(renderMode, this.appContext.returnKey());
        return converter.fromTable(table);
    }
    formatAndRender(table, context) {
        context.formatter.format(table);
        return context.tableConverter.fromTable(table);
    }
    getDocumentText(range) {
        const ts = this.appContext.getTextSource();
        if (ts) {
            const tr = new TextReader(ts);
            return tr.getText(range.begin, range.end).join(this.appContext.returnKey());
        }
    }
}
//# sourceMappingURL=AppHelper.js.map