import { MarkdownLineContent } from "./MarkdownLineContent";
export class MarkdownLineParser {
    parse(textReader) {
        if (textReader.moveNext()) {
            return new MarkdownLineContent(textReader.current);
        }
    }
    adjust(textReader) {
    }
}
//# sourceMappingURL=MarkdownLineParser.js.map