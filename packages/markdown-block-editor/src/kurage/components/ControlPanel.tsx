import { Button, SelectControl } from "@wordpress/components";
import { useMarkdownContext } from "../context/markdown-context";
import { useMarkdownEditorContext } from "../context/markdown-editor-context";
import { __ } from "@wordpress/i18n";
import { useMarkdownAppContext } from "../context/markdown-app-context";

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

            <Button variant="primary" className="markdown-block-editor-button-vertical markdown-block-editor-margin-vertical" onClick={() => setEditorState({ maximized: !editorState.maximized})}>
                { editorState.maximized ? __('Restore the editor to normal size.', 'markdown-block-editor') : __('Maximize the editor.', 'markdown-block-editor') }
            </Button>


            <SelectControl
                className="markdown-block-editor-margin-vertical"
                options={splitOptions}
                value={viewMode}
                onChange={v => onPanelChange(v as EditMode)}
                />
            
        </>
    )
}

