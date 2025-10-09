import { ICommandItem } from "./commands";
export declare class CommandCollection {
    readonly root: ICommandItem;
    constructor(root: ICommandItem);
    getCommand(name: string): ICommandItem | undefined;
    getCommand3(name: string): ICommandItem | undefined;
    getAllCommands(): Generator<ICommandItem, void, unknown>;
    execute(name: string, parameter?: any): void;
}
//# sourceMappingURL=CommandCollection.d.ts.map