import { IAppContext, IDocumentPosition } from "@mde/markdown-core";
import { MarkdownTableContent } from "./MarkdownTableContent";
export declare class TableDecorator {
    private readonly appContext;
    constructor(appContext: IAppContext);
    private getDecorationInternal;
    private toDecSelection;
    decorate(table: MarkdownTableContent, docPos: IDocumentPosition): void;
}
//# sourceMappingURL=TableDecorator.d.ts.map