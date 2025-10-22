import { BlockControls } from "@wordpress/block-editor";
import { Modal, ToolbarButton, ToolbarGroup } from "@wordpress/components";
import React, { useMemo, useState } from "react";
import ImageUploadEditor from "./image-upload-editor";
import BlogCardGenerator from "./blog-card-generator";
import { __ } from "@wordpress/i18n";
import { useAppContext } from "../context/markdown-app-context";
import { CommandToolbar } from "./edit-toolbar";
import { useMarkdownEditorContext } from "../context/markdown-editor-context";

const AppToolbars = () =>
{
    const [imageOpen, setImageOpen] = useState(false);
    const [linkOpen, setLinkOpen] = useState(false);

    const { markdownCore, appContext } = useAppContext();
    const { commands } = useMarkdownEditorContext();
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
                !!commands.length && <BlockControls>{ commands.map(command => <CommandToolbar root={command} />) }</BlockControls>
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

