import { MarkdownTableContent } from "./MarkdownTableContent";
import { AppHelper } from "./AppHelper";
import { EventUpdateManager, IAppContext, IMarkdownEvents } from "@mde/markdown-core";
import { ISelectChanged, ITextChanged } from "@mde/markdown-core/dist/ITextEventReciever";


export class TableObserver implements Partial<IMarkdownEvents>
{

	private eventManager: EventUpdateManager;

	public constructor(
		private readonly appContext: IAppContext,
		private readonly updated: (tables: Array<MarkdownTableContent>) => void)
	{
		this.eventManager = new EventUpdateManager(300);
		this.eventManager.updated.push(() =>
		{
			this.tableUpdate();
		});
	}

	public textChanged(e: ITextChanged): void
	{
		this.lazyUpdate();
	}

	public selectChanged(e: ISelectChanged): void
	{
		this.lazyUpdate();
	}

	public otherChanged(e?: any): void
	{
		// テキスト変更やセレクション変更以外、つまりエディタの変更時などは即時更新。
		this.eventManager.update();
	}

	private lazyUpdate(): void
	{
		this.eventManager.lazyUpdate();
	}

	private tableUpdate(): void
	{
		const tables = new AppHelper(this.appContext).getTableContents();
		//console.log(tables)
		this.updated(tables);
	}

}

