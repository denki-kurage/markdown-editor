import { MarkdownTableContent } from "./MarkdownTableContent";
import { IFormatterContext } from "./IFormatterContext";
import { IAppContext } from "@mde/markdown-core";

export interface ICommandContext
{
	appContext: IAppContext;
	//cache: TableCacheManager;

	getFormatterContext(): IFormatterContext;
	getTable(): MarkdownTableContent | undefined;

}

