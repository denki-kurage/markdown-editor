import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAppContext } from "./markdown-app-context";
import { applyFilters } from "@wordpress/hooks";
import { ICommandItem } from "@mde/markdown-core";
import { useDispatch, useRegistry, useSelect } from "@wordpress/data";
import { store } from "../store";
import { store as blockEditorStore, useBlockProps } from "@wordpress/block-editor";
import { EditorState, IMarkdownBlockEditorState } from "../store/type";

export type MarkdownEditorContextProps =
{
    blockEditorProps: any;
    clientId: string;
    editorState: IMarkdownBlockEditorState;
    setEditorState: (editorState: Partial<IMarkdownBlockEditorState>) => void;
    commandItems: ICommandItem[];
}
const Context = createContext<MarkdownEditorContextProps>({} as any);

export const { Provider: MarkdownEditorProvider } = Context;
export const useMarkdownEditorContext = () => useContext(Context);

export const MarkdownEditorContextProviderWrapper = ({children, clientId, ...blockEditorProps}: any) =>
{
    console.log("ｘｘｘｘｘｘｘｘｘｘｘｘｘｘｘｘｘｘｘｘｘｘｘｘｘｘｘｘｘｘｘｘｘ", blockEditorProps)
    const { markdownCore } = useAppContext();
    const { setEditorState, deleteEditorState } = useDispatch(store);
    const editorState = useSelect(select => select(store).getEditorState(clientId), [clientId]);

    const commandItems = useMemo(() => {
        return applyFilters(
            'extensionCommandItemRoot',
            [],
            markdownCore
        ) as ICommandItem[];
    }, [markdownCore]);


    const ctx = useMemo(() => ({
        blockEditorProps,
        clientId,
        editorState,
        setEditorState: (es: Partial<IMarkdownBlockEditorState>) => setEditorState(clientId, es),
        commandItems,
    }), [clientId, editorState, commandItems, blockEditorProps])

    useEffect(() => {
        setEditorState(clientId, editorState);
        return () => { deleteEditorState(clientId); }
    }, [clientId])

    return <MarkdownEditorProvider value={ctx}>{children}</MarkdownEditorProvider>;
}

