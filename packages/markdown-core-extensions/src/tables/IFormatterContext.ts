import { ITableConverter } from "./ITableConverter";
import { IMarkdownTableFormatter } from "./MarkdownTableConverter";

export interface IFormatterContext
{
	readonly formatter: IMarkdownTableFormatter;
	readonly tableConverter: ITableConverter<string>;
}

