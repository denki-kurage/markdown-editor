import { MarkdownTableConverter, MarkdownTableRenderMode, MarkdownTableFormatter, IMarkdownTableFormatter } from "./MarkdownTableConverter";

import { IFormatterContext } from "./IFormatterContext";
import { ITableConverter } from "./ITableConverter";


export class DefaultFormatterContext implements IFormatterContext
{
	public readonly formatter: IMarkdownTableFormatter = MarkdownTableFormatter.createInstance();
	public readonly tableConverter: ITableConverter<string>;

	public constructor(
		mode: MarkdownTableRenderMode,
		returnKey: string)
	{
		this.tableConverter = new MarkdownTableConverter(mode, returnKey);
	}
}
