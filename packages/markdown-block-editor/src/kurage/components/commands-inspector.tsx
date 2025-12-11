import { InspectorControls } from "@wordpress/block-editor";
import { PanelBody } from "@wordpress/components";
import { useExtensionContexts } from "./hooks";
import { useInspectorActiveCommands, } from "./inspector-hooks";
import { CommandToolbarGroup } from "./edit-toolbar";
const iconDisabled = '.components-button[aria-disabled=true]{ opacity: 0.3; }';

export const CommandsInspector = ({}) =>
{
    const contexts = useExtensionContexts();
    const activeCommandItems = useInspectorActiveCommands(contexts)
    
    return (
        <InspectorControls>
            <PanelBody title="Commands">
                <style type="text/css">{iconDisabled}</style>

                <div className="command-inspector">
                    {
                        activeCommandItems.map(ci => {
                            return (
                                <>
                                    { ci.children?.map(c2 => {

                                        return (
                                            <>
                                                <p style={{marginBottom: ".1em"}}>{c2.label} ({ci.label})</p>

                                                <CommandToolbarGroup groupRoot={c2} />
                                            </>
                                        )
                                    })}
                                </>
                            )
                        })
                    }
                </div>

            </PanelBody>
        </InspectorControls>
    )
}

