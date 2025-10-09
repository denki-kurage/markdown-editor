import { MarkdownTableRenderMode, IMarkdownTableFormatter } from "./MarkdownTableConverter";
import { IFormatterContext } from "./IFormatterContext";
import { ITableConverter } from "./ITableConverter";
export declare class DefaultFormatterContext implements IFormatterContext {
    readonly formatter: IMarkdownTableFormatter;
    readonly tableConverter: ITableConverter<string>;
    constructor(mode: MarkdownTableRenderMode, returnKey: string);
}
//# sourceMappingURL=DefaultFormatterContext.d.ts.map