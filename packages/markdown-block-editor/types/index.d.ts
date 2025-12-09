declare module "src/kurage/components/image-upload-editor" {
    import { MarkdownCore } from '@mde/markdown-core';
    import React from 'react';
    const ImageUploadEditor: ({ mc, onExecuted }: {
        mc?: MarkdownCore;
        onExecuted: () => void;
    }) => React.JSX.Element;
    export default ImageUploadEditor;
}
declare module "src/kurage/classes/OgpManager" {
    type OgpItem = {
        type: string;
        title: string;
        image: string;
        url: string;
    };
    class OgpGenerator {
        readonly sites: Map<string, OgpItem>;
        private properties;
        constructor();
        add(url: string): Promise<OgpItem>;
        loadOgpItem(url: string): Promise<OgpItem>;
    }
    export const ogpGenerator: OgpGenerator;
}
declare module "src/kurage/components/blog-card-generator" {
    import React from "react";
    import { MarkdownCore } from "@mde/markdown-core";
    const BlogCardGenerator: ({ mc, onExecuted }: {
        mc?: MarkdownCore;
        onExecuted: () => void;
    }) => React.JSX.Element;
    export default BlogCardGenerator;
}
declare module "ISettings" {
    export type ISettings = {
        adminCss: string;
        frontCss: string;
        fontSize: number;
        fontFamily: string;
        configurations: {
            [key: string]: any;
        };
    };
}
declare module "src/kurage/store/type" {
    import { ISettings } from "ISettings";
    export interface IMarkdownBlockEditor {
        editorStates: {
            [key: string]: IMarkdownBlockEditorState;
        };
        info: IMarkdownBlockEditorInfo;
        settings: ISettings;
        storeState: IStoreState;
    }
    export interface IStoreState {
        isLoading: boolean;
        faultMessage: string;
    }
    export interface IMarkdownBlockEditorInfo {
        version: string;
    }
    export interface IMarkdownBlockEditorState {
        tokenTypes: string[];
        selections: [number, number][];
        enabledSelectionsFilter: boolean;
        enabledSelectionsFilterFillMode: boolean;
        maximized: boolean;
        extensionsData: {
            [key: string]: any;
        };
        settings: ISettings;
    }
    export type EditorState = {
        [key: string]: IMarkdownBlockEditorState;
    };
    export const createInitData: () => IMarkdownBlockEditor;
}
declare module "src/kurage/store/selectors" {
    import { IMarkdownBlockEditor } from "src/kurage/store/type";
    export const getVersion: (state: IMarkdownBlockEditor) => string;
    export const getTokenEnabledSelectionsFilter: (state: IMarkdownBlockEditor, id: string) => boolean;
    export const getEditMaximized: (state: IMarkdownBlockEditor, id: string) => boolean;
    export const getEditorState: (state: IMarkdownBlockEditor, id: string) => import("src/kurage/store/type").IMarkdownBlockEditorState | {
        extensionsData: {};
        enabledSelectionsFilter: false;
        enabledSelectionsFilterFillMode: false;
        selections: any[];
        tokenTypes: any[];
        maximized: false;
    };
    export const getStoreState: (state: IMarkdownBlockEditor) => import("src/kurage/store/type").IStoreState;
    export const getSettings: (state: IMarkdownBlockEditor) => import("ISettings").ISettings;
}
declare module "src/kurage/store/actions" {
    import { IMarkdownBlockEditorState, IStoreState } from "src/kurage/store/type";
    import { ISettings } from "ISettings";
    export const setInfoVersion: (version: string) => {
        type: string;
        version: string;
    };
    export const setEditorState: (id: string, editorState: Partial<IMarkdownBlockEditorState>) => {
        type: string;
        id: string;
        editorState: Partial<IMarkdownBlockEditorState>;
    };
    export const deleteEditorState: (id: string) => {
        type: string;
        id: string;
    };
    export const setExtensionData: (id: string, extensionName: string, extensionData: any) => {
        type: string;
        id: string;
        extensionName: string;
        extensionData: any;
    };
    export const setStoreState: (storeState: IStoreState) => {
        type: string;
        value: IStoreState;
    };
    export const updateSettings: (settings: Partial<ISettings>) => (p: any) => Promise<void>;
}
declare module "src/kurage/store/resolvers" {
    export const getSettings: () => (p: any) => Promise<void>;
}
declare module "src/kurage/store/reducer" {
    import { EditorState, IMarkdownBlockEditorInfo, IStoreState } from "src/kurage/store/type";
    import { ISettings } from "ISettings";
    const _default: import("redux").Reducer<{
        info: {
            version: any;
        };
        editorStates: EditorState;
        settings: any;
        storeState: any;
    }, any, Partial<{
        info: IMarkdownBlockEditorInfo;
        editorStates: EditorState;
        settings: ISettings;
        storeState: IStoreState;
    }>>;
    export default _default;
}
declare module "src/kurage/store/index" {
    import * as selectors from "src/kurage/store/selectors";
    import * as actions from "src/kurage/store/actions";
    import * as resolvers from "src/kurage/store/resolvers";
    export const storeConfig: {
        reducer: import("redux").Reducer<{
            info: {
                version: any;
            };
            editorStates: import("src/kurage/store/type").EditorState;
            settings: any;
            storeState: any;
        }, any, Partial<{
            info: import("src/kurage/store/type").IMarkdownBlockEditorInfo;
            editorStates: import("src/kurage/store/type").EditorState;
            settings: import("ISettings").ISettings;
            storeState: import("src/kurage/store/type").IStoreState;
        }>>;
        actions: typeof actions;
        selectors: typeof selectors;
        resolvers: typeof resolvers;
    };
    export const store: import("@wordpress/data/build-types/types").StoreDescriptor<import("@wordpress/data/build-types/types").ReduxStoreConfig<unknown, typeof actions, typeof selectors>>;
}
declare module "src/kurage/context/markdown-app-context" {
    import { IAppContext, IConfigurationStorage, MarkdownCore } from "@mde/markdown-core";
    import { MarkdownEventCollection } from "@mde/markdown-core";
    export type AppContextGenerateParams = {
        appContext: IAppContext;
    };
    export type MarkdownAppContextProps = {
        appContext: IAppContext;
        eventCollection?: MarkdownEventCollection;
        configurationStorage: IConfigurationStorage;
        markdownCore: MarkdownCore;
        updateAppContext: (params?: AppContextGenerateParams) => void;
    };
    export const AppContextProvider: import("react").Provider<MarkdownAppContextProps>;
    export const useMarkdownAppContext: () => MarkdownAppContextProps;
    export const MarkdownAppContextWrapper: ({ children }: any) => import("react").JSX.Element;
}
declare module "src/kurage/components/MarkdownEditorSynchronizer" {
    export type LineMapType = {
        lineNumber: number;
        offsetTop: number;
        line: HTMLElement;
    };
    export class MarkdownEditorSynchronizer {
        getOffsetTop: (line: Element, document: HTMLDocument) => number;
        getLineMap(document: HTMLDocument): LineMapType[];
        getLineNumberFromDocument(document: HTMLDocument): number;
        getPositionFromLineNumber: (win: Window, lineNumber: number) => number;
    }
}
declare module "src/kurage/components/parser" {
    import { IDisposable } from "@mde/markdown-core";
    export const parseSaveMarkdown: (html: string) => string;
    export const parseEditMarkdown: (txt: string, breaks?: boolean) => string;
    export const registerMarkdownViewer: (document: HTMLDocument, documentLineNumberChanged: (lineNumber: number) => void) => IDisposable;
    export const scrollToLineNumber: (win: Window, lineNumber: number) => void;
}
declare module "src/kurage/context/markdown-context" {
    export type MarkdownContextProps = {
        markdown: string;
        /**
         * エディタの入力中、常にビューのレンダリングやトークンの解析を行うには負担がかかりすぎます。
         * 実際の入力とは同期せず、これらの処理を遅延させることで負荷を軽減します。
         * 入力中は真となり、ビューのレンダリングやトークンエクスプローラをロックするために使用します。
         */
        isEditing: boolean;
        setIsEditing: (isEditing: boolean) => void;
        editHeight: number;
        viewMode: "code" | "view" | "both";
        setAttributes: (value: any) => void;
        onMarkdownChanged: (v: string) => void;
    };
    export const MarkdownContextProvider: import("react").Provider<MarkdownContextProps>;
    export const useMarkdownContext: () => MarkdownContextProps;
    export const MarkdownContextProviderWrapper: ({ children, attributes, setAttributes, standardizeReturnKey }: any) => import("react").JSX.Element;
}
declare module "src/kurage/context/markdown-token-context" {
    import { IToken } from "@mde/markdown-core";
    export type TokenStates = {
        /**
         * エディタレベルでの選択範囲。
         */
        selections: [number, number][] | null;
        rootToken: IToken;
        /**
         * 単一の選択されたトークン。
         */
        singleToken?: IToken;
    };
    export type MarkdownTokenContextProps = {
        onEdits: (edits: [string, number, number][]) => void;
        /**
         * エディタレベルでの選択範囲。
         */
        selections: [number, number][] | null;
        rootToken: IToken;
        /**
         * 単一の選択されたトークン。
         */
        singleToken?: IToken;
        /**
         * セレクションが一つの場合、start地点をインデックスとしてtokenを設定する。
         */
        setSelectionsAndToken: (selections: [number, number][] | null, singleToken?: IToken) => void;
        /**
         * 複数の選択の場合
         */
        setSelections: (selections: [number, number][]) => void;
        getSingleText: () => string | undefined;
    };
    export const MarkdownTokenContextProvider: import("react").Provider<MarkdownTokenContextProps>;
    export const useMarkdownTokenContext: () => MarkdownTokenContextProps;
    export const MarkdownTokenContextProviderWrapper: ({ children }: any) => import("react").JSX.Element;
}
declare module "src/kurage/components/edit-toolbar" {
    import { ICommandItem } from "@mde/markdown-core";
    export type CommandToolbarProps = {
        groupRoot: ICommandItem;
    };
    export const CommandToolbarGroup: ({ groupRoot }: CommandToolbarProps) => import("react").JSX.Element;
    export const CommandControl: ({ item }: {
        item: ICommandItem;
    }) => import("react").JSX.Element;
}
declare module "src/kurage/context/markdown-editor-context" {
    import { IMarkdownBlockEditorState } from "src/kurage/store/type";
    export type MarkdownEditorContextProps = {
        blockEditorProps: any;
        clientId: string;
        editorState: IMarkdownBlockEditorState;
        setEditorState: (editorState: Partial<IMarkdownBlockEditorState>) => void;
    };
    export const MarkdownEditorProvider: import("react").Provider<MarkdownEditorContextProps>;
    export const useMarkdownEditorContext: () => MarkdownEditorContextProps;
    export const MarkdownEditorContextProviderWrapper: ({ children, clientId, ...blockEditorProps }: any) => import("react").JSX.Element;
}
declare module "src/kurage/context/markdown-extension-context" {
    export type MarkdownExtensionContextProps = {
        extensionData: any;
        setExtensionData: (clientId: string, extensionName: string, extensionData: any) => void;
    };
    export const ExtensionContextProvider: import("react").Provider<any>;
    export const useExtensionContext: () => any;
    export const MarkdownExtensionContextWrapper: ({ children, extensionName }: any) => import("react").JSX.Element;
}
declare module "src/kurage/components/hooks" {
    import { MarkdownContextProps } from "src/kurage/context/markdown-context";
    import { MarkdownEditorContextProps } from "src/kurage/context/markdown-editor-context";
    import { MarkdownExtensionContextProps } from "src/kurage/context/markdown-extension-context";
    import { MarkdownTokenContextProps } from "src/kurage/context/markdown-token-context";
    import { MarkdownAppContextProps } from "src/kurage/context/markdown-app-context";
    import { IAppContext, SelectCommand } from "@mde/markdown-core";
    export type ExtensionContexts = {
        appContext: MarkdownAppContextProps;
        tokenContext: MarkdownTokenContextProps;
        markdownContext: MarkdownContextProps;
        extensionContext: MarkdownExtensionContextProps;
        editorContext: MarkdownEditorContextProps;
    };
    export const useExtensionContexts: () => {
        tokenContext: MarkdownTokenContextProps;
        markdownContext: MarkdownContextProps;
        extensionContext: any;
        editorContext: MarkdownEditorContextProps;
        appContext: MarkdownAppContextProps;
    };
    export const useInternalCommandItems: (appContext: IAppContext) => {
        name: string;
        command: any;
        icon: any;
        label: string;
        children: {
            name: string;
            label: string;
            icon: string;
            command: SelectCommand;
        }[];
    };
}
declare module "src/kurage/classes/CodeLanguages" {
    export const codeLanguages: {
        name: string;
        label: string;
    }[];
    export const codeLanguagesMap: Map<string, string>;
    export const sortedCodeLanguages: (recentCodeLanguages: string[]) => {
        name: string;
        label: string;
    }[];
}
declare module "src/kurage/components/token-editor-forms/token-editors" {
    import { TokenEditorProps } from "src/kurage/components/inspector-hooks";
    export const TableTokenEditor: ({ token, contexts }: TokenEditorProps) => import("react").JSX.Element;
    export const HeadingTokenEditor: ({ token, contexts }: TokenEditorProps) => import("react").JSX.Element;
    export const CodeEditor: ({ token, contexts }: TokenEditorProps) => import("react").JSX.Element;
}
declare module "src/kurage/components/inspector-hooks" {
    import { ICommandItem, IToken } from "@mde/markdown-core";
    import { ExtensionContexts } from "src/kurage/components/hooks";
    export type TokenEditorProps = {
        token: IToken;
        contexts: ExtensionContexts;
    };
    export type TokenEditorComponentInfo = {
        type: string;
        label: string;
        component: (props: TokenEditorProps) => JSX.Element;
    };
    export type ExtensionEditorProps = {
        contexts: ExtensionContexts;
    };
    export type ExtensionComponentInfo = {
        label: string;
        component: (props: ExtensionEditorProps) => JSX.Element;
    };
    export type TokenCommandsInfo = {
        isShow(type: string, contexts: ExtensionContexts): boolean;
        /**
         *
         * 極力キャッシュするようにしてください。
         */
        getCommandItems(type: string, contexts: ExtensionContexts): ICommandItem[];
    };
    export const useTokenEditorComponents: (type: string) => TokenEditorComponentInfo[];
    export const useExtensionComponents: () => ExtensionComponentInfo[];
    export const useToolbarActiveCommands: (contexts: ExtensionContexts) => ICommandItem[];
    export const useInspectorActiveCommands: (context: ExtensionContexts) => ICommandItem[];
    export const TextTokenEditor: ({ token, contexts }: TokenEditorProps) => import("react").JSX.Element;
}
declare module "src/kurage/components/app-toolbars" {
    import React from "react";
    const AppToolbars: () => React.JSX.Element;
    export default AppToolbars;
}
declare module "src/kurage/components/loading" {
    import React from "react";
    export const Loading: ({ isLoading }: any) => React.JSX.Element;
    export const LoadingPanel: React.MemoExoticComponent<({ isLoading, children }: {
        isLoading: boolean;
        children: any;
    }) => React.JSX.Element>;
}
declare module "src/kurage/components/token-inspectors" {
    export const TokenInspectors: () => import("react").JSX.Element;
    export default TokenInspectors;
}
declare module "src/kurage/classes/MonacoDecorator" {
    import { IEditorDecorateSelection } from "@mde/markdown-core";
    import { editor, IDisposable } from "monaco-editor";
    export class MonacoDecorator implements IDisposable {
        private readonly editor;
        private decorations;
        constructor(editor: editor.IStandaloneCodeEditor);
        private toRange;
        decorate(selections: IEditorDecorateSelection[]): void;
        clear(): void;
        dispose(): void;
    }
}
declare module "src/kurage/classes/MonacoEditorContext" {
    import { Monaco } from "@monaco-editor/react";
    import { editor } from 'monaco-editor';
    import { IAppContext, IDisposable, IEditorDecorateSelection, IEditorModel, IEventsInitializer, IMarkdownEvents, IScrollSynchronizer, IStringCounter, ITextSource, IConfigurationStorage } from "@mde/markdown-core";
    export class MonacoEditorContext implements IAppContext, IDisposable, IEventsInitializer<IMarkdownEvents> {
        private readonly monaco;
        private readonly model;
        private readonly editor;
        private readonly configurationStorage;
        private decorator;
        private monacoEventsDisposables;
        private configurationHelper;
        constructor(monaco: Monaco, model: editor.ITextModel, editor: editor.IStandaloneCodeEditor, configurationStorage: IConfigurationStorage);
        private initInternalRegister;
        initializeEvents(events: IMarkdownEvents): IDisposable;
        dispose(): void;
        getEventsInitializer(): IEventsInitializer<IMarkdownEvents>;
        getEditorName(): string;
        getTextSource(): ITextSource;
        getStringCounter(): IStringCounter;
        getAppConfig(): {};
        returnKey(): string;
        getDecorator(): {
            decorate: (selections: IEditorDecorateSelection[]) => void;
            clearDecorate: () => void;
        };
        getScrollSynchronizer(): IScrollSynchronizer;
        getEditorModel(): IEditorModel;
    }
}
declare module "src/kurage/components/monaco-editor" {
    import { Monaco } from '@monaco-editor/react';
    import { editor } from 'monaco-editor';
    import { AppContextGenerateParams } from "src/kurage/context/markdown-app-context";
    import { MarkdownEditorProps } from "src/kurage/components/editor-wrapper";
    import { IConfigurationStorage } from '@mde/markdown-core';
    export const useMarkdownApp: (configurationStorage: IConfigurationStorage, editor?: editor.IStandaloneCodeEditor, monaco?: Monaco) => AppContextGenerateParams;
    export const MonacoEditor: ({ initializedMarkdownCore }: MarkdownEditorProps) => import("react").JSX.Element;
}
declare module "src/kurage/components/editor-wrapper" {
    import { AppContextGenerateParams } from "src/kurage/context/markdown-app-context";
    export const EditorGeneratorCollection: EditorGenerator[];
    export type MarkdownEditorProps = {
        initializedMarkdownCore: (markdownCore?: AppContextGenerateParams) => void;
    };
    export type EditorGenerator = {
        name: string;
        EditorComponent: (props: MarkdownEditorProps) => JSX.Element;
    };
    export function useMarkdownEditorGenerator(name: string): EditorGenerator;
}
declare module "src/kurage/useEditorInterlocking" {
    import { IAppContext } from '@mde/markdown-core';
    export const useEditorInterlocking: (appContext: IAppContext, win: Window) => {
        dispose: () => void;
        viewScroll: (lineNumber: number) => void;
        editReveal: (lineNumber: number) => void;
    };
    export type EventDisposable = () => void;
    export class EventBlocker<T> {
        readonly label: string;
        private readonly execution;
        private isBlock;
        constructor(label: string, execution: (arg: T) => void);
        block(): EventDisposable;
        execute(args: T): void;
        saftyFire(callback: () => void): void;
        clear(): void;
        isBlocking(): boolean;
    }
}
declare module "src/kurage/components/commands-inspector" {
    export const CommandsInspector: ({}: {}) => import("react").JSX.Element;
}
declare module "src/kurage/context/markdown-config-context" {
    export type MarkdownConfigContextProps = {
        configValue: Map<string, any>;
    };
    export const MarkdownConfigContextProvider: import("react").Provider<MarkdownConfigContextProps>;
    export const useConfigContext: () => MarkdownConfigContextProps;
    export const MarkdownConfigContextWrapper: ({ children }: any) => import("react").JSX.Element;
}
declare module "src/kurage/components/withRegistryProvider" {
    export type withRegistryProviderProps = {
        storeName: string;
        storeConfig: any;
    };
    export const withRegistryProvider: (Inner: import("react").ComponentType<any>) => ({ storeName, storeConfig, ...props }: withRegistryProviderProps) => import("react").JSX.Element;
    export const withEditorRegistryProvider: (Inner: import("react").ComponentType<any>) => ({ children, ...props }: any) => import("react").JSX.Element;
    export const withEditorRegistryComponent: (...args: unknown[]) => unknown;
}
declare module "src/kurage/components/OtherSettings" {
    import React from "react";
    export const OthreSettings: ({}: {}) => React.JSX.Element;
}
declare module "src/kurage/components/ControlPanel" {
    export const ControlPanel: ({}: {}) => import("react").JSX.Element;
    export const EditorSettings: ({}: {}) => import("react").JSX.Element;
}
declare module "src/kurage/edit" {
    import React from 'react';
    import './editor.scss';
    import './components/token-viewer.scss';
    const EditMemo: React.MemoExoticComponent<({ attributes, setAttributes, ...props }: any) => React.JSX.Element>;
    export default EditMemo;
}
declare module "src/kurage/index" {
    import './style.scss';
}
declare module "src/kurage/line-number-context" {
    export type LineNumberContextType = {
        lineNumber: number;
        updateLineNumber: (line: number) => void;
    };
    export const LineNumberContextProvider: import("react").Provider<LineNumberContextType>;
    export const useLineNumberContext: () => LineNumberContextType;
}
declare module "src/kurage/classes/BrowserAppHelper" {
    export class BrowserAppHelper {
        static toPosition(text: string, charIndex: number): number[];
        static toIndex(text: string, docIndex: number, charIndex: number): number;
        static lineToPosition(text: string, docIndex: number): number;
        static textLines(text: string): string[];
        static textLinesCount(text: string): number;
    }
}
declare module "src/kurage/classes/BrowserAppMain" { }
declare module "src/kurage/classes/MarkdownConfigureStorage" {
    import { IConfigureStorage } from "@mde/markdown-core";
    export class MarkdownConfigureStorage implements IConfigureStorage {
        private config;
        setValue<T>(name: string, value: T): boolean;
        getValue<T>(name: string): T;
    }
}
declare module "src/kurage/classes/sanitizer" {
    export const sanitize: (str: string) => string;
}
declare module "src/kurage/components/token-editor-forms/table-inspectors" { }
