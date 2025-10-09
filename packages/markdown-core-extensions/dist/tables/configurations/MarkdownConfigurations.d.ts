import { IAppContext, IConfigureStorage, MarkdownEventCollection } from "@mde/markdown-core";
import { AutoFormatterConfiguration } from "./AutoFormatterConfiguration";
import { DecoratorConfiguration } from "./DecoratorConfiguration";
export declare class MarkdownConfigurations {
    readonly autoFormatter: AutoFormatterConfiguration;
    readonly decorator: DecoratorConfiguration;
    readonly eventCollection: MarkdownEventCollection;
    constructor(events: MarkdownEventCollection, storage: IConfigureStorage, editorContext: IAppContext);
}
//# sourceMappingURL=MarkdownConfigurations.d.ts.map