// @ts-ignore
import { BlockControls } from "@wordpress/block-editor";
import { Modal, ToolbarButton, ToolbarGroup } from "@wordpress/components";
import { useMemo, useState } from "@wordpress/element";
import ImageUploadEditor from "./ImageUploadEditor";
import BlogCardGenerator from "./BlogCardGenerator";
import { __ } from "@wordpress/i18n";
import { CommandToolbarGroup } from "./edit-toolbar";
import { useToolbarActiveCommands } from "./inspector-hooks";
import { useExtensionContexts } from "./hooks";
import { LinkEditor } from "./LinkEditor";

const AppToolbars = () =>
{
    const contexts = useExtensionContexts();

    const [imageOpen, setImageOpen] = useState(false);
    const [cardOpen, setCardOpen] = useState(false);
    const [linkOpen, setLinkOpen] = useState(false);

    const activeCommandItems = useToolbarActiveCommands(contexts);

    return (
        <>
            <BlockControls>
                <ToolbarGroup>
                    <ToolbarButton icon="media-default" label={__('Add Image', 'markdown-block-editor')} onClick={() => setImageOpen(true)} />
                    <ToolbarButton icon="archive" label={__('Add Blog Card', 'markdown-block-editor')} onClick={() => setCardOpen(true)} />
                    <ToolbarButton icon="admin-links" label={__('Add Link', 'markdown-block-editor')} onClick={() => setLinkOpen(true)} />
                </ToolbarGroup>
            </BlockControls>

            <ToolbarButtonModal title={__('Add Image', 'markdown-block-editor')} isOpen={imageOpen} openChanged={setImageOpen}>
                <ImageUploadEditor onExecuted={() => setImageOpen(false)} />
            </ToolbarButtonModal>

            <ToolbarButtonModal title={__('Add Blog Card', 'markdown-block-editor')} isOpen={cardOpen} openChanged={setCardOpen}>
                <BlogCardGenerator onExecuted={() => setCardOpen(false)} />
            </ToolbarButtonModal>

            <ToolbarButtonModal title={__('Add Link', 'markdown-block-editor')} isOpen={linkOpen} openChanged={setLinkOpen}>
                <LinkEditor onExecuted={() => setLinkOpen(false)} />
            </ToolbarButtonModal>

            {
                <BlockControls>{ activeCommandItems.map(ci => <CommandToolbarGroup groupRoot={ci} />) }</BlockControls>
            }
            

        </>
    );
    
}


const ToolbarButtonModal = ({children, isOpen, title, openChanged}: any) =>
{

    return (
        <>{ isOpen && <Modal style={{width: "60%"}} title={title} onRequestClose={e => openChanged(false)} children={children} /> }</>
    )
}

export default AppToolbars;

