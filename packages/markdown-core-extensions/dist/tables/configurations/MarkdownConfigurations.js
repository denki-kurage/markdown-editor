import { AutoFormatterConfiguration } from "./AutoFormatterConfiguration";
import { DecoratorConfiguration } from "./DecoratorConfiguration";
export class MarkdownConfigurations {
    autoFormatter;
    decorator;
    eventCollection;
    constructor(events, storage, editorContext) {
        this.eventCollection = events;
        this.autoFormatter = new AutoFormatterConfiguration(events, storage);
        this.decorator = new DecoratorConfiguration(editorContext, storage);
    }
}
//# sourceMappingURL=MarkdownConfigurations.js.map