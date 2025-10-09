import { createContext, useContext, useMemo, useState } from "react";
import { IToken } from "../components/parser/IToken";
import { useMarkdownContext } from "./markdown-context";
import { useAppContext } from "./Markdown-app-context";
import { IReplaceText, Utils } from "@mde/markdown-core";



export type MarkdownTokenContextProps =
{
    onEdits: (edits: [string, number, number][]) => void;
    selections: [number, number][];
    setSelections: (selections: [number, number][]) => void;
}
const ctx: MarkdownTokenContextProps =
{
    onEdits: () => {},
    selections: [],
    setSelections: () => {}
}

const Context = createContext<MarkdownTokenContextProps>(ctx);
export const { Provider: MarkdownTokenContextProvider } = Context;
export const useMarkdownTokenContext = () => useContext(Context);

export const MarkdownTokenContextProviderWrapper = ({ children }: any) =>
{
    const { markdown } = useMarkdownContext();
    const { markdownCore, appContext } = useAppContext();
    const [currentToken, setCurrentToken] = useState<IToken|undefined>(undefined);
    const [selections, setSelections] = useState<[number, number][]>([]);
    

    const ctx = useMemo<MarkdownTokenContextProps>(() => ({
        onEdits: (edits: [string, number, number][]) => {
            if(appContext)
            {
                const s = edits.map<IReplaceText>(e => {
                    const [text, start, end] = e;
                    return { area: Utils.IndexToSelection(markdown, start, end), text };
                })

                if(s.length)
                {
                    appContext.getEditorModel().replaces(s);
                }
            }
        },
        setSelections: (p) =>
        {
            const selections = p.map(sl => Utils.IndexToSelection(markdown, ...sl))
            const cmd = markdownCore?.getCommandsMap().get('markdown:select');
            cmd?.execute({ selections });
            setSelections(p);
        },
        selections
    }), [markdown]);
    
    return (
        <MarkdownTokenContextProvider value={ctx}>
            { children }
        </MarkdownTokenContextProvider>
    )
}
