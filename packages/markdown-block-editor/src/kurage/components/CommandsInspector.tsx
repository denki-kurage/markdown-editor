import { InspectorControls } from "@wordpress/block-editor";
import { PanelBody } from "@wordpress/components";
import { useExtensionContexts } from "../markdown-react-editor/hooks";
import { CommandToolbarGroup } from "./CommandToolbarGroup";
import { useMarkdownEditorComponentAdapter } from "../markdown-react-editor/context/markdown-editor-component-adapter";
import { useMemo } from "@wordpress/element";
import { filterActiveCommands } from "../markdown-react-editor/IMarkdownEditorComponentAdapter";
const iconDisabled = '.components-button[aria-disabled=true]{ opacity: 0.3; }';

export const CommandsInspector = ({}) =>
{
    const contexts = useExtensionContexts();
    const editorComponentAdapter = useMarkdownEditorComponentAdapter();

    const activeCommandItems = useMemo(() => {
        const items = editorComponentAdapter.getSidebarCommandItems(contexts);
        return filterActiveCommands(items);
    }, [contexts, editorComponentAdapter]);
    
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

