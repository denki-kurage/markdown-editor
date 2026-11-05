import { ICommandItem, IToken } from "@kurage/markdown-core";
import { ExtensionContexts } from "./hooks";

export interface IMarkdownEditorComponentAdapter
{
    getTokenEditorComponents(contexts: ExtensionContexts): TokenEditorComponentItem[];
    getToolbarCommandItems(contexts: ExtensionContexts): ICommandItem[];
    getSidebarCommandItems(contexts: ExtensionContexts): ICommandItem[];
}

export abstract class MarkdownEditorComponentAdapter implements IMarkdownEditorComponentAdapter
{
    public abstract getTokenEditorComponents(contexts: ExtensionContexts): TokenEditorComponentItem[];
    public abstract getSidebarCommandItems(contexts: ExtensionContexts): ICommandItem[];

    public getToolbarCommandItems(contexts: ExtensionContexts): ICommandItem[]
    {
        const core = contexts.coreContext?.coreSession?.markdownCore;
        return core?.getCommandsMap()?.children ?? [];
    }
    
}



export interface TokenEditorProps
{
    token: IToken;
    contexts: ExtensionContexts;
}

export interface TokenEditorComponentItem
{
    type: string;
    label: string;
    component: (props: TokenEditorProps) => JSX.Element
}



export type TokenCommandsInfo =
{
    isShow(type: string, contexts: ExtensionContexts): boolean;

    /**
     * 
     * 極力キャッシュするようにしてください。
     */
    getCommandItems(type: string, contexts: ExtensionContexts): ICommandItem[];
}




export const filterActiveCommands = (commands: ICommandItem[]) =>
{
    return commands.filter(ci => !ci.command || ci.command.canExecute());
}


export const filterTokenEditorComponents = (type: string, componentInfos: TokenEditorComponentItem[]) =>
{
    return componentInfos.filter(ei => ei.type === type);
}





