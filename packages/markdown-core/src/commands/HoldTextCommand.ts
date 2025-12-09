import { IAppContext } from "../IAppContext";
import { IReplaceText } from "../IReplaceText";
import { ISelection } from "../ISelection";
import { MarkdownCommandBase } from "./MarkdownCommandBase";

export type HoldTextParams =
{
    characters: string;
    afterCharacters?: string;
}



/**
 * このコマンドは、replaces()がテキスト変更後に、変更箇所を選択状態にしていることが前提となっています。
 */
export class HoldTextCommand extends MarkdownCommandBase<HoldTextParams>
{
    public constructor(
        appContext: IAppContext,
        protected readonly holdCharacters: string = '_',
        protected readonly afterCharacters?: string,
        protected readonly wrapper: (text: string) => [string, string] = (text) => ['', '']
    ) {
        super(appContext);
    }

    public execute(parameter?: any)
    {
        const characters = this.holdCharacters;
        const afterCharacters = this.afterCharacters ?? characters;
        const selections = this.appContext.getEditorModel().getSelections();
        const model = this.appContext.getEditorModel();

        const replaceItems = selections.map(selection => {
            const text = this.appContext.getEditorModel().getText(selection);
            const wrappedTexts = this.wrapper(text);
            const [startWrap, endWrap] = wrappedTexts;

            return {
                area: selection,
                text: `${characters}${startWrap}${text}${endWrap}${afterCharacters}`
            };
        });

        if(replaceItems.length)
        {
            model.replaces(replaceItems, (text, newSelection) => this.reselect(text, newSelection));
            this.onReplaced(replaceItems)
        }
    }

    protected onReplaced(replaceItems: { area: ISelection, text: string }[] ): void
    {

    }

    protected reselect(text: string, newSelection: ISelection): ISelection
    {
        const model = this.appContext.getEditorModel();
        const wrappedTexts = this.wrapper(text);
        const s = wrappedTexts[0]?.length ?? 0;
        const e = wrappedTexts[1]?.length ?? 0;

        const rs = {
            sPos: model.indexToPosition(model.positionToIndex(newSelection.sPos) + this.holdCharacters.length + s),
            ePos: model.indexToPosition(model.positionToIndex(newSelection.ePos) - (this.afterCharacters ?? this.holdCharacters).length - e)
        };

        return rs;
    }

    public canExecute(parameter?: any): boolean
    {
        return true;
    }
}


export class CodeHoldTextCommand extends HoldTextCommand
{
    public constructor(appContext: IAppContext)
    {
        super(appContext,
            "\n```",
            "```\n",
            text => [
                text.indexOf("\n") === 0 ? '' : "\n",
                text.lastIndexOf("\n") === text.length - 1 && !!text.length ? '' : "\n"
            ]);
    }

    protected override onReplaced(replaceItems: { area: ISelection; text: string; }[]): void
    {
        console.log("wwwwwwwwwxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
        this.appContext.getEditControl().openSuggest();
    }

    protected override reselect(text: string, newSelection: ISelection): ISelection
    {
        const model = this.appContext.getEditorModel();
        const sPos = model.indexToPosition(model.positionToIndex(newSelection.sPos) + 4);
        return { sPos, ePos: sPos }
    }

}
