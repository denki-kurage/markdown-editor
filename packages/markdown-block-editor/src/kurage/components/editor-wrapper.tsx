import { useEffect, useMemo } from "@wordpress/element";
import { useMarkdownAppContext } from "../context/markdown-app-context";
import { MonacoEditor } from "./MonacoEditor";
import { IAppContext } from "@kurage/markdown-core";
export const EditorGeneratorCollection: EditorGenerator[] = [];

export type MarkdownEditorProps =
{
    initializedAppContext: (context?: IAppContext) => void;
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

    return useMemo(() => {

        return EditorGeneratorCollection.find(g => g.name === name) ?? ({ name: 'default', EditorComponent: props => <p>Has not Editor</p>})

    }, [name]);

}

