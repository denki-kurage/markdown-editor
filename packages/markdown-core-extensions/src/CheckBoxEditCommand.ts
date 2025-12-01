import { IAppContext, MarkdownCommandBase, MarkdownParser } from "@mde/markdown-core";
import { createFilter, flatItem } from "./token-utils";

export enum CheckBoxState
{
    Checked,
    Unchecked,
    Toggle,
    RemoveCheckBox
}

export class CheckBoxEditCommand extends MarkdownCommandBase<any>
{

    public constructor(appContext: IAppContext, private readonly state: CheckBoxState)
    {
        super(appContext);
    }

    public hasCheckBox(text: string): boolean
    {
        return /^\s*[-*+]\s+\[[ xX]\]\s+/.test(text);
    }

    public isChecked(text: string): boolean
    {
        const match = text.match(/^\s*[-*+]\s+\[([ xX])\]\s+/);
        if(match)
        {
            return match[1].toLowerCase() === 'x';
        }
        return false;
    }

    public addCheckBox(text: string, checked: boolean): string
    {
        const checkChar = checked ? 'x' : ' ';
        return text.replace(/^(\s*[-*+]\s+)/, `$1[${checkChar}] `);
    }

    public setCheckBox(text: string, checked: boolean): string
    {
        const checkChar = checked ? 'x' : ' ';
        return text.replace(/^(\s*[-*+]\s+)\[[ xX]\]\s+/, `$1[${checkChar}] `);
    }

    public toggleCheckBox(text: string): string
    {
        return text.replace(/^(\s*[-*+]\s+\[)([ xX]?)(\]\s+)/, (match, p1, p2, p3) => {
            const newState = (p2 === ' ' ? 'x' : ' ');
            return `${p1}${newState}${p3}`;
        });
    }

    protected removeCheckBox(text: string): string
    {
        return text.replace(/^(\s*[-*+]\s+)\[[ xX]\]\s+/, '$1');
    }

    
    public getTargetTokens()
    {
        const parser = new MarkdownParser();
        const model = this.appContext.getEditorModel();
        const selections = model.getSelections().map(s => [model.positionToIndex(s.sPos), model.positionToIndex(s.ePos)] as [number, number]);
        const rootToken = parser.parseTokenTree(model.getText(undefined));
        const tokenTypes = ['listItem'];

        const filter = createFilter({
            tokenTypes,
            selections,
            selectionAllMode: false,
            useSelections: true
        });

        return [...flatItem(rootToken, token => token.getChildren())].filter(filter);
    }
    
    public execute(parameter?: any)
    {
        const model = this.appContext.getEditorModel();
        const state = this.state;
        const ts = this.appContext.getTextSource();
        const selections = this.appContext.getEditorModel().getSelections().map(s => [
            Math.min(s.sPos.docIndex, s.ePos.docIndex),
            Math.max(s.sPos.docIndex, s.ePos.docIndex)
        ]);
        const range = (docIndex: number) => selections.some(([s, e]) => docIndex >= s && docIndex <= e);

        const replaceItems = this.getTargetTokens().map(token => {
            const { start } = token.getPosition();
            const { docIndex } = model.indexToPosition(start);

            if(!range(docIndex))
            {
                return null;
            }

            const text = ts.lineAt(docIndex);
            const selection = {
                sPos: { docIndex, charIndex: 0 },
                ePos: { docIndex, charIndex: text.length }
            }
            let editText = text;

            if(state === CheckBoxState.Checked || state === CheckBoxState.Unchecked)
            {
                if(!this.hasCheckBox(text))
                {
                    editText = this.addCheckBox(text, state === CheckBoxState.Checked);
                }
                else
                {
                    editText = this.setCheckBox(text, state === CheckBoxState.Checked);
                }
            }
            else if(state === CheckBoxState.Toggle)
            {
                if(this.hasCheckBox(text))
                {
                    editText = this.toggleCheckBox(text);
                }
            }
            else if(state === CheckBoxState.RemoveCheckBox)
            {
                if(this.hasCheckBox(text))
                {
                    editText = this.removeCheckBox(text);
                }
            }

            return {
                area: selection,
                text: editText
            };
            
        }).filter(item => !!item);

        model.replaces(replaceItems);
    }

    public canExecute(parameter?: any): boolean
    {
        return true;
    }

}


