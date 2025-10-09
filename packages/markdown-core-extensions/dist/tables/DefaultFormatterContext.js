import { MarkdownTableConverter, MarkdownTableFormatter } from "./MarkdownTableConverter";
export class DefaultFormatterContext {
    formatter = MarkdownTableFormatter.createInstance();
    tableConverter;
    constructor(mode, returnKey) {
        this.tableConverter = new MarkdownTableConverter(mode, returnKey);
    }
}
//# sourceMappingURL=DefaultFormatterContext.js.map