import { MarkdownTableContent, MarkdownTableRows, MarkdownTableAlignments } from "./MarkdownTableContent";
export class MarkdownTableParser {
    parse(textReader) {
        if (textReader.moveNext()) {
            const header = MarkdownTableRows.createInstance(textReader.current);
            if (header && textReader.moveNext()) {
                const alignment = MarkdownTableAlignments.createInstance(textReader.current);
                if (alignment && (header.cells.length <= alignment.cells.length)) {
                    const rows = [...this.getRow(textReader, header.cells.length)];
                    return new MarkdownTableContent(header, alignment, rows);
                }
            }
        }
    }
    adjust(textReader) {
        textReader.moveBack();
    }
    *getRow(textReader, limit) {
        while (textReader.moveNext()) {
            const row = MarkdownTableRows.createInstance(textReader.current, limit);
            if (!row) {
                break;
            }
            yield row;
        }
    }
}
//# sourceMappingURL=MarkdownTableParser.js.map