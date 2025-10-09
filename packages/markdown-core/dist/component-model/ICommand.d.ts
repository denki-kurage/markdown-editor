export interface ICommand {
    execute(parameter?: any): void;
    canExecute(parameter?: any): boolean;
    canExecuteChanged: Array<() => void>;
}
//# sourceMappingURL=ICommand.d.ts.map