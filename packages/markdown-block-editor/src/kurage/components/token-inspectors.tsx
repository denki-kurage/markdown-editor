import { PanelBody } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { TokenEditor } from "./token-editor";
import { useMarkdownContext } from "../context/markdown-context";
import { InspectorControls } from "@wordpress/block-editor";
import { applyFilters } from "@wordpress/hooks";
import { useEffect, useMemo, useRef } from "react";
import { useMarkdownTokenContext } from "../context/markdown-token-context";
import { Loading } from './loading'


export const TokenInspectors = () =>
{
    const tokenContext = useMarkdownTokenContext();
    const markdownContext = useMarkdownContext();
    const { isEditing } = markdownContext;


    const contextsRef = useRef({ tokenContext, markdownContext });
    const contexts = contextsRef.current = useMemo(() => {
        if(isEditing)
        {
            return contextsRef.current;
        }

        return { tokenContext, markdownContext }
    }, [isEditing,  tokenContext, markdownContext]);

    const panels = useMemo(() => applyFilters('extensionInspectorPanels', []) as any[], []);
    const editors = useMemo(() => applyFilters('e', [TokenEditor]) as any[], []);

    const editorComponents = useMemo(() => editors.map(Editor => <Editor contexts={contexts} />), [contexts]);
    const panelComponents = useMemo(() => panels.map(Panel => <Panel contexts={contexts} />), [contexts]);


    return useMemo(() => {

        console.log("======================================== <<<")
        console.log(isEditing)

        return (
            <InspectorControls>

                <PanelBody title={__('Token Editor', 'mdtableeditor')}>
                    <div style={{position: 'relative'}}>
                        { editorComponents }
                        { panelComponents }
                        <Loading isLoading={isEditing} />
                    </div>
                </PanelBody>

                {/* panels.map(Panel => {
                    return (
                        <div style={{position: 'relative'}}>
                            <Panel contexts={contexts} />
                            <Loading isLoading={isEditing} />
                        </div>
                    )
                }) */}

            </InspectorControls>
        )

    }, [contexts, isEditing])
}

export default TokenInspectors;


