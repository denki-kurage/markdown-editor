import { IAppContext, ICommandItem, IConfigurationStorage, IEventsInitializer, IMarkdownEvents, MarkdownCore, MarkdownEventCollection } from "@mde/markdown-core";
import { MarkdownTable } from "./tables/MarkdownTable";
import { MarkdownTableContent } from "./tables";
import { createExtensionMarkdownCommandItem } from "./commands/createCommands";


export class ExMarkdownCore extends MarkdownCore
{
    public readonly table: MarkdownTable;
    private _currentTableContent: MarkdownTableContent | null = null;

    public get currentTableContent():  MarkdownTableContent | null
    {
        return this._currentTableContent;
    }

    
    public constructor(
        appContext: IAppContext,
        configStorage: IConfigurationStorage
    )
    {
        super(appContext, configStorage);

        this.table = this.createMarkdownTable();
        const tableCommands = this.table.getCommandsMap();
        this.getCommandsMap().children?.push(tableCommands);


        this.init();
    }

    protected override createCommands(appContext: IAppContext, eventCollection: MarkdownEventCollection, configStorage: IConfigurationStorage): ICommandItem
    {
        const baseCommands = super.createCommands(appContext, eventCollection, configStorage);
        const commands = createExtensionMarkdownCommandItem(appContext);
        baseCommands.children?.push(commands);
        return baseCommands;
    }
    
	protected createMarkdownTable(): MarkdownTable
	{
		return new MarkdownTable(this.appContext, this.eventCollection, this.configStorage);
	}

    private init()
    {
        const table = this.table;
        table.currentTableChanged.addListener(currentTable => this.onCurrentTableChanged(currentTable));
    }

    private onCurrentTableChanged(currentTable: MarkdownTableContent): void
    {
        this._currentTableContent = currentTable;
    }

    public override dispose(): void
    {
        super.dispose();
        this.table.dispose();
    }

}




