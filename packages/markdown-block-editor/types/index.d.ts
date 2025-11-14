declare module "components/image-upload-editor" {
    import { MarkdownCore } from '@mde/markdown-core';
    import React from 'react';
    const ImageUploadEditor: ({ mc, onExecuted }: {
        mc?: MarkdownCore;
        onExecuted: () => void;
    }) => React.JSX.Element;
    export default ImageUploadEditor;
}
declare module "classes/OgpManager" {
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
declare module "components/blog-card-generator" {
    import React from "react";
    import { MarkdownCore } from "@mde/markdown-core";
    const BlogCardGenerator: ({ mc, onExecuted }: {
        mc?: MarkdownCore;
        onExecuted: () => void;
    }) => React.JSX.Element;
    export default BlogCardGenerator;
}
declare module "classes/MarkdownConfigureStorage" {
    import { IConfigureStorage } from "@mde/markdown-core";
    export class MarkdownConfigureStorage implements IConfigureStorage {
        private config;
        setValue<T>(name: string, value: T): boolean;
        getValue<T>(name: string): T;
        save(): Promise<boolean>;
    }
}
declare module "context/markdown-app-context" {
    import { IAppContext, MarkdownCore } from "@mde/markdown-core";
    import { MarkdownEventCollection } from "@mde/markdown-core";
    export type AppContextGenerateParams = {
        appContext: IAppContext;
    };
    export type AppContextProps = {
        appContext: IAppContext;
        eventCollection?: MarkdownEventCollection;
        markdownCore: MarkdownCore;
        updateAppContext: (params?: AppContextGenerateParams) => void;
    };
    export const AppContextProvider: import("react").Provider<AppContextProps>;
    export const useAppContext: () => AppContextProps;
    export const MarkdownAppContextWrapper: ({ children }: any) => import("react").JSX.Element;
}
declare module "components/MarkdownEditorSynchronizer" {
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
declare module "components/parser" {
    import { IDisposable } from "@mde/markdown-core";
    export const parseSaveMarkdown: (html: string) => string;
    export const parseEditMarkdown: (txt: string, breaks?: boolean) => string;
    export const registerMarkdownViewer: (document: HTMLDocument, documentLineNumberChanged: (lineNumber: number) => void) => IDisposable;
    export const scrollToLineNumber: (win: Window, lineNumber: number) => void;
}
declare module "context/markdown-context" {
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
declare module "context/markdown-token-context" {
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
declare module "components/edit-toolbar" {
    import { ICommandItem } from "@mde/markdown-core";
    export type CommandToolbarProps = {
        root: ICommandItem;
    };
    export const CommandToolbar: ({ root }: CommandToolbarProps) => import("react").JSX.Element;
    export type FlatCommandToolbarProps = {
        root: ICommandItem;
    };
    export const FlatCommandToolbar: ({ root }: FlatCommandToolbarProps) => import("react").JSX.Element;
    export const CommandControl: ({ item }: {
        item: ICommandItem;
    }) => import("react").JSX.Element;
}
declare module "store/type" {
    export interface IMarkdownBlockEditor {
        editorStates: {
            [key: string]: IMarkdownBlockEditorState;
        };
        info: IMarkdownBlockEditorInfo;
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
    }
    export type EditorState = {
        [key: string]: IMarkdownBlockEditorState;
    };
    export const createInitData: () => IMarkdownBlockEditor;
}
declare module "store/selectors" {
    import { IMarkdownBlockEditor } from "store/type";
    export const getVersion: (state: IMarkdownBlockEditor) => string;
    export const getTokenEnabledSelectionsFilter: (state: IMarkdownBlockEditor, id: string) => boolean;
    export const getEditMaximized: (state: IMarkdownBlockEditor, id: string) => boolean;
    export const getEditorState: (state: IMarkdownBlockEditor, id: string) => import("store/type").IMarkdownBlockEditorState;
}
declare module "store/actions" {
    import { IMarkdownBlockEditorState } from "store/type";
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
}
declare module "store/reducer" {
    import { EditorState, IMarkdownBlockEditorInfo } from "store/type";
    const _default: import("redux").Reducer<{
        info: {
            version: any;
        };
        editorStates: EditorState;
    }, any, Partial<{
        info: IMarkdownBlockEditorInfo;
        editorStates: EditorState;
    }>>;
    export default _default;
}
declare module "components/token-editor" {
    import { IToken } from "@mde/markdown-core";
    import { ExtensionContexts } from "components/token-inspectors";
    import React from "react";
    export type TokenEditorProps = {
        token: IToken;
        contexts: ExtensionContexts;
    };
    export type TokenEditorComponentInfo = {
        type: string;
        label: string;
        component: (props: TokenEditorProps) => JSX.Element;
    };
    export type ExtensionComponentInfo = {
        label: string;
        component: (props: ExtensionContexts) => JSX.Element;
    };
    export const useTokenEditorComponents: (type: string) => TokenEditorComponentInfo[];
    export const useExtensionComponents: () => ExtensionComponentInfo[];
    export const TextTokenEditor: ({ token, contexts }: TokenEditorProps) => React.JSX.Element;
}
declare module "components/loading" {
    import React from "react";
    export const Loading: ({ isLoading }: any) => React.JSX.Element;
    export const LoadingPanel: React.MemoExoticComponent<({ isLoading, children }: {
        isLoading: boolean;
        children: any;
    }) => React.JSX.Element>;
}
declare module "context/markdown-extension-context" {
    export type MarkdownExtensionContextProps = {
        extensionData: any;
        setExtensionData: (clientId: string, extensionName: string, extensionData: any) => void;
    };
    export const ExtensionContextProvider: import("react").Provider<any>;
    export const useExtensionContext: () => any;
    export const MarkdownExtensionContextWrapper: ({ children, extensionName }: any) => import("react").JSX.Element;
}
declare module "components/hooks" {
    export const useExtensionContexts: () => {
        tokenContext: import("context/markdown-token-context").MarkdownTokenContextProps;
        markdownContext: import("context/markdown-context").MarkdownContextProps;
        extensionContext: any;
        editorContext: import("context/markdown-editor-context").MarkdownEditorContextProps;
    };
}
declare module "components/token-inspectors" {
    import { MarkdownContextProps } from "context/markdown-context";
    import { MarkdownTokenContextProps } from "context/markdown-token-context";
    import { MarkdownExtensionContextProps } from "context/markdown-extension-context";
    import { MarkdownEditorContextProps } from "context/markdown-editor-context";
    export type ExtensionContexts = {
        tokenContext: MarkdownTokenContextProps;
        markdownContext: MarkdownContextProps;
        extensionContext: MarkdownExtensionContextProps;
        editorContext: MarkdownEditorContextProps;
    };
    export const TokenInspectors: () => import("react").JSX.Element;
    export default TokenInspectors;
}
declare module "store/index" {
    import * as selectors from "store/selectors";
    import * as actions from "store/actions";
    export { ExtensionContexts } from "components/token-inspectors";
    export const storeConfig: {
        reducer: import("redux").Reducer<{
            info: {
                version: any;
            };
            editorStates: import("store/type").EditorState;
        }, any, Partial<{
            info: import("store/type").IMarkdownBlockEditorInfo;
            editorStates: import("store/type").EditorState;
        }>>;
        actions: typeof actions;
        selectors: typeof selectors;
    };
    export const store: import("@wordpress/data/build-types/types").StoreDescriptor<import("@wordpress/data/build-types/types").ReduxStoreConfig<unknown, typeof actions, typeof selectors>>;
}
declare module "context/markdown-editor-context" {
    import { ICommandItem } from "@mde/markdown-core";
    import { IMarkdownBlockEditorState } from "store/type";
    export type MarkdownEditorContextProps = {
        blockEditorProps: any;
        clientId: string;
        editorState: IMarkdownBlockEditorState;
        setEditorState: (editorState: Partial<IMarkdownBlockEditorState>) => void;
        commandItems: ICommandItem[];
    };
    export const MarkdownEditorProvider: import("react").Provider<MarkdownEditorContextProps>;
    export const useMarkdownEditorContext: () => MarkdownEditorContextProps;
    export const MarkdownEditorContextProviderWrapper: ({ children, clientId, ...blockEditorProps }: any) => import("react").JSX.Element;
}
declare module "components/app-toolbars" {
    import React from "react";
    const AppToolbars: () => React.JSX.Element;
    export default AppToolbars;
}
declare module "components/option-settings" {
    import React from "react";
    export const OptionSettings: ({ onCompleted }: {
        onCompleted: any;
    }) => React.JSX.Element;
    export const SettingsForm: ({ settings, onCompleted }: {
        settings: any;
        onCompleted: any;
    }) => React.JSX.Element;
    export default OptionSettings;
}
declare module "components/basic-inspectors" {
    type BasicInspectorsProps = {
        editHeight: number | undefined;
        onEditHeightChanged: (h: number | undefined) => void;
    };
    export const BasicInspectors: ({ editHeight, onEditHeightChanged }: BasicInspectorsProps) => import("react").JSX.Element;
}
declare module "classes/MonacoDecorator" {
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
declare module "classes/MonacoEditorContext" {
    import { Monaco } from "@monaco-editor/react";
    import { editor } from 'monaco-editor';
    import { IAppContext, IDisposable, IEditorDecorateSelection, IEditorModel, IEventsInitializer, IMarkdownEvents, IScrollSynchronizer, IStringCounter, ITextSource } from "@mde/markdown-core";
    export class MonacoEventsInitializer implements IEventsInitializer<IMarkdownEvents> {
        private readonly monaco;
        private readonly model;
        private readonly editor;
        constructor(monaco: Monaco, model: editor.ITextModel, editor: editor.IStandaloneCodeEditor);
        initializeEvents(events: IMarkdownEvents): IDisposable;
    }
    export class MonacoEditorContext implements IAppContext {
        private readonly monaco;
        private readonly model;
        private readonly editor;
        private decorator;
        constructor(monaco: Monaco, model: editor.ITextModel, editor: editor.IStandaloneCodeEditor);
        getEventsInitializer(): IEventsInitializer<IMarkdownEvents>;
        getEditorName(): string;
        getTextSource(): ITextSource | undefined;
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
declare module "components/monaco-editor" {
    import { Monaco } from '@monaco-editor/react';
    import { editor } from 'monaco-editor';
    import { AppContextGenerateParams } from "context/markdown-app-context";
    import { MarkdownEditorProps } from "components/editor-wrapper";
    export const useMarkdownApp: (editor?: editor.IStandaloneCodeEditor, monaco?: Monaco) => AppContextGenerateParams;
    export const MonacoEditor: ({ initializedMarkdownCore }: MarkdownEditorProps) => import("react").JSX.Element;
}
declare module "components/editor-wrapper" {
    import { AppContextGenerateParams } from "context/markdown-app-context";
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
declare module "useEditorInterlocking" {
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
declare module "components/commands-inspector" {
    export const CommandsInspector: ({}: {}) => import("react").JSX.Element;
}
declare module "context/markdown-config-context" {
    export type MarkdownConfigContextProps = {
        configValue: Map<string, any>;
    };
    export const MarkdownConfigContextProvider: import("react").Provider<MarkdownConfigContextProps>;
    export const useConfigContext: () => MarkdownConfigContextProps;
    export const MarkdownConfigContextWrapper: ({ children }: any) => import("react").JSX.Element;
}
declare module "components/withRegistryProvider" {
    export type withRegistryProviderProps = {
        storeName: string;
        storeConfig: any;
    };
    export const withRegistryProvider: (Inner: import("react").ComponentType<any>) => ({ storeName, storeConfig, ...props }: withRegistryProviderProps) => import("react").JSX.Element;
    export const withEditorRegistryProvider: (Inner: import("react").ComponentType<any>) => ({ children, ...props }: any) => import("react").JSX.Element;
    export const withEditorRegistryComponent: (...args: unknown[]) => unknown;
}
declare module "edit" {
    import React from 'react';
    import './editor.scss';
    import './components/token-viewer.scss';
    const EditMemo: React.MemoExoticComponent<({ attributes, setAttributes, ...props }: any) => React.JSX.Element>;
    export default EditMemo;
}
declare module "index" {
    import './style.scss';
}
declare module "line-number-context" {
    export type LineNumberContextType = {
        lineNumber: number;
        updateLineNumber: (line: number) => void;
    };
    export const LineNumberContextProvider: import("react").Provider<LineNumberContextType>;
    export const useLineNumberContext: () => LineNumberContextType;
}
declare module "classes/BrowserAppHelper" {
    export class BrowserAppHelper {
        static toPosition(text: string, charIndex: number): number[];
        static toIndex(text: string, docIndex: number, charIndex: number): number;
        static lineToPosition(text: string, docIndex: number): number;
        static textLines(text: string): string[];
        static textLinesCount(text: string): number;
    }
}
declare module "classes/BrowserAppMain" { }
declare module "classes/sanitizer" {
    export const sanitize: (str: string) => string;
}
declare module "components/token-editor-forms/table-inspectors" { }
