import { MarkdownTableContent } from "./MarkdownTableContent";
import { IFormatterContext } from "./IFormatterContext";
import { IAppContext } from "@mde/markdown-core";
export interface ICommandContext {
    appContext: IAppContext;
    getFormatterContext(): IFormatterContext;
    getTable(): MarkdownTableContent | undefined;
}
//# sourceMappingURL=ICommandContext.d.ts.map