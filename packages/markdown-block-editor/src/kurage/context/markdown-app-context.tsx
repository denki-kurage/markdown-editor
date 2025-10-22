import { IAppContext, IEditorModel, IEventsInitializer, IMarkdownEvents, MarkdownCore } from "@mde/markdown-core"
import { createContext, useContext, useMemo, useState } from "react";
import { MarkdownConfigureStorage } from "../classes/MarkdownConfigureStorage";
import { MarkdownEventCollection } from "@mde/markdown-core";
import { applyFilters } from '@wordpress/hooks'

export type AppContextGenerateParams =
{
    appContext: IAppContext;
}
export type AppContextProps =
{
    appContext: IAppContext;
    eventCollection?: MarkdownEventCollection;
    markdownCore: MarkdownCore;
    updateAppContext: (params?: AppContextGenerateParams) => void;
}

const appContext: IAppContext =
{
    getEditorModel: () => {
        return {
            getText: (pos) => '',
            getCursor: () => undefined,
            getSelections: () => [],
            setSelections: (selections) => {},
            replaces: (items) => {},
            scroll: (docIndex) => {}
        } as IEditorModel
    },
    getDecorator: () => {
        return {
            decorate: (selections) => {},
            clearDecorate: () => {}
        }
    },
    getEditorName: () => 'none',
    getEventsInitializer: () => {
        return {
            initializeEvents: (events: IMarkdownEvents) => {
                return {
                    dispose: () => {}
                }
            }
        } as IEventsInitializer<IMarkdownEvents>
    },
    getScrollSynchronizer: () => {
        return {
            scroll: (lineNumber) => {},
            addScrollEventListener: (scrolled) => {
                return {
                    dispose: () => {}
                }
            }
        }
    },
    getAppConfig: () => ({}),
    getStringCounter: () => {
        return (str: string) => str.length;
    },
    getTextSource: () => undefined,
    returnKey: () => 'none'
}

const defaultMarkdownCore = new MarkdownCore(appContext, new MarkdownConfigureStorage());


const Context = createContext<AppContextProps>(null as any);
export const { Provider: AppContextProvider } = Context;
export const useAppContext = () => useContext(Context);

export const MarkdownAppContextWrapper = ({ children }: any) =>
{
    const [markdownCore, setMarkdownCore] = useState<MarkdownCore>(defaultMarkdownCore);

    const configStorage = useMemo(() => new MarkdownConfigureStorage(), [])
    const generateAppContext = (params?: AppContextGenerateParams) =>
    {
        if(params)
        {
            const { appContext } = params;
            const core = applyFilters(
                'extensionAppContext',
                new MarkdownCore(appContext, configStorage),
                appContext,
                configStorage
            ) as any;

            setMarkdownCore(core);
        }
        else
        {
            setMarkdownCore(defaultMarkdownCore);
        }
    }

    const ctx = useMemo<AppContextProps>(() =>
    {
        return {
            appContext: markdownCore.appContext,
            eventCollection: markdownCore.eventCollection,
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


