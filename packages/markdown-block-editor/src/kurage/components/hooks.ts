import { useMemo } from "react";
import { MarkdownContextProps, useMarkdownContext } from "../context/markdown-context";
import { MarkdownEditorContextProps, useMarkdownEditorContext } from "../context/markdown-editor-context";
import { MarkdownExtensionContextProps, useExtensionContext } from "../context/markdown-extension-context";
import { MarkdownTokenContextProps, useMarkdownTokenContext } from "../context/markdown-token-context";
import { MarkdownAppContextProps, useMarkdownAppContext } from "../context/markdown-app-context";
import { IAppContext, SelectCommand } from "@mde/markdown-core";

export type ExtensionContexts =
{
    appContext: MarkdownAppContextProps,
    tokenContext: MarkdownTokenContextProps,
    markdownContext: MarkdownContextProps,
    extensionContext: MarkdownExtensionContextProps;
    editorContext: MarkdownEditorContextProps;
}

export const useExtensionContexts = () =>
{
    const appContext = useMarkdownAppContext();
    const tokenContext = useMarkdownTokenContext();
    const markdownContext = useMarkdownContext();
    const extensionContext = useExtensionContext();
    const editorContext = useMarkdownEditorContext();

    return useMemo(() => {
        return { tokenContext, markdownContext, extensionContext, editorContext, appContext };
    }, [tokenContext, markdownContext, extensionContext, editorContext, appContext]);
}

export const useInternalCommandItems = (appContext: IAppContext) =>
{
    return ({
    name: "root",
    command: undefined,
    icon: undefined,
    label: 'root',
    children: [
        //{ name: 'markdown:add-image', label: 'xxx', icon: 'media-default', command: new AddImageCommand(appContext) },
        //{ name: 'markdown:add-blog-card', label: 'xxx', icon: 'archive', command: new AddBlogCardCommand(appContext) },
        //{ name: 'markdown:bold', label: 'xxx', icon: 'editor-bold', command: new BoldCommand(appContext) },
        { name: 'markdown:select', label: 'xxx', icon: '', command: new SelectCommand(appContext) },
    ]
});
}