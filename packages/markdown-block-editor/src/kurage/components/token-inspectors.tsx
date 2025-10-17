import { PanelBody } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { TokenEditor } from "./token-editor";
import TokenExplorer from "./token-explorer";
import { useMarkdownContext } from "../context/markdown-context";
import { InspectorControls } from "@wordpress/block-editor";


export const TokenInspectors = () =>
{
    const { markdown } = useMarkdownContext();

    return (
        <InspectorControls>

            <PanelBody title={__('Token Editor', 'mdtableeditor')}>
                <TokenEditor />
            </PanelBody>

            <PanelBody title={__('Token Explorer', 'mdtableeditor')}>
                {
                <TokenExplorer
                    markdown={markdown}
                    index={0}
                    />
                    }
            </PanelBody>

        </InspectorControls>

    )
}

export default TokenInspectors;


