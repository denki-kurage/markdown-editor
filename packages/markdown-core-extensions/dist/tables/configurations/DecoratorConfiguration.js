import { BooleanConfigValue } from "@mde/markdown-core";
import { TableDecorator } from "../TableDecorator";
export class DecoratorConfiguration extends BooleanConfigValue {
    editorContext;
    constructor(editorContext, storage) {
        super('markdown:decorator', true, storage);
        this.editorContext = editorContext;
    }
    onValueChanged(value) {
        if (!this.getValue()) {
            this.editorContext.getDecorator().clearDecorate();
        }
    }
    decorate(nv) {
        if (this.getValue()) {
            const ctx = this.editorContext;
            ctx.getDecorator().clearDecorate();
            if (nv) {
                const pos = ctx.getEditorModel().getCursor();
                if (pos) {
                    // ctx.getDecorator().decorate(nv, pos);
                    new TableDecorator(ctx).decorate(nv, pos);
                }
            }
        }
    }
}
//# sourceMappingURL=DecoratorConfiguration.js.map