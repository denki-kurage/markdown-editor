import { ISettings } from "../../../ISettings";

export interface IMarkdownBlockEditor
{
    editorStates: {[key: string]: IMarkdownBlockEditorState};
    info: IMarkdownBlockEditorInfo;
    settings: ISettings;
    storeState: IStoreState;
}

export interface IStoreState
{
    isLoading: boolean;
    faultMessage: string;
}
export interface IMarkdownBlockEditorInfo
{
    version: string
}

export interface IMarkdownBlockEditorState
{
    tokenTypes: string[];
    selections: [number, number][];
    enabledSelectionsFilter: boolean;
    enabledSelectionsFilterFillMode: boolean;
    maximized: boolean;
    extensionsData: {[key: string]: any}
    settings: ISettings
}

export type EditorState = {[key: string]: IMarkdownBlockEditorState};

export const createInitData = () =>
{
    return {
        info: {
            version: "0.1"
        },
        editorStates: {},
        storeState:
        {
            isLoading: false,
            faultMessage: ''
        },
        settings: {
            adminCss: '',
            frontCss: '',
            fontFamily: '',
            fontSize: 12,
            recentCodeLanguages: [],
            configurations: {}
        }
    } as IMarkdownBlockEditor;
}

