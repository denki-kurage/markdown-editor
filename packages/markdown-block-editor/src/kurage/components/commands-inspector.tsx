import { InspectorControls } from "@wordpress/block-editor";
import { useMarkdownEditorContext } from "../context/markdown-editor-context"
import { PanelBody } from "@wordpress/components";
import { FlatCommandToolbar } from "./edit-toolbar";
const iconDisabled = '.components-button[aria-disabled=true]{ opacity: 0.3; }';

export const CommandsInspector = ({}) =>
{
    const { commandItems } = useMarkdownEditorContext();

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

