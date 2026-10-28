import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { EventUpdateManager } from "@kurage/markdown-core";
import { IMarkdownBlockEditorState } from "../store/type";
import { useMarkdownEditorAttributeContext } from "./markdown-editor-attribute-context";
import { useMarkdownCoreContext } from "./markdown-core-context";
import { ContextProviderData, IContextService } from "./context-service";


/**
 * エディタの一時的な設定や状態を管理するコンテキストです。
 */
export type MarkdownEditorStateContextType =
{
    blockEditorProps: any;
    clientId: string;
    editorState: IMarkdownBlockEditorState;

    /**
     * エディタの入力中、常にビューのレンダリングやトークンの解析を行うには負担がかかりすぎます。
     * 実際の入力とは同期せず、これらの処理を遅延させることで負荷を軽減します。
     * 入力中は真となり、ビューのレンダリングやトークンエクスプローラをロックするために使用します。
     */
    isEditing: boolean;
    setEditorState: (editorState: Partial<IMarkdownBlockEditorState>) => void;
}


const Context = createContext<MarkdownEditorStateContextType>({} as any);

export const { Provider: MarkdownEditorProvider } = Context;
export const useMarkdownEditorStateContext = () => useContext(Context);


export type MarkdownEditorStateContextProviderProps =
{
    children: React.ReactNode;
    contextData: ContextProviderData;
    contextService: IContextService;
    clientId: string;
    blockEditorProps: any;
}
export const MarkdownEditorStateContextProvider = ({
    children,
    clientId,
    contextData,
    contextService,
    ...blockEditorProps
}: MarkdownEditorStateContextProviderProps) =>
{
    const { editorState } = contextData;
    const { setEditorState, deleteEditorState } = contextService;
    const { markdown } = useMarkdownEditorAttributeContext();
    const { settings } = useMarkdownCoreContext();
    const [isEditing, setIsEditing] = useState(false);
    const previewInterval = settings.previewInterval ?? 1000;


    const updater = useMemo<EventUpdateManager>(() => {
        const updater = new EventUpdateManager(previewInterval);
        updater.updated.push(() => setIsEditing(false));
        updater.lazyUpdate();
        return updater;
    }, [previewInterval]);

    useEffect(() => {
        return () => updater.dispose();
    }, [updater]);


    useEffect(() => {
        updater.lazyUpdate();
        setIsEditing(true);
    }, [markdown, updater]);

    /**
     * blockEditorPropsが含まれてるためメモ化はしない。
     */
    const ctx = {
        blockEditorProps,
        clientId,
        editorState,
        isEditing,
        setEditorState: (es: Partial<IMarkdownBlockEditorState>) => setEditorState(clientId, es)
    };

    useEffect(() => {
        setEditorState(clientId, editorState);
        return () => { deleteEditorState(clientId); }
    }, [clientId])

    return <MarkdownEditorProvider value={ctx}>{children}</MarkdownEditorProvider>;
}

