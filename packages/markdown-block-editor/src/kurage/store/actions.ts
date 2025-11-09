import { IMarkdownBlockEditorState } from "./type"

export const setInfoVersion = (version: string) =>
{
    return { type: 'SET_INFO_VERSION', version }
}


export const setEditorState = (id: string, editorState: Partial<IMarkdownBlockEditorState>) =>
{
    return { type: 'SET_EDITOR_STATE', id, editorState }
}

export const deleteEditorState = (id: string) =>
{
    return { type: 'DELETE_EDITOR_STATE', id }
}

export const setExtensionData = (id: string, extensionName: string, extensionData: any) =>
{
    return { type: 'SET_EDITOR_EXTENSION_DATA', id, extensionName, extensionData }
}