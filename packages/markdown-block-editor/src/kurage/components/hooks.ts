import { useMemo } from "@wordpress/element";
import { MarkdownContextProps, useMarkdownContext } from "../context/markdown-context";
import { MarkdownEditorContextProps, useMarkdownEditorContext } from "../context/markdown-editor-context";
import { MarkdownTokenContextProps, useMarkdownTokenContext } from "../context/markdown-token-context";
import { MarkdownAppContextProps, useMarkdownAppContext } from "../context/markdown-app-context";
import { IAppContext, SelectCommand } from "@kurage/markdown-core";

export type ExtensionContexts =
{
    appContext: MarkdownAppContextProps,
    tokenContext: MarkdownTokenContextProps,
    markdownContext: MarkdownContextProps,
    editorContext: MarkdownEditorContextProps;
}

export const useExtensionContexts = () =>
{
    const appContext = useMarkdownAppContext();
    const tokenContext = useMarkdownTokenContext();
    const markdownContext = useMarkdownContext();
    const editorContext = useMarkdownEditorContext();

    return useMemo(() => {
        return { tokenContext, markdownContext, editorContext, appContext };
    }, [tokenContext, markdownContext, editorContext, appContext]);
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


export const useThemes = () =>
{
    const { settings, settingOptions } = useMarkdownAppContext();

    return useMemo(() => {
        const { adminTheme, prismTheme, frontTheme } = settings;
        const prismMap = new Map(settingOptions.prismThemes.map(p => [p.key, p.url]));
        const adminMap = new Map(settingOptions.adminThemes.map(p => [p.key, p.url]));
        const frontMap = new Map(settingOptions.frontThemes.map(p => [p.key, p.url]));
        const prismPath = prismMap.get(prismTheme);
        const adminPath = adminMap.get(adminTheme);
        const frontPath = frontMap.get(frontTheme);

        return { settings, settingOptions, adminPath, prismPath, frontPath, prismTheme, adminTheme, frontTheme };
    }, [settings, settingOptions]);
}



