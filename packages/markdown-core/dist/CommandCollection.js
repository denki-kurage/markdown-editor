export class CommandCollection {
    root;
    constructor(root) {
        this.root = root;
    }
    getCommand(name) {
        const items = [this.root];
        while (items.length) {
            const current = items.pop();
            if (current.name === name) {
                return current;
            }
            items.push(...(current.children ?? []));
        }
    }
    getCommand3(name) {
        return this.getAllCommands().find(c => c.name === name);
    }
    *getAllCommands() {
        const items = [this.root];
        while (items.length) {
            const current = items.pop();
            yield current;
            items.push(...(current.children ?? []));
        }
    }
    execute(name, parameter) {
        const item = this.getCommand(name);
        item.command.execute(parameter);
    }
}
//# sourceMappingURL=CommandCollection.js.map