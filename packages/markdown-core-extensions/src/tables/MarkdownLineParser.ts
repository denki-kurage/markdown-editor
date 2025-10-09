import { IMarkdownContentParser, TextReader } from "@mde/markdown-core";
import { MarkdownLineContent } from "./MarkdownLineContent";

export class MarkdownLineParser implements IMarkdownContentParser<MarkdownLineContent>
{

	parse(textReader: TextReader): MarkdownLineContent | undefined
	{
		if (textReader.moveNext())
		{
			return new MarkdownLineContent(textReader.current);
		}
		
	}

	adjust(textReader: TextReader): void
	{

	}
	
}
