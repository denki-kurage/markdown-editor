import { BooleanConfigValue, IAppContext, IConfigureStorage } from "@mde/markdown-core";
import { MarkdownTableContent } from "../MarkdownTableContent";
export declare class DecoratorConfiguration extends BooleanConfigValue {
    private readonly editorContext;
    constructor(editorContext: IAppContext, storage: IConfigureStorage);
    protected onValueChanged(value: boolean): void;
    decorate(nv?: MarkdownTableContent): void;
}
//# sourceMappingURL=DecoratorConfiguration.d.ts.map