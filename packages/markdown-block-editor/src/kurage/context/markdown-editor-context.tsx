import { createContext, useContext, useMemo, useState } from "react";
import { useAppContext } from "./markdown-app-context";
import { applyFilters } from "@wordpress/hooks";
import { ICommandItem } from "@mde/markdown-core";
import { useMarkdownTokenContext } from "./markdown-token-context";

export type MarkdownEditorContextProps =
{
    commandItems: ICommandItem[];
    maximized: boolean;
    toggleMaximized: () => void;
}
const Context = createContext<MarkdownEditorContextProps>({} as any);

export const { Provider: MarkdownEditorProvider } = Context;
export const useMarkdownEditorContext = () => useContext(Context);

export const MarkdownEditorContextProviderWrapper = ({children}: any) =>
{
    const { markdownCore } = useAppContext();
    const [maximized, setMaximized] = useState(false);


    const commandItems = useMemo(() => {
        return applyFilters(
            'extensionCommandItemRoot',
            [],
            markdownCore
        ) as ICommandItem[];
    }, [markdownCore]);


    const ctx = useMemo(() => ({
        commandItems,
		maximized,
		toggleMaximized: () => setMaximized(!maximized)
    }), [markdownCore, maximized, commandItems])


    return <MarkdownEditorProvider value={ctx}>{children}</MarkdownEditorProvider>;
}
