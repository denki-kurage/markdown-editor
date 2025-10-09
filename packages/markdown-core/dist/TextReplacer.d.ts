import { IAppContext } from "./IAppContext";
import { ISelection } from "./ISelection";
import { ITextReplacer } from "./ITextReplacer";
import { MarkdownRange } from "./MarkdownRange";
export declare class TextReplacer implements ITextReplacer {
    private readonly appContext;
    constructor(appContext: IAppContext);
    select(selections: ISelection[]): void;
    replaceLines(replaces: {
        area: MarkdownRange;
        text: string;
    }[]): void;
}
//# sourceMappingURL=TextReplacer.d.ts.map