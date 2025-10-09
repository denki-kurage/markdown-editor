import { MarkdownContentBase } from "@mde/markdown-core";


export class MarkdownLineContent extends MarkdownContentBase
{
	public constructor(public readonly text: string)
	{
		super();
	}


	public toString(): string
	{
		return this.text;
	}

}
