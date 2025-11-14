import { PanelBody } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useExtensionComponents, useTokenEditorComponents } from "./token-editor";
import { MarkdownContextProps } from "../context/markdown-context";
import { InspectorControls } from "@wordpress/block-editor";
import { useMemo, useRef } from "react";
import { MarkdownTokenContextProps } from "../context/markdown-token-context";
import { LoadingPanel } from './loading'
import { MarkdownExtensionContextProps } from "../context/markdown-extension-context";
import { MarkdownEditorContextProps } from "../context/markdown-editor-context";
import { useExtensionContexts } from "./hooks";

export type ExtensionContexts =
{
    tokenContext: MarkdownTokenContextProps,
    markdownContext: MarkdownContextProps,
    extensionContext: MarkdownExtensionContextProps;
    editorContext: MarkdownEditorContextProps;
}
export const TokenInspectors = () =>
{
    const contexts = useExtensionContexts();
    const { markdownContext, tokenContext } = contexts;
    const { singleToken } = tokenContext;
    const { isEditing } = markdownContext;


    const contextsRef = useRef(contexts);
    contextsRef.current = useMemo(() => {
        if(isEditing)
        {
            return contextsRef.current;
        }

        return contexts;
    }, [isEditing]);

    const editors = useTokenEditorComponents(singleToken?.getType() ?? '');
    const extensions = useExtensionComponents();


    const tokenEditors = useMemo(() => editors.map(({ label, component: TokenEditor }) => (
        <PanelBody title={label}>
                <LoadingPanel isLoading={isEditing}>
                    { singleToken && <TokenEditor token={singleToken} contexts={contexts} /> }
                </LoadingPanel>
        </PanelBody>
    )), [contexts, isEditing, singleToken]);

    const extensionEditors = useMemo(() => extensions.map(({ label, component: ExtensionEditor }) => (
        <PanelBody title={label}>
                <LoadingPanel isLoading={isEditing}>
                    { singleToken && <ExtensionEditor contexts={contexts} /> }
                </LoadingPanel>
        </PanelBody>
    )), [contexts, isEditing, singleToken])

    return useMemo(() => {
        return (
            <InspectorControls>
                    { tokenEditors }
                    { extensionEditors }
            </InspectorControls>
        )

    }, [contexts, isEditing])
}

export default TokenInspectors;


