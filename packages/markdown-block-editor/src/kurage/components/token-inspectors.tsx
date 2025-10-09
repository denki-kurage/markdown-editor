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
                {/* <TokenEditor /> */}
            </PanelBody>

            <PanelBody title={__('Token Explorer', 'mdtableeditor')}>
                <p>Filter Token: [ Tables         ] [クリア]</p>
                {/*
                <TokenExplorer
                    markdown={markdown}
                    index={index}
                    />
                    */}
            </PanelBody>

        </InspectorControls>

    )
}

export default TokenInspectors;


