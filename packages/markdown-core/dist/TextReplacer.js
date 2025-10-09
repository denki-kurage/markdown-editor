export class TextReplacer {
    appContext;
    constructor(appContext) {
        this.appContext = appContext;
    }
    select(selections) {
        this.appContext.getEditorModel().setSelections(selections);
    }
    replaceLines(replaces) {
        const items = replaces.map(replace => {
            const { area, text } = replace;
            const { begin, end } = area;
            const content = this.appContext.getTextSource().lineAt(end - 1);
            const r = {
                sPos: { charIndex: 0, docIndex: begin },
                ePos: { charIndex: content.length, docIndex: end } // TODO: length
            };
            return { area: r, text };
        });
        this.appContext.getEditorModel().replaces(items);
    }
}
//# sourceMappingURL=TextReplacer.js.map