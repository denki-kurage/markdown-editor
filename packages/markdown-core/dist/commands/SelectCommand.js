import { MarkdownCommandBase } from "./MarkdownCommandBase";
export class SelectCommand extends MarkdownCommandBase {
    execute(parameter) {
        const p = parameter?.selections;
        if (p) {
            this.appContext.getEditorModel().setSelections(p);
            this.appContext.getEditorModel().scroll(p[0].sPos.docIndex);
        }
    }
    canExecute(parameter) {
        return true;
    }
}
//# sourceMappingURL=SelectCommand.js.map