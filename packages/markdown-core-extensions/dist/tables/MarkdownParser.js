import { MarkdownRange, TextReader } from "@mde/markdown-core";
import { MarkdownLineParser } from "./MarkdownLineParser";
import { MarkdownTableParser } from "./MarkdownTableParser";
export class MarkdownParser {
    parsers;
    defaultLineParser;
    constructor() {
        this.parsers = this.createParsers();
        this.defaultLineParser = this.createDefaultLineParser();
    }
    createParsers() {
        return [
            new MarkdownTableParser()
        ];
    }
    createDefaultLineParser() {
        return new MarkdownLineParser();
    }
    createTextReader(textSource) {
        return new TextReader(textSource);
    }
    *parse(textSource) {
        let result;
        const textReader = this.createTextReader(textSource);
        while (result = this.nextParse(textReader)) {
            yield result;
        }
    }
    nextParse(textReader) {
        for (let reader of [...this.parsers, this.defaultLineParser]) {
            const rb = textReader.createRollbackable();
            const rf = TextReaderHelper.createRangeFactory(textReader);
            // 解析
            const result = reader.parse(textReader);
            if (result) {
                reader.adjust(textReader);
                const range = rf.create(1);
                if (range.isNext) {
                    result.decision(range);
                    return result;
                }
            }
            rb.rollback();
        }
    }
    findContent(textSource, line) {
        for (let content of this.parse(textSource)) {
            if (content.range.internal(line)) {
                return content;
            }
        }
        return null;
    }
    *findContents(textSource, lines) {
        for (let content of this.parse(textSource)) {
            if (lines.findIndex(t => content.range.internal(t)) !== -1) {
                yield content;
            }
        }
    }
}
export class TextReaderHelper {
    static createRangeFactory(textReader) {
        const beginPosition = textReader.position;
        return {
            create(s = 0) {
                return new MarkdownRange(beginPosition + s, textReader.position + s);
            }
        };
    }
}
//# sourceMappingURL=MarkdownParser.js.map