import { TextReplacer } from "../TextReplacer";
export class MarkdownCommandBase {
    appContext;
    constructor(appContext) {
        this.appContext = appContext;
    }
    getTextReplacer() {
        return new TextReplacer(this.appContext);
    }
    canExecuteChanged;
}
//# sourceMappingURL=MarkdownCommandBase.js.map