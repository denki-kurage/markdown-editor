import { BooleanConfigValue } from "@mde/markdown-core";
export class AutoFormatterConfiguration extends BooleanConfigValue {
    events;
    constructor(events, storage) {
        super('markdown:format', true, storage);
        this.events = events;
    }
    onValueChanged(value) {
        if (value) {
            //this.events.formatRequest.add(() => this.events.otherChanged.emit({}));
        }
        else {
            //this.events.remove()
        }
    }
}
//# sourceMappingURL=AutoFormatterConfiguration.js.map