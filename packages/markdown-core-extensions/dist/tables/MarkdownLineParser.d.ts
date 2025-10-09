import { IMarkdownContentParser, TextReader } from "@mde/markdown-core";
import { MarkdownLineContent } from "./MarkdownLineContent";
export declare class MarkdownLineParser implements IMarkdownContentParser<MarkdownLineContent> {
    parse(textReader: TextReader): MarkdownLineContent | undefined;
    adjust(textReader: TextReader): void;
}
//# sourceMappingURL=MarkdownLineParser.d.ts.map