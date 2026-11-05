import { ICommandItem } from "@kurage/markdown-core";
import { ExtensionContexts } from "../markdown-react-editor/hooks";
import { CodeTokenEditor, HeadingTokenEditor, ResourceTokenEditor, TableTokenEditor, TextTokenEditor } from "./token-editors";
import { MarkdownEditorComponentAdapter, TokenEditorComponentItem } from "../markdown-react-editor/IMarkdownEditorComponentAdapter";


// Gutenberg-specific integration: move this section when extracting the Gutenberg version.
const defaultTokenEditorComponentInfos: TokenEditorComponentItem[] = [
    { type: 'text', label: 'Text Editor', component: TextTokenEditor },
    { type: 'heading', label: 'Heading', component: HeadingTokenEditor },
    { type: 'code', label: 'Code', component: CodeTokenEditor },
    { type: 'table', label: 'Table', component: TableTokenEditor },
    { type: 'tableRow', label: 'Table Row', component: TableTokenEditor },
    { type: 'tableCell', label: 'Table Cell', component: TableTokenEditor },
    { type: 'link', label: 'Link', component: ResourceTokenEditor },
    { type: 'image', label: 'Image', component: ResourceTokenEditor },
];



export class GutenMarkdownEditorComponentAdapter extends MarkdownEditorComponentAdapter
{
    public getTokenEditorComponents(contexts: ExtensionContexts): TokenEditorComponentItem[]
    {
        return [...defaultTokenEditorComponentInfos];
    }


    public getSidebarCommandItems(contexts: ExtensionContexts): ICommandItem[]
    {
        return [];
        //const commands = applyFilters('markdown_block_editor_get_inspector_commands', rootCommandItem, contexts.coreContext) ?? [];
    }
}
