import { createContext, useContext, useMemo, useState } from "react";
import { useAppContext } from "./markdown-app-context";
import { applyFilters } from "@wordpress/hooks";
import { ICommandItem } from "@mde/markdown-core";

export type MarkdownEditorContextProps =
{
    commands: ICommandItem[];
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


    const commands = useMemo(() => {
        console.log(">>>>>>>>>>>>  <<<<<<<<<<<<<<<<<")
        return applyFilters(
            'extensionCommandItemRoot',
            [],
            markdownCore
        ) as ICommandItem[]
    }, [markdownCore]);

    const ctx = useMemo(() => ({
        commands,
		maximized,
		toggleMaximized: () => setMaximized(!maximized)
    }), [markdownCore, maximized, commands])


    return <MarkdownEditorProvider value={ctx}>{children}</MarkdownEditorProvider>;
}
