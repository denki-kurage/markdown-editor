import { ICommand } from "../component-model";
import { IAppContext } from "../IAppContext";
import { ITextReplacer } from "../ITextReplacer";
import { TextReplacer } from "../TextReplacer";

export abstract class MarkdownCommandBase<T> implements ICommand
{
    public constructor(protected readonly appContext: IAppContext)
    {

    }

    public getTextReplacer(): ITextReplacer
    {
        return new TextReplacer(this.appContext);
    }
    
    public abstract execute(parameter?: T): void;
    public abstract canExecute(parameter?: T): boolean;
    public readonly canExecuteChanged: (() => void)[] = [];
}

