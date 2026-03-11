import { Button, Modal, SelectControl } from "@wordpress/components";
import { useMarkdownContext } from "../context/markdown-context";
import { useMarkdownEditorContext } from "../context/markdown-editor-context";
import { __ } from "@wordpress/i18n";
import { useMarkdownAppContext } from "../context/markdown-app-context";
import { useState } from "@wordpress/element";
import { BeginnerAssist } from "./BeginnerAssist";

type EditMode = "code"|"view"|"both";
const splitOptions = [
    ['code', 'Code'],
    ['view', 'View'],
    ['both', 'Both']
].map(([k, v]) => ({ value: k, label: v}))

export const ControlPanel = ({}) =>
{
    const { editorState, setEditorState } = useMarkdownEditorContext();
    const { undo, redo, openFindDialog, openReplaceDialog } = useMarkdownAppContext().appContext.getEditControl();
    const { maximized, beginnerAssistOpened } = editorState;

    const { viewMode, setAttributes } = useMarkdownContext();
    const onPanelChange = (viewMode: EditMode) =>
    {
        setAttributes({viewMode});
    }

    return (
        <>

        
            <div className="markdown-block-editor-button-group markdown-block-editor-margin-vertical" >
                <Button variant="primary" onClick={undo}>{__('undo', 'markdown-block-editor')}</Button>
                <Button variant="primary" onClick={redo}>{__('redo', 'markdown-block-editor')}</Button>
            </div>

            <div className="markdown-block-editor-button-group markdown-block-editor-margin-vertical" >
                <Button variant="primary" className="markdown-block-editor-button-vertical" onClick={openFindDialog}>{__('find', 'markdown-block-editor')}</Button>
                <Button variant="primary" className="markdown-block-editor-button-vertical" onClick={openReplaceDialog}>{__('replace', 'markdown-block-editor')}</Button>
            </div>

            <Button variant="primary" className="markdown-block-editor-button-vertical markdown-block-editor-margin-vertical" onClick={() => setEditorState({ maximized: !maximized})}>
                { maximized ? __('Restore the editor to normal size.', 'markdown-block-editor') : __('Maximize the editor.', 'markdown-block-editor') }
            </Button>


            <SelectControl
                className="markdown-block-editor-margin-vertical"
                options={splitOptions}
                value={viewMode}
                onChange={v => onPanelChange(v as EditMode)}
                />
            
            <BeginnerAssistModal />
            
        </>
    )
}

export const BeginnerAssistModal = ({}) =>
{
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button variant="tertiary" style={{width: '100%'}} onClick={() => setIsOpen(true)}>{__('Open Beginner Assist', 'markdown-block-editor')}</Button>
            { isOpen && <Modal title={__('Beginner Assist(Experimental Feature)', 'markdown-block-editor')} onRequestClose={e => setIsOpen(false)}><BeginnerAssist close={() => setIsOpen(false)} /></Modal>}
        </>
    )
}
