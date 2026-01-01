import { createContext, useContext, useEffect, useMemo, useState } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { store } from "../store";
import { IMarkdownBlockEditorState } from "../store/type";
import { EventUpdateManager } from "@kurage/markdown-core";
import { useMarkdownContext } from "./markdown-context";

export type MarkdownEditorContextProps =
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
const Context = createContext<MarkdownEditorContextProps>({} as any);

export const { Provider: MarkdownEditorProvider } = Context;
export const useMarkdownEditorContext = () => useContext(Context);

export const MarkdownEditorContextProviderWrapper = ({children, clientId, ...blockEditorProps}: any) =>
{
    const { markdown } = useMarkdownContext();
    const { setEditorState, deleteEditorState } = useDispatch(store);
    const editorState = useSelect(select => select(store).getEditorState(clientId), [clientId]);
    const [isEditing, setIsEditing] = useState(false);

    const [updater] = useState<EventUpdateManager>(() => {
        const updater = new EventUpdateManager(5000);
        updater.updated.push(() => setIsEditing(false));
        updater.lazyUpdate();
        return updater;
    });

    useEffect(() => {
        return () => updater.dispose();
    }, []);


    useEffect(() => {
        updater.lazyUpdate();
        setIsEditing(true);
    }, [markdown]);

    const ctx = useMemo(() => ({
        blockEditorProps,
        clientId,
        editorState,
        isEditing,
        setEditorState: (es: Partial<IMarkdownBlockEditorState>) => setEditorState(clientId, es)
    }), [clientId, editorState, blockEditorProps, isEditing]);

    useEffect(() => {
        setEditorState(clientId, editorState);
        return () => { deleteEditorState(clientId); }
    }, [clientId])

    return <MarkdownEditorProvider value={ctx}>{children}</MarkdownEditorProvider>;
}

