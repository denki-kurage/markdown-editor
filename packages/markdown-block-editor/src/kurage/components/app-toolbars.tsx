// @ts-ignore
import { BlockControls, LinkControl } from "@wordpress/block-editor";
import { Button, Modal, ToolbarButton, ToolbarGroup } from "@wordpress/components";
import React, { useMemo, useState } from "react";
import ImageUploadEditor from "./image-upload-editor";
import BlogCardGenerator from "./blog-card-generator";
import { __ } from "@wordpress/i18n";
import { useMarkdownAppContext } from "../context/markdown-app-context";
import { CommandToolbarGroup } from "./edit-toolbar";
import { useMarkdownTokenContext } from "../context/markdown-token-context";
import { useToolbarActiveCommands } from "./inspector-hooks";
import { useExtensionContexts } from "./hooks";

const AppToolbars = () =>
{
    const { markdownCore } = useMarkdownAppContext();
    const contexts = useExtensionContexts();

    const [imageOpen, setImageOpen] = useState(false);
    const [cardOpen, setCardOpen] = useState(false);
    const [linkOpen, setLinkOpen] = useState(false);

    const activeCommandItems = useToolbarActiveCommands(contexts);

    return (
        <>
            <BlockControls>
                <ToolbarGroup>
                    <ToolbarButton icon="media-default" label={__('Add Image', 'mdtableeditor')} onClick={() => setImageOpen(true)} />
                    <ToolbarButton icon="archive" label={__('Add Blog Card', 'mdtableeditor')} onClick={() => setCardOpen(true)} />
                    <ToolbarButton icon="admin-links" label={__('リンク追加', 'mdtableeditor')} onClick={() => setLinkOpen(true)} />
                </ToolbarGroup>
            </BlockControls>

            <ToolbarButtonModal title={__('Add Image', 'mdtableeditor')} isOpen={imageOpen} openChanged={setImageOpen}>
                <ImageUploadEditor mc={markdownCore} onExecuted={() => setImageOpen(false)} />
            </ToolbarButtonModal>

            <ToolbarButtonModal title={__('Add Blog Card', 'mdtableeditor')} isOpen={cardOpen} openChanged={setCardOpen}>
                <BlogCardGenerator mc={markdownCore} onExecuted={() => setCardOpen(false)} />
            </ToolbarButtonModal>

            <ToolbarButtonModal title={__('Add Link', 'mdtableeditor')} isOpen={linkOpen} openChanged={setLinkOpen}>
                <LinkEditor onExecuted={() => setLinkOpen(false)} />
            </ToolbarButtonModal>

            {
                <BlockControls>{ activeCommandItems.map(ci => <CommandToolbarGroup groupRoot={ci} />) }</BlockControls>
            }
            

        </>
    );
    
}


export const LinkEditor = ({ onExecuted }: any) =>
{
    const [url, setUrl] = useState('');

    const accept = () =>
    {
        console.log(url);
        onExecuted();
    }

    return (
        <>
            <LinkControl onChange={setUrl} />

            <Button variant="primary" onClick={accept}>決定</Button>
        </>
    )
}

const ToolbarButtonModal = ({children, isOpen, title, openChanged}: any) =>
{

    return (
        <>{ isOpen && <Modal style={{width: "60%"}} title={title} onRequestClose={e => openChanged(false)} children={children} /> }</>
    )
}

export default AppToolbars;

