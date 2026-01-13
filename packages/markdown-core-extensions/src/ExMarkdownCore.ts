import { ConfigurationHelper, IAppContext, ICommandItem, IConfigurationStorage, MarkdownCore, MarkdownEventCollection } from "@kurage/markdown-core";
import { MarkdownTable } from "./tables/MarkdownTable";
import { MarkdownTableContent } from "./tables";
import { createExtensionMarkdownCommandItem } from "./createCommands";
import { ExtensionConfigStorageHelper } from "./ExtensionConfigStorageHelper";
import { MarkdownConfigurations } from "./configurations/MarkdownConfigurations";

export class ExMarkdownCore extends MarkdownCore
{
    public readonly table: MarkdownTable;
    private _currentTableContent: MarkdownTableContent | null = null;
    public readonly configurations: MarkdownConfigurations;

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


        this.configurations = new MarkdownConfigurations(this.eventCollection, this.configStorage, this.appContext);
        this.table = this.createMarkdownTable();
        const tableCommands = this.table.getCommandsMap();
        this.getCommandsMap().children?.push(tableCommands);

        this.init();
    }

    public override getConfigurationHelper(): ExtensionConfigStorageHelper
    {
        return new ExtensionConfigStorageHelper(this.configStorage);
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
		return new MarkdownTable(this.appContext, this.eventCollection, this.configurations);
	}

    private init()
    {
        const table = this.table;
        table.currentTableChanged.addListener(currentTable => this.onCurrentTableChanged(currentTable));
    }

    private onCurrentTableChanged(currentTable?: MarkdownTableContent): void
    {
        this._currentTableContent = currentTable ?? null;
    }

    public override dispose(): void
    {
        super.dispose();
        this.table.dispose();
    }

}




