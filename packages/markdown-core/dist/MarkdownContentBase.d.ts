import { IMarkdownContent } from "./IMarkdownContent";
import { MarkdownRange } from "./MarkdownRange";
export declare class MarkdownContentBase implements IMarkdownContent {
    private _range;
    get range(): MarkdownRange;
    get lineLength(): number;
    decision(range: MarkdownRange): void;
    documentIndexFromContentIndex(contentIndex: number): number;
    contentIndexFromDocumentIndex(documentIndex: number): number;
    isContentIndex(contentIndex: number): boolean;
}
//# sourceMappingURL=MarkdownContentBase.d.ts.map