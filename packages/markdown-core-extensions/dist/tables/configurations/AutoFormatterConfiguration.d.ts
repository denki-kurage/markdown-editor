import { BooleanConfigValue, EventCollection, IConfigureStorage, IMarkdownEvents } from "@mde/markdown-core";
export declare class AutoFormatterConfiguration extends BooleanConfigValue {
    private readonly events;
    constructor(events: EventCollection<IMarkdownEvents>, storage: IConfigureStorage);
    protected onValueChanged(value: boolean): void;
}
//# sourceMappingURL=AutoFormatterConfiguration.d.ts.map