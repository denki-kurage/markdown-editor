import { ICommandParameter } from "@mde/markdown-core";
import { MarkdownTableContent } from "../MarkdownTableContent";
export interface ITableCommandParameter extends ICommandParameter {
    table: MarkdownTableContent;
    docIndex: number;
    charIndex: number;
}
//# sourceMappingURL=ITableCommandParameter.d.ts.map