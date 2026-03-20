import { IAppContext, IConfigurationStorage, IEditorModel, IEventsInitializer, IMarkdownEvents, MarkdownCore } from "@kurage/markdown-core"
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "@wordpress/element";
import { MarkdownEventCollection } from "@kurage/markdown-core";
import { addFilter, applyFilters } from '@wordpress/hooks'
import { useDispatch, useSelect } from "@wordpress/data";
import { store } from "../store";
import { ISettings } from "../store/ISettings";
import { ISettingOptions } from "../store/ISettingOptions";
import { Spinner } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

export type MarkdownAppContextProps =
{
    appContext: IAppContext;
    eventCollection?: MarkdownEventCollection;
    configurationStorage: IConfigurationStorage,
    settings: ISettings;
    settingOptions: ISettingOptions;
    markdownCore: MarkdownCore;
    updateAppContext: (appContext?: IAppContext) => void;
}

const defaultAppContext: IAppContext =
{
    getEditorModel: () => {
        return {
            getText: (selection) => '',
            getCursor: () => undefined,
            getSelections: () => [],
            setSelections: (selections) => {},
            replaces: (items) => { },
            rewrite: (items) => {},
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
    returnKey: () => 'none',
    dispose: () => {}
}

addFilter(
    'markdown_block_editor_create_markdown_core',
    'kurage/markdown-block-editor',
    (core: MarkdownCore|undefined, { appContext, settings, settingOptions, configStorage }: { appContext: IAppContext; settings: ISettings; settingOptions: ISettingOptions; configStorage: IConfigurationStorage }) =>
    {
        return new MarkdownCore(appContext, configStorage);
    }
)

const Context = createContext<MarkdownAppContextProps>(null as any);
export const { Provider: AppContextProvider } = Context;
export const useMarkdownAppContext = () => useContext(Context);

export const MarkdownAppContextWrapper = ({ children }: any) =>
{
    const [appContext, setAppContext] = useState<IAppContext|undefined>();
    const [context, setContext] = useState<MarkdownAppContextProps>();
    const { updateSettings } = useDispatch(store);
    const { settings, settingOptions } = useSelect(select => {
        const s = select(store);
        return { settings: s.getSettings(), settingOptions: s.getSettingOptions() };
    }, []);


    const updateAppContext = useCallback((newAppContext?: IAppContext) => {
        appContext?.dispose();
        setAppContext((prev) => {
            prev?.dispose();
            return newAppContext;
        });
    }, []);

    /*
    const configStorageRef = useRef<IConfigurationStorage|undefined>(undefined);
    configStorageRef.current = {
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
    };

    const configStorage: IConfigurationStorage = {
        getValue: name => configStorageRef.current?.getValue(name)!,
        setValue: (name, value) => configStorageRef.current?.setValue(name, value)
    }
    */

    const configStorage: IConfigurationStorage = useMemo(() => {
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

    useEffect(() => {
        
        if(settings && settingOptions)
        {
            const markdownCore = applyFilters(
                'markdown_block_editor_create_markdown_core',
                undefined,
                { appContext: appContext ?? defaultAppContext, configStorage, settings, settingOptions }
            ) as any;

            const context: MarkdownAppContextProps = {
                appContext: markdownCore.appContext,
                eventCollection: markdownCore.eventCollection,
                markdownCore,
                settings,
                settingOptions,
                configurationStorage: configStorage,
                updateAppContext
            }

            setContext(context);

            return () => markdownCore?.dispose();            
        }

    }, [appContext, settings, settingOptions, configStorage, updateAppContext]);


    return (
        <>
        { context ? (
            <AppContextProvider value={context}>
                { children }
            </AppContextProvider>
        ) : <div><Spinner />{__('Loading settings information...', 'markdown-block-editor')}</div> }
        </>
    )
}


