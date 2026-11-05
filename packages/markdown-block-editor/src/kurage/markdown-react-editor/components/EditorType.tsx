import { IAppContext, ISnippet } from "@kurage/markdown-core";

export type MarkdownEditorComponentProps =
{
    initializedAppContext: (context?: IAppContext) => void;
    snippets?: ISnippet[];
    editorStyles?: string[];
}

export type MarkdownEditorComponent = (props: MarkdownEditorComponentProps) => JSX.Element;

