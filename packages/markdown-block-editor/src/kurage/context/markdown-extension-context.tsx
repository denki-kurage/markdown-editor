import { useDispatch, useSelect } from "@wordpress/data"
import { createContext, useContext, useMemo, useState } from "react"
import { store } from "../store"
import { useMarkdownEditorContext } from "./markdown-editor-context"


export type MarkdownExtensionContextProps =
{
    extensionData: any;
    setExtensionData: (clientId: string, extensionName: string, extensionData: any) => void;
}
const Context = createContext<any>(null as any);
export const { Provider: ExtensionContextProvider } = Context;
export const useExtensionContext = () => useContext(Context);




export const MarkdownExtensionContextWrapper = ({children, extensionName}: any) =>
{
    const { clientId, editorState } = useMarkdownEditorContext();
    const { setExtensionData } = useDispatch(store);
    const extensionData = editorState.extensionsData?.[extensionName];

    const ctx = useMemo(() => ({
        extensionData,
        setExtensionData: (extensionData: any) => setExtensionData(clientId, extensionName, extensionData)
    }), [extensionName, extensionData])

    return (
        <ExtensionContextProvider value={ctx}>
            { children }
        </ExtensionContextProvider>
    )
}

