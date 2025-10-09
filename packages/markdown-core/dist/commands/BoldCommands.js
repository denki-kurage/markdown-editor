import { MarkdownCommandBase } from "./MarkdownCommandBase";
export class BoldCommand extends MarkdownCommandBase {
    execute(parameter) {
        const selections = this.appContext.getEditorModel().getSelections();
        console.log(selections);
        if (selections.length) {
            const replaceParams = selections.map(selection => {
                const text = this.appContext.getEditorModel().getText(selection);
                return { area: selection, text: `**${text}**` };
            });
            this.appContext.getEditorModel().replaces(replaceParams);
        }
    }
    canExecute(parameter) {
        return true;
    }
}
//# sourceMappingURL=BoldCommands.js.map