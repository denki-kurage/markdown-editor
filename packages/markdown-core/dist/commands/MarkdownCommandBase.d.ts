import { ICommand } from "../component-model";
import { IAppContext } from "../IAppContext";
import { ITextReplacer } from "../ITextReplacer";
export declare abstract class MarkdownCommandBase<T> implements ICommand {
    protected readonly appContext: IAppContext;
    constructor(appContext: IAppContext);
    getTextReplacer(): ITextReplacer;
    abstract execute(parameter?: T): any;
    abstract canExecute(parameter?: T): boolean;
    canExecuteChanged: (() => void)[];
}
//# sourceMappingURL=MarkdownCommandBase.d.ts.map