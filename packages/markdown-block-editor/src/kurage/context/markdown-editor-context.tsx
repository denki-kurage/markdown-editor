import { createContext, useContext, useEffect, useMemo } from "react";
import { useMarkdownAppContext } from "./markdown-app-context";
import { useDispatch, useSelect } from "@wordpress/data";
import { store } from "../store";
import { IMarkdownBlockEditorState } from "../store/type";

export type MarkdownEditorContextProps =
{
    blockEditorProps: any;
    clientId: string;
    editorState: IMarkdownBlockEditorState;
    setEditorState: (editorState: Partial<IMarkdownBlockEditorState>) => void;
}
const Context = createContext<MarkdownEditorContextProps>({} as any);

export const { Provider: MarkdownEditorProvider } = Context;
export const useMarkdownEditorContext = () => useContext(Context);

export const MarkdownEditorContextProviderWrapper = ({children, clientId, ...blockEditorProps}: any) =>
{
    const { markdownCore } = useMarkdownAppContext();
    const { setEditorState, deleteEditorState } = useDispatch(store);
    const editorState = useSelect(select => select(store).getEditorState(clientId), [clientId]);


    const ctx = useMemo(() => ({
        blockEditorProps,
        clientId,
        editorState,
        setEditorState: (es: Partial<IMarkdownBlockEditorState>) => setEditorState(clientId, es)
    }), [clientId, editorState, blockEditorProps])

    useEffect(() => {
        setEditorState(clientId, editorState);
        return () => { deleteEditorState(clientId); }
    }, [clientId])

    return <MarkdownEditorProvider value={ctx}>{children}</MarkdownEditorProvider>;
}

