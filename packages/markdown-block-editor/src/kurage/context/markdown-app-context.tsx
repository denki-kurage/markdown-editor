import { IAppContext, IConfigurationStorage, IEditorModel, IEventsInitializer, IMarkdownEvents, MarkdownCore } from "@kurage/markdown-core"
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "@wordpress/element";
import { MarkdownEventCollection } from "@kurage/markdown-core";
import { applyFilters } from '@wordpress/hooks'
import { useDispatch, useSelect } from "@wordpress/data";
import { store } from "../store";
import { ISettings } from "../store/ISettings";
import { ISettingOptions } from "../store/ISettingOptions";
import { Spinner } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

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
                'markdown_block_editor_app_context',
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
        ) : <div><Spinner />{__('Loading settings information...', 'markdown-block-editor')}</div> }
        </>
    )
}


