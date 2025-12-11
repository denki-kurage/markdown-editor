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
                <Button variant="primary" onClick={undo}>戻る</Button>
                <Button variant="primary" onClick={redo}>進む</Button>
            </div>

            <div className="markdown-block-editor-button-group markdown-block-editor-margin-vertical" >
                <Button variant="primary" className="markdown-block-editor-button-vertical" onClick={openFindDialog}>検索</Button>
                <Button variant="primary" className="markdown-block-editor-button-vertical" onClick={openReplaceDialog}>置換</Button>
            </div>

            <Button variant="primary" className="markdown-block-editor-button-vertical markdown-block-editor-margin-vertical" onClick={() => setEditorState({ maximized: !editorState.maximized})}>
                { editorState.maximized ? 'エディタを普通サイズに戻す' : 'エディタ最大化' }
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

