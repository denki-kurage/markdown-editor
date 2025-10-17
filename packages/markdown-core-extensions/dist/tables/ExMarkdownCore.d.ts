import { IAppContext, IConfigureStorage, MarkdownCore } from "@mde/markdown-core";
import { MarkdownTable } from "./MarkdownTable";
export declare class ExMarkdownCore extends MarkdownCore {
    readonly table: MarkdownTable;
    constructor(appContext: IAppContext, configStorage: IConfigureStorage);
    protected createMarkdownTable(): MarkdownTable;
    private init;
}
//# sourceMappingURL=ExMarkdownCore.d.ts.map