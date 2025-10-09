import { IAppContext, IEventsInitializer, IMarkdownEvents, MarkdownCore } from "@mde/markdown-core"
import { createContext, useContext, useMemo, useState } from "react";
import { MarkdownConfigureStorage } from "../classes/MarkdownConfigureStorage";
import { MarkdownEventCollection } from "@mde/markdown-core";

export type AppContextGenerateParams =
{
    appContext: IAppContext;
}
export type AppContextProps =
{
    appContext?: IAppContext;
    eventCollection?: MarkdownEventCollection;
    markdownCore?: MarkdownCore;
    updateAppContext: (params?: AppContextGenerateParams) => void;
}

const Context = createContext<AppContextProps>({} as any);
export const { Provider: AppContextProvider } = Context;
export const useAppContext = () => useContext(Context);

export const MarkdownAppContextWrapper = ({ children }: any) =>
{
    const [markdownCore, setMarkdownCore] = useState<MarkdownCore|undefined>(undefined as any);

    const configStorage = useMemo(() => new MarkdownConfigureStorage(), [])
    const generateAppContext = (params?: AppContextGenerateParams) =>
    {
        if(params)
        {
            const { appContext } = params;
            const core = new MarkdownCore(appContext, configStorage)

            
            setMarkdownCore(core);
        }
        else
        {
            setMarkdownCore(undefined);
        }
    }

    const ctx = useMemo<AppContextProps>(() =>
    {
        return {
            appContext: markdownCore?.appContext,
            eventCollection: markdownCore?.eventCollection,
            markdownCore,
            updateAppContext: generateAppContext
        }
    }, [markdownCore])

    return (
        <AppContextProvider value={ctx}>
            { children }
        </AppContextProvider>
    )
}


