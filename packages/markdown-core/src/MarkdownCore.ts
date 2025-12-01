import { AddBlogCardCommand, AddImageCommand, BoldCommand, ICommandItem, SelectCommand } from "./commands";
import { EventCollection, IConfigureStorage, IDisposable } from "./component-model";
import { IAppContext } from "./IAppContext";
import { ICommandsMapRoot } from "./component-model/ICommandsMap";
import { IMarkdownEvents } from "./IMarkdownEvents";
import { MarkdownEventCollection } from "./MarkdownEventCollection";
import { ITextChanged, ISelectChanged } from "./ITextEventReciever";
import { CommandCollection } from "./CommandCollection";
import { createDefaultMarkdownCommandItem } from "./commands/createCommands";


export class MarkdownCore implements ICommandsMapRoot, IDisposable, IMarkdownEvents
{
	public readonly eventCollection: EventCollection<IMarkdownEvents>;
	private readonly commands: ICommandItem;
	private disposables: IDisposable[] = [];

	public constructor(
		public readonly appContext: IAppContext,
		public readonly configStorage: IConfigureStorage
	)
	{
		this.eventCollection = new EventCollection<IMarkdownEvents>();
		
		const deliver = this.eventCollection.deliver(s => {
			return {
				cursorChanged: s.select(x => x.cursorChanged),
				formatRequest: s.select(x => x.formatRequest),
				otherChanged: s.select(x => x.otherChanged),
				selectChanged: s.select(x => x.selectChanged),
				textChanged: s.select(x => x.textChanged)
			}
		})

		this.disposables.push(
			this.eventCollection.add(this),
			appContext.getEventsInitializer().initializeEvents(deliver)
		);

		this.commands = this.createCommands(appContext, this.eventCollection, configStorage);
	}

	public dispose(): void
	{
		this.disposables.forEach(d => d.dispose());
	}

	protected createCommands(appContext: IAppContext, eventCollection: MarkdownEventCollection, configStorage: IConfigureStorage): ICommandItem
	{
		const rootCommandItem: ICommandItem =
		{
			name: 'root',
			command: undefined,
			icon: undefined,
			label: 'root',
			children: []
		};

		const basicCommands = createDefaultMarkdownCommandItem(appContext);
		rootCommandItem.children?.push(basicCommands);
		return rootCommandItem;
	}

	public createCommandCollection(): CommandCollection
	{
		return new CommandCollection(this.commands);
	}

	//protected createMarkdownTable(editorContext: IAppContext, eventCollection: MarkdownEventCollection, configStorage: IConfigureStorage): MarkdownTable
	//{
	//	return new MarkdownTable(editorContext, eventCollection, configStorage);
	//}



	public getCommandsMap(): ICommandItem
	{
		return this.commands;
	}


	public textChanged(e: ITextChanged): void
	{
		
	}

	public selectChanged(e: ISelectChanged): void
	{

	}

	public otherChanged(e: any): void
	{

	}

	public cursorChanged(e: number): void
	{

	}

	public formatRequest(e: void): void
	{

	}

}


