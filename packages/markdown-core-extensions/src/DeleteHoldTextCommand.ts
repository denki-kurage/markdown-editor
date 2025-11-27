import { IAppContext, MarkdownCommandBase, MarkdownParser } from "@mde/markdown-core";
import { createFilter, flatItem } from "./token-utils";

export enum DelDecorations
{
    Bold = 0x01,
    Italic = 0x02,
    Strike = 0x04,
    Under = 0x08,
    InlineCode = 0x10,
    All = Bold | Italic | Strike | Under | InlineCode,
}

export class DeleteHoldTextCommand extends MarkdownCommandBase<any>
{
    constructor(appContext: IAppContext, private readonly decorations = DelDecorations.All) {
        super(appContext);
    }
    
    public getTargetTokens()
    {
        const parser = new MarkdownParser();
        const model = this.appContext.getEditorModel();
        const selections = model.getSelections().map(s => [model.positionToIndex(s.sPos), model.positionToIndex(s.ePos)] as [number, number]);
        const rootToken = parser.parseTokenTree(model.getText(undefined));
        const tokenTypes = [
            (this.decorations & DelDecorations.Bold) ? 'strong' : undefined,
            (this.decorations & DelDecorations.Italic) ? 'emphasis' : undefined,
            (this.decorations & DelDecorations.Strike) ? 'delete' : undefined,
            (this.decorations & DelDecorations.Under) ? 'html' : undefined,
            (this.decorations & DelDecorations.InlineCode) ? 'inlineCode' : undefined,
        ].filter((v) => !!v);

        const filter = createFilter({
            tokenTypes,
            selections,
            selectionAllMode: true,
            useSelections: true
        });

        return [...flatItem(rootToken, token => token.getChildren(), filter)];
    }


    public execute(parameter)
    {
        const model = this.appContext.getEditorModel();
        const tokens = this.getTargetTokens();
        const replaceItems = tokens.map(token => {
            const { start, end } = token.getPosition();
            const selection = { sPos: model.indexToPosition(start), ePos: model.indexToPosition(end) };
            const text = model.getText(selection);

            if (token.getType() === 'html')
            {
                const tagMatch = text.match(/^<u>([\s\S]*?)<\/u>$/i);
                if (tagMatch) {
                    return {
                        text: tagMatch[1],
                        area: selection
                    };
                }
            }
            else {
                const newText = text
                    .replace(/^(\*\*|\*|__|~~|`|_)+/, '')
                    .replace(/(\*\*|\*|__|~~|`|_)+$/, '');
                return {
                    area: selection,
                    text: newText
                };
            }
        }).filter(item => !!item);

        if (replaceItems.length)
        {
            model.replaces(replaceItems);
        }
    }

    canExecute(parameter) {
        return true;
    }
}