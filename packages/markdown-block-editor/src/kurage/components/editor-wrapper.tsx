import { useEffect, useMemo } from "react";
import { AppContextGenerateParams, useMarkdownAppContext } from "../context/markdown-app-context";
import { MonacoEditor } from "./MonacoEditor";

export const EditorGeneratorCollection: EditorGenerator[] = [];

export type MarkdownEditorProps =
{
    initializedMarkdownCore: (markdownCore?: AppContextGenerateParams) => void;
}

export type EditorGenerator =
{
    name: string;
    EditorComponent: (props: MarkdownEditorProps) => JSX.Element;
}


EditorGeneratorCollection.push({
    name: 'monaco',
    EditorComponent: MonacoEditor
});
EditorGeneratorCollection.push({
    name: 'monaco2',
    EditorComponent: props => <MonacoEditor {...props} />
});

export function useMarkdownEditorGenerator(name: string): EditorGenerator
{
    const { updateAppContext } = useMarkdownAppContext();

    return useMemo(() => {

        // エディタのコンテキスト解除。
        updateAppContext(undefined);

        return EditorGeneratorCollection.find(g => g.name === name) ?? ({ name: 'default', EditorComponent: props => <p>Has not Editor</p>})

    }, [name]);

}

