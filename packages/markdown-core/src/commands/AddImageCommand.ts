import { MarkdownRange } from "../MarkdownRange";
import { MarkdownCommandBase } from "./MarkdownCommandBase";
import { MarkdownEscapeHelper } from "./MarkdownEscapeHelper";

export interface AddImageCommandParams
{
    imageUrl: string;
    thumbnail: [string, number, number] | undefined;
    addMode: 'figure' | 'markdown';
}


export class AddImageCommand extends MarkdownCommandBase<AddImageCommandParams>
{


    protected getSelectedText(): string
    {
        const model = this.appContext.getEditorModel();
        return model.getText(model.getSelections()?.[0]) ?? '';
    }

    private toMarkdown(parameter: AddImageCommandParams): string
    {
        const { imageUrl, thumbnail, addMode} = parameter;
        const text = this.getSelectedText();
        const escText = MarkdownEscapeHelper.escapeMarkdownText(text || 'image');
        const escAttr = MarkdownEscapeHelper.escapeHtmlAttributeText(text || 'image');

        if(thumbnail)
        {
            const [thumbnailUrl, width, height] = thumbnail;

            if('figure' === addMode)
            {
                const thumbnailImage = `<img src="${thumbnailUrl}" width="${width}" height="${height}" alt="${escAttr}" />`;
                return `<figure><a href="${imageUrl}" target="_blank">${thumbnailImage}</a></figure>`;
            }

            else
            {
                return `[![${escText}](${thumbnailUrl})](${imageUrl})`;
            }
        }

        return `![${escText}](${imageUrl})`;
    }


    public execute(parameter: AddImageCommandParams)
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
