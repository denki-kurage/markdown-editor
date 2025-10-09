import { IAppContext, IConfigureStorage, IEventsInitializer, IMarkdownEvents, MarkdownCore } from "@mde/markdown-core";
import { MarkdownTable } from "./MarkdownTable";
export declare class ExMarkdownCore extends MarkdownCore {
    readonly table: MarkdownTable;
    constructor(appContext: IAppContext, eventRegister: IEventsInitializer<IMarkdownEvents>, configStorage: IConfigureStorage);
    protected createMarkdownTable(): MarkdownTable;
    private init;
}
//# sourceMappingURL=MarkdownCore.d.ts.map