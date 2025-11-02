import { AppHelper } from "./AppHelper";
import { DefaultFormatterContext } from "./DefaultFormatterContext";
import { AutoFormatter } from "./AutoFormatter";
import { CacheUpdater } from "./CacheUpdater";
import { DefaultCommandFactory } from "./DefaultCommandFactory";
import { IFormatterContext } from "./IFormatterContext";
import { MarkdownTableRenderMode } from "./MarkdownTableConverter";
import { TableCacheManager } from "./TableCacheManager";
import { TableObserver } from "./TableObserver";
import { MarkdownConfigurations } from "./configurations/MarkdownConfigurations";
import { EventListeners, IAppContext, ICommand, ICommandItem, ICommandsMapRoot, IConfigureStorage, MarkdownEventCollection } from "@mde/markdown-core";
import { MarkdownTableContent } from "./MarkdownTableContent";
import { createDefaultCommandItem } from "./createDefaultCommandItem";

export class MarkdownTable implements ICommandsMapRoot
{
	protected readonly appHelper: AppHelper;
	protected readonly cache: TableCacheManager;

	protected readonly configuration: MarkdownConfigurations;
	private readonly commands: Map<string, ICommand>;
	private enableCommandNames: string[] = [];


	public readonly tableUpdated: EventListeners<MarkdownTableContent[]> = new EventListeners();
	public readonly currentTableChanged: EventListeners<MarkdownTableContent | undefined> = new EventListeners();
	public readonly formatRequest: EventListeners<void> = new EventListeners();

	public getEnabledCommandNames()
	{
		return this.enableCommandNames;
	}

	public constructor(
		public readonly editorContext: IAppContext,
		public readonly eventCollection: MarkdownEventCollection,
		public readonly storage: IConfigureStorage)
	{
		this.appHelper = new AppHelper(this.editorContext);
		this.cache = new TableCacheManager(() => this.appHelper.getTable());
		this.cache.cacheItemUpdated.push((nv, ov) =>
		{
			this.onCurrentTableChanged(nv, ov);
		});


		this.registerRecievers(eventCollection, this.cache);
		this.commands = this.createCommands(this.editorContext, this.cache);
		this.configuration = this.createSwitcher(eventCollection, storage, this.editorContext);

		// TODO: 実験
		this.configuration.decorator.on();

	}

	public getCommandsMap(): ICommandItem
	{
		return createDefaultCommandItem(this, this.commands, 'light');
	}

	

	public registerRecievers(eventCollection: MarkdownEventCollection, cache: TableCacheManager): void
	{
		const formatterContext = this.createFormatterContext(this.editorContext);
		const autoFormatter = new AutoFormatter(this.editorContext, cache, () => this.onFormatRequest(), () => formatterContext);
		const cacheUpdater = new CacheUpdater(cache);
		const tableObserver = new TableObserver(this.editorContext, tables => this.onTableUpdated(tables));

		[autoFormatter, cacheUpdater, tableObserver].forEach(item => eventCollection.add(item));
	}


	protected createSwitcher(eventCollection: MarkdownEventCollection, storage: IConfigureStorage, editorContext: IAppContext)
	{
		return new MarkdownConfigurations(eventCollection, storage, editorContext);
	}

	/**
	 * @param nv 
	 * @param ov 
	 * 
	 * テーブルに変更があった場合呼び出されます。
	 * セレクションのたびにテーブルの変更をチェックしますが、テーブルに変更が無ければ呼び出されません。
	 * これにより
	 */
	protected onCurrentTableChanged(nv: MarkdownTableContent | undefined, ov: MarkdownTableContent | undefined)
	{
		this.enableCommandNames = this.checkEnabledCommandNames();
		//this.configuration.decoratorSwitcher.decorate(nv);
		this.configuration.decorator.decorate(nv);
		this.currentTableChanged.emit(nv);
	}

	public dispose(): void
	{
		
	}

	/**
	 * フォーマット要求があった場合に呼び出されます。
	 * 必ず既定のメソッドよ呼び出してください。
	 */
	protected onFormatRequest(): void
	{
        const cmd = this.commands.get('format:beautiful');
        cmd?.execute();

		this.formatRequest.emit();
	}
	
	/**
	 * @param tables テーブル一覧
	 * 
	 * ポーリング中、テーブル一覧に更新があった場合呼び出されます。
	 */
	protected onTableUpdated(tables: MarkdownTableContent[])
	{
		this.tableUpdated.emit(tables);
	}


	protected createCommands(editorContext: IAppContext, cache: TableCacheManager): Map<string, ICommand>
	{
		const formatterContext = this.createFormatterContext(editorContext);
		const factory = new DefaultCommandFactory(editorContext, cache, formatterContext);
		return factory.createCommandFactries();
	}

	protected createFormatterContext(editorContext: IAppContext): IFormatterContext
	{
		const mode = this.getFormatMode();
		return new DefaultFormatterContext(mode, editorContext.returnKey());
	}

	protected getFormatMode(): MarkdownTableRenderMode
	{
		return MarkdownTableRenderMode.Beautiful;
	}

	private checkEnabledCommandNames(): string[]
	{
		return [...this.commands.entries()]
			.filter(([, command]) => command.canExecute())
			.map(([name]) => name)
	}
}
