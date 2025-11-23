import { IAppContext, IConfigureStorage, IEventsInitializer, IMarkdownEvents, MarkdownCore } from "@mde/markdown-core";
import { MarkdownTable } from "./MarkdownTable";
import { MarkdownTableContent } from "./MarkdownTableContent";

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
        configStorage: IConfigureStorage
    )
    {
        super(appContext, configStorage);
        this.table = this.createMarkdownTable();

        this.init();
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




