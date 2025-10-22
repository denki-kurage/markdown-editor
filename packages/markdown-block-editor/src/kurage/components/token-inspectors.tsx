import { PanelBody } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { TokenEditor } from "./token-editor";
import { useMarkdownContext } from "../context/markdown-context";
import { InspectorControls } from "@wordpress/block-editor";
import { applyFilters } from "@wordpress/hooks";
import { useMemo } from "react";
import { useMarkdownTokenContext } from "../context/markdown-token-context";


export const TokenInspectors = () =>
{
    const tokenContext = useMarkdownTokenContext();
    const markdownContext = useMarkdownContext();
    const panels = useMemo(() =>
    {
        const contexts = { tokenContext, markdownContext }
        const components = applyFilters(
            'extensionInspectorPanels',
            []
        ) as any[];
        return components.map(Component => <Component {...contexts} />)
    },
    [tokenContext, markdownContext]) as JSX.Element[];

    

    return (
        <InspectorControls>

            <PanelBody title={__('Token Editor', 'mdtableeditor')}>
                <TokenEditor />
            </PanelBody>

            { panels[0] }

        </InspectorControls>

    )
}

export default TokenInspectors;


