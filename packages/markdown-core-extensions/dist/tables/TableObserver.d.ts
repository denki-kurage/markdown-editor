import { MarkdownTableContent } from "./MarkdownTableContent";
import { IAppContext, IMarkdownEvents } from "@mde/markdown-core";
import { ISelectChanged, ITextChanged } from "@mde/markdown-core/dist/ITextEventReciever";
export declare class TableObserver implements Partial<IMarkdownEvents> {
    private readonly appContext;
    private readonly updated;
    private eventManager;
    constructor(appContext: IAppContext, updated: (tables: Array<MarkdownTableContent>) => void);
    textChanged(e: ITextChanged): void;
    selectChanged(e: ISelectChanged): void;
    otherChanged(e?: any): void;
    private lazyUpdate;
    private tableUpdate;
}
//# sourceMappingURL=TableObserver.d.ts.map