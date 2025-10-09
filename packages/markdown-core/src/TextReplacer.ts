import { IAppContext } from "./IAppContext";
import { IReplaceText } from "./IReplaceText";
import { ISelection } from "./ISelection";
import { ITextReplacer } from "./ITextReplacer";
import { MarkdownRange } from "./MarkdownRange";

export class TextReplacer implements ITextReplacer
{
    public constructor(private readonly appContext: IAppContext)
    {
    }

    public select(selections: ISelection[]): void
    {
        this.appContext.getEditorModel().setSelections(selections);
    }

    public replaceLines(replaces: { area: MarkdownRange, text: string }[]): void
    {
        const items = replaces.map<IReplaceText>(replace => {
            const { area, text } = replace;
            const { begin, end } = area;
            const content = this.appContext.getTextSource().lineAt(end - 1);
            const r: ISelection =
            {
                sPos: { charIndex: 0, docIndex: begin },
                ePos: { charIndex: content.length, docIndex: end } // TODO: length
            }
            return { area: r, text };
        });

        this.appContext.getEditorModel().replaces(items)
    }
}
