import { IAppContext, IConfigurationStorage, IEditorModel, IEventsInitializer, IMarkdownEvents, MarkdownCore } from "@mde/markdown-core"
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { MarkdownEventCollection } from "@mde/markdown-core";
import { applyFilters } from '@wordpress/hooks'
import { useDispatch, useSelect } from "@wordpress/data";
import { store } from "../store";
import { ISettings } from "../store/ISettings";
import { ISettingOptions } from "../store/ISettingOptions";
import { Spinner } from "@wordpress/components";

export type AppContextGenerateParams =
{
    appContext: IAppContext;
}
export type MarkdownAppContextProps =
{
    appContext: IAppContext;
    eventCollection?: MarkdownEventCollection;
    configurationStorage: IConfigurationStorage,
    settings: ISettings;
    settingOptions: ISettingOptions;
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
    getEditControl: () =>
    {
        return {
            undo: () => {},
            redo: () => {},
            openSuggest: () => {},
            openFindDialog: () =>{},
            openReplaceDialog: () => {}
        }
    },
    returnKey: () => 'none'
}



const Context = createContext<MarkdownAppContextProps>(null as any);
export const { Provider: AppContextProvider } = Context;
export const useMarkdownAppContext = () => useContext(Context);

export const MarkdownAppContextWrapper = ({ children }: any) =>
{
    const { updateSettings } = useDispatch(store);
    const { settings, settingOptions } = useSelect(select => {
        const s = select(store);
        return { settings: s.getSettings(), settingOptions: s.getSettingOptions() };
    }, []);

    const configStorage = useMemo<IConfigurationStorage>(() => {

        return {
            getValue: <T,>(name: string) =>
            {
                return settings?.configurations?.[name] as T;
            },
            setValue: <T,>(name: string, value: T) =>
            {
                if(settings)
                {
                    const configurations = { ...settings.configurations, [name]: value };
                    updateSettings({ configurations });
                }
            }
        }
    }, [settings]);

    const defaultMarkdownCore = useMemo(() => new MarkdownCore(appContext, configStorage), []);
    const [markdownCore, setMarkdownCore] = useState<MarkdownCore>(defaultMarkdownCore);

    const generateAppContext = useCallback((params?: AppContextGenerateParams) =>
    {

        // TODO: 調査
        if(markdownCore !== defaultMarkdownCore)
        {
            markdownCore?.dispose();
        }
        
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
    }, [configStorage, defaultMarkdownCore, markdownCore]);

    const ctx = useMemo<MarkdownAppContextProps>(() =>
    {
        return {
            appContext: markdownCore.appContext,
            eventCollection: markdownCore.eventCollection,
            markdownCore,
            settings,
            settingOptions,
            configurationStorage: configStorage,
            updateAppContext: generateAppContext
        }
    }, [markdownCore, settings, settingOptions, configStorage]);

    return (
        <>
        { settings && settingOptions ? (
            <AppContextProvider value={ctx}>
                { children }
            </AppContextProvider>
        ) : <div><Spinner />設定情報を読み込み中...</div> }
        </>
    )
}


