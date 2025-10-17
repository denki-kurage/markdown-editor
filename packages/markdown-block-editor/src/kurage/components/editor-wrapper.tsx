import { useEffect, useMemo } from "react";
import { AppContextGenerateParams, useAppContext } from "../context/Markdown-app-context";
import { MonacoEditor } from "./monaco-editor";
import { useMarkdownTokenContext } from "../context/markdown-token-context";
import { IToken } from "@mde/markdown-core";

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
    const { updateAppContext } = useAppContext();

    return useMemo(() => {

        // エディタのコンテキスト解除。
        updateAppContext(undefined);

        return EditorGeneratorCollection.find(g => g.name === name) ?? ({ name: 'default', EditorComponent: props => <p>Has not Editor</p>})

    }, [name]);

}


const findTokenByIndex = (token: IToken, index: number): IToken | undefined =>
{
    const { start, end } = token.getPosition();

    // 子孫を優先して探索
    for (const child of token.getChildren())
    {
        const found = findTokenByIndex(child, index);

        if (found)
        {
            return found;
        }
    }

    // 子孫にヒットしなかった場合は自分自身を返す
    if (start <= index && end > index)
    {
        return token;
    }
    
    return undefined;
}
