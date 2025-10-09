export class CommandBase {
    canExecuteChanged = [];
    raiseCanExecuteChanged() {
        this.canExecuteChanged.forEach(_ => _());
    }
}
export class CommandBaseGeneric extends CommandBase {
    execute(parameter) {
        const p = this.convert(parameter);
        this.executeGeneric(p);
    }
    canExecute(parameter) {
        const p = this.convert(parameter);
        return this.canExecuteGeneric(p);
    }
}
//# sourceMappingURL=CommandBaseGeneric.js.map