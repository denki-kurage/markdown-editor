
export interface IMarkdownBlockEditor
{
    editorStates: {[key: string]: IMarkdownBlockEditorState};
    info: IMarkdownBlockEditorInfo;
}

export interface IMarkdownBlockEditorInfo
{
    version: string
}

export interface IMarkdownBlockEditorState
{
    selections: [number, number][];
    enabledSelectionsFilter: boolean;
    maximized: boolean;
    extensionsData: {[key: string]: any}
}

export type EditorState = {[key: string]: IMarkdownBlockEditorState};

export const createInitData = () =>
{
    return {
        info: {
            version: "0.1"
        },
        editorStates: {}
    } as IMarkdownBlockEditor;
}

