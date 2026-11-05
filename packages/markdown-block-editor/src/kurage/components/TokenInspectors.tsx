import { PanelBody } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import { useEffect, useMemo, useRef, useState } from "@wordpress/element";
import { LoadingPanel } from '../markdown-react-editor/components/Loading'
import { useExtensionContexts } from "../markdown-react-editor/hooks";
import { useMarkdownEditorComponentAdapter } from "../markdown-react-editor/context/markdown-editor-component-adapter";
import { filterTokenEditorComponents } from "../markdown-react-editor/IMarkdownEditorComponentAdapter";


export const TokenInspectors = () =>
{
    const contexts = useExtensionContexts();
    const { editorStateContext, tokenContext } = contexts;
    const { singleToken } = tokenContext;
    const { isEditing } = editorStateContext;
    const componentAdapter = useMarkdownEditorComponentAdapter();

    
    /**
     * ＊重要。
     * 複合コンテキストをキャッシュしないと性能の低下を引き起こす。
     * 拡張コンポーネントにコンテキストを渡すときはかならずキャッシュのほうを渡すこと。
     */
    const contextsRef = useRef(contexts);
    contextsRef.current = useMemo(() => {
        if(isEditing)
        {
            return contextsRef.current;
        }

        return contexts;
    }, [isEditing, /*  */ contexts]);

    const ctx = contextsRef.current;
    const tokenType = singleToken?.getType() ?? '';

    const tokenEditorComponents = useMemo(() => {
         const tokenEditorComponents = componentAdapter.getTokenEditorComponents(contexts);
         return filterTokenEditorComponents(tokenType, tokenEditorComponents);
    }, [contexts, componentAdapter, tokenType]);



    const extensionEditors = useMemo(() => tokenEditorComponents.map(({ label, component: ExtensionEditor }) => (
        <PanelBody title={label}>
            <LoadingPanel isLoading={isEditing}>
                { singleToken && <ExtensionEditor key={singleToken.getType()} token={singleToken} contexts={ctx} /> }
            </LoadingPanel>
        </PanelBody>
    )), [ctx, isEditing, singleToken, tokenEditorComponents, singleToken]);

    
    return (
        <InspectorControls>
            { extensionEditors }
        </InspectorControls>
    )
}

export default TokenInspectors;


