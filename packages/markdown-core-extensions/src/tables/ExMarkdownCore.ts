import { IAppContext, IConfigureStorage, IEventsInitializer, IMarkdownEvents, MarkdownCore } from "@mde/markdown-core";
import { MarkdownTable } from "./MarkdownTable";

export class ExMarkdownCore extends MarkdownCore
{
    public readonly table: MarkdownTable;
    
    public constructor(
        appContext: IAppContext,
        configStorage: IConfigureStorage
    )
    {
        super(appContext, configStorage);
        this.table = this.createMarkdownTable();
    }

    
	protected createMarkdownTable(): MarkdownTable
	{
		return new MarkdownTable(this.appContext, this.eventCollection, this.configStorage);
	}

    private init()
    {
        /*
        markdownApp.eventCollection.add({ cursorChanged: onCursorPositionChanged });

        const table = this.table;
        table.tableUpdated.addListener(tables => onTablesChanged(tables));
        table.currentTableChanged.addListener(currentTable => onCurrentTableChanged(currentTable));
        */
    }

}




