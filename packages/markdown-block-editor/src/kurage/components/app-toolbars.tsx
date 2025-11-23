import { BlockControls } from "@wordpress/block-editor";
import { Modal, ToolbarButton, ToolbarGroup } from "@wordpress/components";
import React, { useMemo, useState } from "react";
import ImageUploadEditor from "./image-upload-editor";
import BlogCardGenerator from "./blog-card-generator";
import { __ } from "@wordpress/i18n";
import { useMarkdownAppContext } from "../context/markdown-app-context";
import { CommandToolbar } from "./edit-toolbar";
import { useMarkdownTokenContext } from "../context/markdown-token-context";
import { useTokenCommands } from "./inspector-hooks";
import { useExtensionContexts } from "./hooks";

const AppToolbars = () =>
{
    const { markdownCore } = useMarkdownAppContext();
    const { singleToken } = useMarkdownTokenContext();
    const contexts = useExtensionContexts();

    const tokenType = singleToken?.getType() ?? '';

    const [imageOpen, setImageOpen] = useState(false);
    const [linkOpen, setLinkOpen] = useState(false);
    const tokenCommands = useTokenCommands(tokenType, contexts);
    const commandCollection = markdownCore?.createCommandCollection();

    return (
        <>
            <BlockControls>
                <ToolbarGroup>
                    <ToolbarButton icon="media-default" label={__('Add Image', 'mdtableeditor')} onClick={() => setImageOpen(true)} />
                    <ToolbarButton icon="archive" label={__('Add Blog Card', 'mdtableeditor')} onClick={() => setLinkOpen(true)} />
                    <ToolbarButton icon="editor-bold" label={__('Bold', 'mdtableeditor')} onClick={() => commandCollection?.execute('markdown:bold', null)} />
                </ToolbarGroup>
            </BlockControls>

            <ToolbarButtonModal title={__('Add Image', 'mdtableeditor')} isOpen={imageOpen} openChanged={setImageOpen}>
                <ImageUploadEditor mc={markdownCore} onExecuted={() => setImageOpen(false)} />
            </ToolbarButtonModal>

            <ToolbarButtonModal title={__('Add Blog Card', 'mdtableeditor')} isOpen={linkOpen} openChanged={setLinkOpen}>
                <BlogCardGenerator mc={markdownCore} onExecuted={() => setLinkOpen(false)} />
            </ToolbarButtonModal>

            {
                !!tokenCommands.length && <BlockControls>{ tokenCommands.map(ci => <CommandToolbar root={ci} />) }</BlockControls>
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

