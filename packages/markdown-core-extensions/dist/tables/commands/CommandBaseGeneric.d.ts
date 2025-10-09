import { ICommand } from "@mde/markdown-core";
export declare abstract class CommandBase implements ICommand {
    readonly canExecuteChanged: Array<() => void>;
    abstract execute(parameter?: any): void;
    abstract canExecute(parameter?: any): boolean;
    raiseCanExecuteChanged(): void;
}
export declare abstract class CommandBaseGeneric<T> extends CommandBase {
    protected abstract convert(parameter: any): T | undefined;
    protected abstract executeGeneric(parameter: T | undefined): void;
    protected abstract canExecuteGeneric(parameter: T | undefined): boolean;
    execute(parameter?: any): void;
    canExecute(parameter?: any): boolean;
}
//# sourceMappingURL=CommandBaseGeneric.d.ts.map