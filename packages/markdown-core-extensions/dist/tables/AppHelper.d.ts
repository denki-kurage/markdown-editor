import { MarkdownTableContent } from "./MarkdownTableContent";
import { MarkdownTableRenderMode } from "./MarkdownTableConverter";
import { IFormatterContext } from "./IFormatterContext";
import { IAppContext, IDocumentPosition, MarkdownRange } from "@mde/markdown-core";
export declare class AppHelper {
    readonly appContext: IAppContext;
    constructor(appContext: IAppContext);
    getTable(pos?: IDocumentPosition): MarkdownTableContent | undefined;
    getTableContents(): Array<MarkdownTableContent>;
    formatTable(table: MarkdownTableContent, renderMode: MarkdownTableRenderMode): string;
    formatAndRender(table: MarkdownTableContent, context: IFormatterContext): string;
    getDocumentText(range: MarkdownRange): string | undefined;
}
//# sourceMappingURL=AppHelper.d.ts.map