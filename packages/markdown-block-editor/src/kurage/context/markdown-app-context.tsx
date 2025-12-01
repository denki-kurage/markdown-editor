import { IAppContext, IConfigureStorage, IEditorModel, IEventsInitializer, IMarkdownEvents, MarkdownCore } from "@mde/markdown-core"
import { createContext, useContext, useMemo, useRef, useState } from "react";
import { MarkdownConfigureStorage } from "../classes/MarkdownConfigureStorage";
import { MarkdownEventCollection } from "@mde/markdown-core";
import { applyFilters } from '@wordpress/hooks'
import { useDispatch, useSelect } from "@wordpress/data";
import { store } from "../store";
import { ISettings } from "../../../ISettings";

export type AppContextGenerateParams =
{
    appContext: IAppContext;
}
export type MarkdownAppContextProps =
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
            getText: (selection) => '',
            getCursor: () => undefined,
            getSelections: () => [],
            setSelections: (selections) => {},
            replaces: (items) => {},
            scroll: (docIndex) => {},
            indexToPosition: (docIndex) => ({ charIndex: 0, docIndex: 0}),
            positionToIndex: (position) => 0
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
    getTextSource: () => ({
        lineAt: (line: number) => '',
        hasLine: (line: number) => false
    }),
    returnKey: () => 'none'
}



const Context = createContext<MarkdownAppContextProps>(null as any);
export const { Provider: AppContextProvider } = Context;
export const useMarkdownAppContext = () => useContext(Context);

export const MarkdownAppContextWrapper = ({ children }: any) =>
{
    const { updateSettings } = useDispatch(store);
    const settingsRef = useRef<ISettings>(null as any);
    settingsRef.current = useSelect(select => select(store).getSettings(), []);

    const configStorage = useMemo<IConfigureStorage>(() => {

        return {
            getValue: <T,>(name: string) =>
            {
                return settingsRef.current?.configurations?.[name] as T;
            },
            setValue: <T,>(name: string, value: T) =>
            {
                if(settingsRef.current)
                {
                    const configurations = { ...settingsRef.current.configurations, [name]: value };
                    updateSettings({ configurations });
                }
            }
        }
    }, []);

    const defaultMarkdownCore = useMemo(() => new MarkdownCore(appContext, configStorage), []);
    const [markdownCore, setMarkdownCore] = useState<MarkdownCore>(defaultMarkdownCore);

    const generateAppContext = (params?: AppContextGenerateParams) =>
    {
        // markdownCore.dispose();
        
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

    const ctx = useMemo<MarkdownAppContextProps>(() =>
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


