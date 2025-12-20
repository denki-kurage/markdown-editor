import { MarkdownRange } from "../MarkdownRange";
import { MarkdownCommandBase } from "./MarkdownCommandBase";
import { MarkdownEscapeHelper } from "./MarkdownEscapeHelper";

export interface AddLinkCommandParams
{
    url: string;
    title: string;
}

export class AddLinkCommand extends MarkdownCommandBase<AddLinkCommandParams>
{
    
    protected getSelectedText(): string
    {
        const model = this.appContext.getEditorModel();
        return model.getText(model.getSelections()?.[0]) ?? '';
    }

    protected toMarkdown(parameter: AddLinkCommandParams): string
    {
        const { url, title } = parameter;
        const text = this.getSelectedText();
        const escText = MarkdownEscapeHelper.escapeMarkdownText(text || title);;
        const escUrl = MarkdownEscapeHelper.escapeMarkdownLinkText(url);

        return `[${escText}](${escUrl})`;
    }

    public execute(parameter: AddLinkCommandParams)
    {
        const pos = this.appContext.getEditorModel().getCursor();
        const markdown = this.toMarkdown(parameter);

        const p = pos?.docIndex ?? 0;
        this.getTextReplacer().replaceLines([{ area: new MarkdownRange(p, p + 1), text: markdown }]);
    }

    public canExecute(parameter?: any): boolean
    {
        return true;
    }

}
        