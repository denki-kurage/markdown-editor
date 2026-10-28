import { useMemo } from "@wordpress/element";
import { MarkdownTokenContextType, useMarkdownTokenContext } from "../context/markdown-token-context";
import { IAppContext, SelectCommand } from "@kurage/markdown-core";
import { MarkdownCoreContextType, useMarkdownCoreContext } from "../context/markdown-core-context";
import { MarkdownEditorStateContextType, useMarkdownEditorStateContext } from "../context/markdown-editor-state-context";
import { MarkdownEditorAttributeContextType, useMarkdownEditorAttributeContext } from "../context/markdown-editor-attribute-context";

export type ExtensionContexts =
{
    coreContext: MarkdownCoreContextType,
    tokenContext: MarkdownTokenContextType,
    editorAttributeContext: MarkdownEditorAttributeContextType,
    editorStateContext: MarkdownEditorStateContextType;
}

export const useExtensionContexts = () =>
{
    const coreContext = useMarkdownCoreContext();
    const tokenContext = useMarkdownTokenContext();
    const editorAttributeContext = useMarkdownEditorAttributeContext();
    const editorStateContext = useMarkdownEditorStateContext();

    return useMemo(() => {
        return { tokenContext, editorAttributeContext, editorStateContext, coreContext };
    }, [tokenContext, editorAttributeContext, editorStateContext, coreContext]);
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
    const { settings, settingOptions } = useMarkdownCoreContext();

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



