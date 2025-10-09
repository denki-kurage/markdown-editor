import { ISelection } from "../ISelection";
import { MarkdownCommandBase } from "./MarkdownCommandBase";



export type SelectCommandParams = 
{
    selections: ISelection[]
}

export class SelectCommand extends MarkdownCommandBase<SelectCommandParams>
{
    public execute(parameter?: SelectCommandParams | undefined)
    {
        const p = parameter?.selections;
        if(p)
        {
            this.appContext.getEditorModel().setSelections(p);
            this.appContext.getEditorModel().scroll(p[0].sPos.docIndex);
        }
    }

    public canExecute(parameter?: SelectCommandParams | undefined): boolean
    {
        return true;
    }

}

