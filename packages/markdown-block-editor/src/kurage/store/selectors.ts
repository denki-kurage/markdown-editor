import { IMarkdownBlockEditor } from "./type";

export const getVersion = (state: IMarkdownBlockEditor) =>
{
    return state.info.version;
}

export const getTokenEnabledSelectionsFilter = (state: IMarkdownBlockEditor, id: string) =>
{
    return state.editorStates[id]?.enabledSelectionsFilter;
}

export const getEditMaximized = (state: IMarkdownBlockEditor, id: string) =>
{
    return state.editorStates[id]?.maximized;
}

export const getEditorState = (state: IMarkdownBlockEditor, id: string) =>
{
    return state.editorStates[id] || ({
        extensionsData: {},
        enabledSelectionsFilter: false,
        enabledSelectionsFilterFillMode: false,
        selections: [],
        tokenTypes: [],
        maximized: false
    })
}

export const getStoreState = (state: IMarkdownBlockEditor) =>
{
    return state.storeState;
}

export const getSettings = (state: IMarkdownBlockEditor) =>
{
    return state.settings;
}

export const getSettingOptions = (state: IMarkdownBlockEditor) =>
{
    return state.settingOptions;
}
