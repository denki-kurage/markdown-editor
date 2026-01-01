import { ICommandParameter } from "@kurage/markdown-core";
import { MarkdownTableContent } from "../MarkdownTableContent";


export interface ITableCommandParameter extends ICommandParameter
{
	table: MarkdownTableContent;
	docIndex: number;
	charIndex: number;
}
