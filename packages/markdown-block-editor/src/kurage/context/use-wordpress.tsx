import { IAppContext, IConfigurationStorage, IEditorModel, IEventsInitializer, IMarkdownEvents, MarkdownCore } from "@kurage/markdown-core"
import { useCallback, useEffect, useMemo, useState } from "@wordpress/element";
import { addFilter, applyFilters } from '@wordpress/hooks'
import { useDispatch, useSelect } from "@wordpress/data";
import { store } from "../store";
import { ISettings } from "../store/ISettings";
import { ISettingOptions } from "../store/ISettingOptions";
import { __ } from "@wordpress/i18n";
import { ContextProviderData, IContextService, MarkdownContextServices } from "./context-service";
import { parseSaveMarkdown } from "../components/parser";
import { IComponentViewModels } from "../markdown-editor-components/component-view-models";


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
    (core: MarkdownCore|undefined, { appContext, configStorage }: { appContext: IAppContext; settings: ISettings; settingOptions: ISettingOptions; configStorage: IConfigurationStorage }) =>
    {
        return new MarkdownCore(appContext, configStorage);
    }
)


const standardizeReturnKey = (str: string) => str.replace(/\r\n|\n/g, "\n");

export const useWordPressContextServices = (attributes: any, setAttributes: any, ...props: any) =>
{
    const { clientId } = props;
    const [appContext, setAppContext] = useState<IAppContext|undefined>();
    const [context, setContext] = useState<MarkdownContextServices>();
    
	const { setEditorState, deleteEditorState, updateSettings } = useDispatch(store);
	const editorState = useSelect(select => select(store).getEditorState(clientId), [clientId]);

    const { settings, settingOptions } = useSelect(select => {
        const s = select(store);
        return { settings: s.getSettings(), settingOptions: s.getSettingOptions() };
    }, []);

    const updateEditorContext = useCallback((newAppContext?: IAppContext) => {
        appContext?.dispose();
        setAppContext((prev) => {
            prev?.dispose();
            return newAppContext;
        });
    }, []);

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
    }, [settings, updateSettings]);

    useEffect(() => {
        if(settings && settingOptions)
        {
            const markdownCore = applyFilters(
                'markdown_block_editor_create_markdown_core',
                undefined,
                { appContext: appContext ?? defaultAppContext, configStorage, settings, settingOptions }
            ) as MarkdownCore;

            const contextService: IContextService =
            {
                setEditorState,
                deleteEditorState,
                updateAttributes: setAttributes,
                parseSaveMarkdown: (markdown: string) => parseSaveMarkdown(markdown),
                standardizeReturnKey: (markdown: string) => standardizeReturnKey(markdown),
                createMarkdownCore: (editorContext, configurationStorage) => new MarkdownCore(editorContext, configurationStorage)
            }

            const contextData: ContextProviderData = {
                attributes,
                settings,
                settingOptions,
                editorState,
                configurationStorage: configStorage
            }
            
            setContext({ contextService, contextData });

            return () => markdownCore.dispose();
        }
    }, [appContext, settings, settingOptions, configStorage, editorState, updateEditorContext]);

    return context;
}

export const useWordPressComponentViewModels = (contextServices: MarkdownContextServices | undefined) =>
{
    const { storeState } = useSelect(select => {
        const s = select(store);
        const storeState = s.getStoreState();
        return { storeState }
    }, []);

    const { updateSettings } = useDispatch(store);


    const updateFontFamily = (fontFamily: string) =>
    {
        updateSettings({ fontFamily })
    }

    const updateFontSize = (fontSize: number) =>
    {
        updateSettings({ fontSize })
    }

    const vm = useMemo<IComponentViewModels|undefined>(() => {
        if(storeState)
        {
            return ({
                settingsViewModel: {
                    errorMessage: storeState.faultMessage,
                    isLoading: storeState.isLoading,
                    updateFontFamily,
                    updateFontSize,
                    updateSettings
                }
            });
        }
    }, [storeState])

    return vm;
}