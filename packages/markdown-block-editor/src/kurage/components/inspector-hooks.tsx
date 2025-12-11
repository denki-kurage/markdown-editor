import { Button, TextareaControl } from "@wordpress/components";
import { useCallback, useMemo, useState } from "react";
import { ICommandItem, IToken, MarkdownCore } from "@mde/markdown-core";
import { applyFilters } from "@wordpress/hooks";
import { ExtensionContexts } from "./hooks";
import { CodeEditor, HeadingTokenEditor, TableTokenEditor } from "./token-editor-forms/token-editors";



export type TokenEditorProps =
{
    token: IToken;
    contexts: ExtensionContexts;
}

export type TokenEditorComponentInfo =
{
    type: string;
    label: string;
    component: (props: TokenEditorProps) => JSX.Element
}

export type ExtensionEditorProps =
{
    contexts: ExtensionContexts;
}
export type ExtensionComponentInfo =
{
    label: string;
    component: (props: ExtensionEditorProps) => JSX.Element
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

export const useTokenEditorComponents = (type: string) =>
{
    const components = useMemo(() => {
        const defaults: TokenEditorComponentInfo[] = [
            { type: 'text', label: 'Text Editor', component: TextTokenEditor },
            { type: 'heading', label: 'Heading', component: HeadingTokenEditor },
            { type: 'code', label: 'Code', component: CodeEditor },
			{ type: 'table', label: 'Table', component: TableTokenEditor },
			{ type: 'tableRow', label: 'Table Row', component: TableTokenEditor },
			{ type: 'tableCell', label: 'Table Cell', component: TableTokenEditor },
        ];
        return applyFilters('getTokenEditorComponents', defaults) as TokenEditorComponentInfo[];
    }, []);

    return components.filter(c => c.type === type);
}

export const useExtensionComponents = () =>
{
    return useMemo(() => {
        return applyFilters('getExtensionComponents', []) as ExtensionComponentInfo[];
    }, []);
}

export const useToolbarActiveCommands = (contexts: ExtensionContexts) =>
{
    const ci = useMemo(() => {
        return contexts.appContext.markdownCore.getCommandsMap();
    }, [contexts.appContext.markdownCore]);

    return ci.children?.filter(ci => !ci.command || ci.command.canExecute()) ?? [];
}

export const useInspectorActiveCommands = (context: ExtensionContexts) =>
{
    const rootCommandItem: ICommandItem =
    {
        name: 'inspector root',
        label: 'inspector root',
        command: undefined,
        icon: undefined,
        children: []
    }

    const ci = useMemo(() => {
        return applyFilters('getInspectorCommands', rootCommandItem, context) as ICommandItem;
    }, [context.appContext.markdownCore]);

    return ci.children?.filter(ci => !ci.command || ci.command.canExecute()) ?? [];
}

export const TextTokenEditor = ({ token, contexts }: TokenEditorProps) =>
{
    const { tokenContext } = contexts;
    const { start, end } = token.getPosition();
    const [value, setValue] = useState(tokenContext.getSingleText() ?? '');


    const edit = useCallback(() =>
    {
        tokenContext.onEdits([[value, start, end]]);
    }, [value]);

    return (
        <div className="text-token-editor">

            <TextareaControl
                label={token.getType()}
                value={value}
                onChange={setValue}
                rows={2}
            />
            <Button value={value} onClick={edit} variant="primary">Text Update</Button>
        </div>
    )
};