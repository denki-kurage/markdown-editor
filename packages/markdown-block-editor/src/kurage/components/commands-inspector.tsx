import { InspectorControls } from "@wordpress/block-editor";
import { useMarkdownEditorContext } from "../context/markdown-editor-context"
import { Button, PanelBody, RangeControl, ToolbarButton, ToolbarGroup } from "@wordpress/components";
import { FlatCommandToolbar } from "./edit-toolbar";

const iconDisabled = '.components-button[aria-disabled=true]{ opacity: 0.3; }';

export const CommandsInspector = ({}) =>
{
    const { commands } = useMarkdownEditorContext();

    return (
        <InspectorControls>
            <PanelBody title="Commands">
                <style type="text/css">{iconDisabled}</style>

                <div>
                    {
                        commands.map(command => {
                            const children = command.children;
                            return children && (
                                <>
                                    <p>{command.label}</p>

                                    <FlatCommandToolbar root={command} />
                                </>
                            )
                        })
                    }
                </div>

            </PanelBody>
        </InspectorControls>
    )
}

