import { IAppContext, IConfigurationStorage, MarkdownCore } from "@kurage/markdown-core";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ISettings } from "../store/ISettings";
import { ISettingOptions } from "../store/ISettingOptions";
import { ContextProviderData, IContextService } from "./context-service";


export type MarkdownCoreSession =
{
    editorContext: IAppContext;
    markdownCore: MarkdownCore;
}

/**
 * エディタが使用するMarkdownCoreのコンテキストやグローバルな設定値を提供します。
 */
export type MarkdownCoreContextType =
{
    settings: ISettings;
    settingOptions: ISettingOptions;
    configurationStorage: IConfigurationStorage;
    coreSession?: MarkdownCoreSession;
    updateEditorContext: (context?: IAppContext) => void;
}

const MarkdownCoreContext = createContext<MarkdownCoreContextType>({
    settings: {} as ISettings,
    settingOptions: {} as ISettingOptions,
    configurationStorage: {} as IConfigurationStorage,
    updateEditorContext: () => {}
});

export const useMarkdownCoreContext = () => useContext(MarkdownCoreContext);

/**
 * エディタの開発時にCoreSessionを取得する際は、useMarkdownCoreInstance/useMarkdownEditorContextではなくこちらを使用します。
 * エディタはMarkdownCoreReadyGuradの管轄外なのでeditorContext初期化前に直接アクセスすると例外が発生することがあります。
 */
export const useMarkdownCoreSessionInternal = () => useContext(MarkdownCoreContext).coreSession;
export const useMarkdownCoreSession = () =>
{
    const session = useContext(MarkdownCoreContext).coreSession;
    if(!session)
    {
        throw new Error("MarkdownCoreSession is not available. Ensure that you are using the MarkdownCoreContextProvider.");
    }
    return session;
};

/**
 * 
 * MarkdownCoreReadyGuardにホストされている場合に安全にMarkdownCoreのインスタンスを取得します。
 * MarkdownCoreReadyGuardにホストされていない場合は、MarkdownCoreSessionが存在しない可能性があるため、エラーをスローします。
 * そのため、MarkdownCoreReadyGuardでラップされているコンポーネント内でのみ使用してください。
 */
export const useMarkdownCoreInstance = () => useMarkdownCoreSession().markdownCore;

/**
 * 
 * MarkdownCoreReadyGuardにホストされている場合に安全にIAppContextのインスタンスを取得します。
 * MarkdownCoreReadyGuardにホストされていない場合は、MarkdownCoreSessionが存在しない可能性があるため、エラーをスローします。
 * そのため、MarkdownCoreReadyGuardでラップされているコンポーネント内でのみ使用してください。
 */
export const useMarkdownEditorContext = () => useMarkdownCoreSession().editorContext;


export type MarkdownCoreContextProviderProps =
{
    children: React.ReactNode;
    contextData: ContextProviderData;
    contextService: IContextService;
}

export const MarkdownCoreContextProvider = ({ children, contextData, contextService }: MarkdownCoreContextProviderProps) =>
{
    const { settings, settingOptions, configurationStorage } = contextData;
    const { createMarkdownCore } = contextService;
    const [ editorContext, setEditorContext ] = useState<IAppContext|undefined>();
    const updateEditorContext = useCallback((newContext?: IAppContext) => {
        setEditorContext(prev => {
            prev?.dispose();
            return newContext;
        });
    }, []);
    const [ contextValue, setContextValue ] = useState<MarkdownCoreContextType>({ settings, settingOptions, configurationStorage, updateEditorContext });


    useEffect(() => {
        if(editorContext)
        {
            // Initialize the MarkdownCore instance
            const markdownCore = createMarkdownCore(editorContext, configurationStorage);

            const value: MarkdownCoreContextType = {
                coreSession: {
                    editorContext,
                    markdownCore
                },
                configurationStorage,
                settings,
                settingOptions,
                updateEditorContext
            };

            setContextValue(value);
        }
    }, [editorContext, settings, settingOptions, configurationStorage, updateEditorContext]);

    return (
        <>
            <MarkdownCoreContext.Provider value={contextValue}>
                {children}
            </MarkdownCoreContext.Provider>
        </>
    );
}

/**
 * 
 * コアコンテキストが準備できるまで、子コンポーネントのレンダリングを待機するためのガードコンポーネントです。
 * エディタ以外の、ツールバーなどから確実にコアコンテキストを利用するために使用します。
 */
export const MarkdownCoreReadyGuard = ({ children }: { children: React.ReactNode }) =>
{
    const session = useMarkdownCoreSessionInternal();

    if(!session)
    {
        return null;
    }

    return <>{children}</>;
}
