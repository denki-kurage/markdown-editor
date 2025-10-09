import { IMarkdownContent, IMarkdownContentParser, ITextSource, MarkdownRange, TextReader } from "@mde/markdown-core";
import { MarkdownLineParser } from "./MarkdownLineParser";
export declare class MarkdownParser {
    readonly parsers: ReadonlyArray<IMarkdownContentParser<IMarkdownContent>>;
    private readonly defaultLineParser;
    constructor();
    protected createParsers(): Array<IMarkdownContentParser<IMarkdownContent>>;
    protected createDefaultLineParser(): MarkdownLineParser;
    protected createTextReader(textSource: ITextSource): TextReader;
    parse(textSource: ITextSource): IterableIterator<IMarkdownContent>;
    private nextParse;
    findContent(textSource: ITextSource, line: number): IMarkdownContent | null;
    findContents(textSource: ITextSource, lines: Array<number>): IterableIterator<IMarkdownContent>;
}
export interface IRangeFactory {
    create(s?: number): MarkdownRange;
}
export declare class TextReaderHelper {
    static createRangeFactory(textReader: TextReader): IRangeFactory;
}
//# sourceMappingURL=MarkdownParser.d.ts.map