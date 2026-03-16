import { PanelBody } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useExtensionComponents, useTokenEditorComponents } from "./inspector-hooks";
import { InspectorControls } from "@wordpress/block-editor";
import { useEffect, useMemo, useRef, useState } from "@wordpress/element";
import { LoadingPanel } from './Loading'
import { useExtensionContexts } from "./hooks";


export const TokenInspectors = () =>
{
    const [renderCount, setRenderCount] = useState(0);
    const contexts = useExtensionContexts();
    const { editorContext, tokenContext } = contexts;
    const { singleToken } = tokenContext;
    const { isEditing } = editorContext;



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
    const editorInfos = useTokenEditorComponents(tokenType);
    const extensionInfos = useExtensionComponents();

    useEffect(() => {
        if(singleToken)
        {
            setRenderCount(renderCount + 1);
        }
    }, [singleToken]);


    const tokenEditors = useMemo(() => editorInfos.map(({ label, component: TokenEditor }) => (
        <PanelBody title={label}>
            <LoadingPanel isLoading={isEditing}>
                { singleToken && <TokenEditor key={renderCount} token={singleToken} contexts={ctx} /> }
            </LoadingPanel>
        </PanelBody>
    )), [ctx, isEditing, renderCount]);

    const extensionEditors = useMemo(() => extensionInfos.map(({ label, component: ExtensionEditor }) => (
        <PanelBody title={label}>
            <LoadingPanel isLoading={isEditing}>
                { singleToken && <ExtensionEditor key={renderCount} token={singleToken} contexts={ctx} /> }
            </LoadingPanel>
        </PanelBody>
    )), [ctx, isEditing, renderCount])

    
    return (
        <InspectorControls>
            { tokenEditors }
            { extensionEditors }
        </InspectorControls>
    )
}

export default TokenInspectors;


