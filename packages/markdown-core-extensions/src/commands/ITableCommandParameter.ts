import { ICommandParameter } from "@mde/markdown-core";
import { MarkdownTableContent } from "../tables";

export interface ITableCommandParameter extends ICommandParameter
{
	table: MarkdownTableContent;
	docIndex: number;
	charIndex: number;
}
