import { ICommandItem } from "@kurage/markdown-core";
import { ExtensionContexts } from "../hooks";
import { MarkdownEditorComponentAdapter, TokenEditorComponentItem } from "../IMarkdownEditorComponentAdapter";

export class DefaultMarkdownEditorComponentAdapter extends MarkdownEditorComponentAdapter
{
    public getTokenEditorComponents(contexts: ExtensionContexts): TokenEditorComponentItem[]
    {
        return [];
    }

    public getSidebarCommandItems(contexts: ExtensionContexts): ICommandItem[]
    {
        return [];
    }
}

















