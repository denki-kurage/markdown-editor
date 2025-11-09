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
        enabledSelectionsFilter: false,
        selections: [],
        maximized: false
    })
}