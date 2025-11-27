import { IAppContext, MarkdownCommandBase } from "@mde/markdown-core";

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
    
    public execute(parameter?: any)
    {
        const selections = this.appContext.getEditorModel().getSelections();
        const model = this.appContext.getEditorModel();
        const state = this.state;

        const replaceItems = selections.map(selection => {
            const text = model.getText(selection);
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
            
        })

        model.replaces(replaceItems);
    }

    public canExecute(parameter?: any): boolean
    {
        return true;
    }

}


