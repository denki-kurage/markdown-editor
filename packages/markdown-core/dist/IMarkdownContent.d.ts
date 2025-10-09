import { MarkdownRange } from "./MarkdownRange";
export interface IMarkdownContent {
    /**
     * パーサーによって解析されたコンテントの
     */
    decision(range: MarkdownRange): void;
    /**
     * getter
     */
    range: MarkdownRange;
}
//# sourceMappingURL=IMarkdownContent.d.ts.map