import { InspectorControls } from "@wordpress/block-editor";
import { PanelBody } from "@wordpress/components";
import { FlatCommandToolbar } from "./edit-toolbar";
import { useTokenCommands } from "./inspector-hooks";
import { useMarkdownTokenContext } from "../context/markdown-token-context";
import { useExtensionContexts } from "./hooks";
const iconDisabled = '.components-button[aria-disabled=true]{ opacity: 0.3; }';

export const CommandsInspector = ({}) =>
{
    const { singleToken } = useMarkdownTokenContext();
    const contexts = useExtensionContexts();
    const tokenType = singleToken?.getType() ?? '';
    const commandItems = useTokenCommands(tokenType, contexts)
    
    return (
        <InspectorControls>
            <PanelBody title="Commands">
                <style type="text/css">{iconDisabled}</style>

                <div>
                    {
                        commandItems.map(ci => {
                            const children = ci.children;
                            return children && (
                                <>
                                    <p style={{marginBottom: ".1em"}}>{ci.label}</p>

                                    <FlatCommandToolbar root={ci} />
                                </>
                            )
                        })
                    }
                </div>

            </PanelBody>
        </InspectorControls>
    )
}

