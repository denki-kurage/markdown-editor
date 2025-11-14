import { useMemo } from "react";
import { useMarkdownContext } from "../context/markdown-context";
import { useMarkdownEditorContext } from "../context/markdown-editor-context";
import { useExtensionContext } from "../context/markdown-extension-context";
import { useMarkdownTokenContext } from "../context/markdown-token-context";

export const useExtensionContexts = () =>
{
    const tokenContext = useMarkdownTokenContext();
    const markdownContext = useMarkdownContext();
    const extensionContext = useExtensionContext();
    const editorContext = useMarkdownEditorContext();

    return useMemo(() => {
        return { tokenContext, markdownContext, extensionContext, editorContext };
    }, [tokenContext, markdownContext, extensionContext, editorContext]);
}