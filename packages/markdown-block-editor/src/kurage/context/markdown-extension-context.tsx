import { createContext, useContext, useMemo } from "react"

export type ExtensionContextProps =
{
    extensionValue: Map<string, any>;
}
const Context = createContext<ExtensionContextProps>({ extensionValue: new Map() });
export const { Provider: ExtensionContextProvider } = Context;
export const useExtensionContextProvider = () => useContext(Context);

export const MarkdownExtensionContextWrapper = ({children}: any) =>
{
    const ctx = useMemo(() => ({ extensionValue: new Map<string, any>() }), []);

    return (
        <ExtensionContextProvider value={ctx}>
            { children }
        </ExtensionContextProvider>
    )
}

