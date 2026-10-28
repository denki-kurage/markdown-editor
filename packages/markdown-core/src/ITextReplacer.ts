import { ISelection } from "./ISelection";
import { MarkdownRange } from "./MarkdownRange";


export interface ITextReplacer
{
    select(selections: ISelection[]): void;
    replaceLines(replaces: { area: MarkdownRange; text: string; }[]): void;
}
