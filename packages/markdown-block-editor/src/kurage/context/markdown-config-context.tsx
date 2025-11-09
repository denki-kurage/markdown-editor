import { createContext, useContext, useMemo } from "react"

export type MarkdownConfigContextProps =
{
    configValue: Map<string, any>;
}
const Context = createContext<MarkdownConfigContextProps>({ configValue: new Map() });
export const { Provider: MarkdownConfigContextProvider } = Context;
export const useConfigContext = () => useContext(Context);

export const MarkdownConfigContextWrapper = ({children}: any) =>
{
    const ctx = useMemo(() => ({ configValue: new Map<string, any>() }), []);

    return (
        <MarkdownConfigContextProvider value={ctx}>
            { children }
        </MarkdownConfigContextProvider>
    )
}

