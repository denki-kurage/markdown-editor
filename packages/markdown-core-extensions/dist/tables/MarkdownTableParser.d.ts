import { IMarkdownContentParser, TextReader } from "@mde/markdown-core";
import { MarkdownTableContent } from "./MarkdownTableContent";
export declare class MarkdownTableParser implements IMarkdownContentParser<MarkdownTableContent> {
    parse(textReader: TextReader): MarkdownTableContent | undefined;
    adjust(textReader: TextReader): void;
    private getRow;
}
//# sourceMappingURL=MarkdownTableParser.d.ts.map