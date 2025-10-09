import { ICommandItem } from "./commands";
import { EventCollection, IConfigureStorage, IDisposable } from "./component-model";
import { IAppContext } from "./IAppContext";
import { ICommandsMapRoot } from "./component-model/ICommandsMap";
import { IMarkdownEvents } from "./IMarkdownEvents";
import { MarkdownEventCollection } from "./MarkdownEventCollection";
import { ITextChanged, ISelectChanged } from "./ITextEventReciever";
import { CommandCollection } from "./CommandCollection";
export declare class MarkdownCore implements ICommandsMapRoot, IDisposable, IMarkdownEvents {
    readonly appContext: IAppContext;
    readonly configStorage: IConfigureStorage;
    readonly eventCollection: EventCollection<IMarkdownEvents>;
    private readonly commands;
    private disposables;
    constructor(appContext: IAppContext, configStorage: IConfigureStorage);
    dispose(): void;
    protected createCommands(appContext: IAppContext, eventCollection: MarkdownEventCollection, configStorage: IConfigureStorage): ICommandItem;
    createCommandCollection(): CommandCollection;
    getCommandsMap(): ICommandItem;
    textChanged(e: ITextChanged): void;
    selectChanged(e: ISelectChanged): void;
    otherChanged(e: any): void;
    cursorChanged(e: number): void;
    formatRequest(e: void): void;
}
//# sourceMappingURL=MarkdownCore.d.ts.map