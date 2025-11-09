import { PanelBody } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { TokenEditor } from "./token-editor";
import { MarkdownContextProps, useMarkdownContext } from "../context/markdown-context";
import { InspectorControls } from "@wordpress/block-editor";
import { applyFilters } from "@wordpress/hooks";
import { useEffect, useMemo, useRef } from "react";
import { MarkdownTokenContextProps, useMarkdownTokenContext } from "../context/markdown-token-context";
import { Loading, LoadingPanel } from './loading'
import { useConfigContext } from "../context/markdown-config-context";
import { MarkdownExtensionContextProps, useExtensionContext } from "../context/markdown-extension-context";
import { MarkdownEditorContextProps, useMarkdownEditorContext } from "../context/markdown-editor-context";

export type ExtensionContext =
{
    tokenContext: MarkdownTokenContextProps,
    markdownContext: MarkdownContextProps,
    extensionContext: MarkdownExtensionContextProps;
    editorContext: MarkdownEditorContextProps;
}
export const TokenInspectors = () =>
{
    const tokenContext = useMarkdownTokenContext();
    const markdownContext = useMarkdownContext();
    const extensionContext = useExtensionContext();
    const editorContext = useMarkdownEditorContext();
    const { isEditing } = markdownContext;


    const contextsRef = useRef({ tokenContext, markdownContext, extensionContext, editorContext });
    const contexts = contextsRef.current = useMemo(() => {
        if(isEditing)
        {
            return contextsRef.current;
        }

        return { tokenContext, markdownContext, extensionContext, editorContext }
    }, [isEditing,  tokenContext, markdownContext, extensionContext, editorContext]);

    const panels = useMemo(() => applyFilters('extensionInspectorPanels', [{label: __('Token Editor', 'mdtableeditor'), panel: TokenEditor}]) as any[], []);
    const panelComponents = useMemo(() => panels.map(({ label, panel: Panel }) => (
        <PanelBody title={label}>
                <LoadingPanel isLoading={isEditing}>
            <Panel contexts={contexts} />
                </LoadingPanel>
        </PanelBody>
    )), [contexts, isEditing]);


    return useMemo(() => {

        console.log("======================================== <<<")
        console.log(isEditing)

        return (
            <InspectorControls>
                    { panelComponents }
            </InspectorControls>
        )

    }, [contexts, isEditing])
}

export default TokenInspectors;


