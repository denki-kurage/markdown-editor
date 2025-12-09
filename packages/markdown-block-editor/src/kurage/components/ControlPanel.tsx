import { Button, SearchControl, SelectControl } from "@wordpress/components";
import { useMarkdownContext } from "../context/markdown-context";
import { useMarkdownEditorContext } from "../context/markdown-editor-context";
import { __ } from "@wordpress/i18n";
import { useDispatch, useSelect } from "@wordpress/data";
import { store } from "../store";
import { OthreSettings } from "./OtherSettings";
import { useMarkdownAppContext } from "../context/markdown-app-context";
import { useState } from "react";

type EditMode = "code"|"view"|"both";

export const ControlPanel = ({}) =>
{
    const { editorState, setEditorState } = useMarkdownEditorContext();
    const { undo, redo, openFindDialog, openReplaceDialog } = useMarkdownAppContext().appContext.getEditControl();

    const settings = useSelect(select => select(store).getSettings(), []);

    const { viewMode, setAttributes } = useMarkdownContext();
    const onPanelChange = (viewMode: EditMode) =>
    {
        setAttributes({viewMode});
    }
    return (
        <>

        
            <div className="button-group" >
                <Button variant="primary" onClick={undo}>戻る</Button>
                <Button variant="primary" onClick={redo}>進む</Button>
            </div>


            <div className="button-group" >
                <Button variant="primary" disabled={viewMode === "code"} onClick={() => onPanelChange("code")}>{ __('Code', 'mdtableeditor') }</Button>
                <Button variant="primary" disabled={viewMode === "view"} onClick={() => onPanelChange("view")}>{ __('View', 'mdtableeditor') }</Button>
                <Button variant="primary" disabled={viewMode === "both"} onClick={() => onPanelChange("both")}>{ __('Both', 'mdtableeditor') }</Button>
            </div>


        
            <div className="button-group" >
                <Button variant="primary" onClick={openFindDialog}>検索</Button>
                <Button variant="primary" onClick={openReplaceDialog}>置換</Button>
            </div>



            <Button variant="primary" onClick={() => setEditorState({ maximized: !editorState.maximized})}>
                { editorState.maximized ? '元に戻す' : '最大化' }
            </Button>

            { settings && <EditorSettings /> }


        </>
    )
}


export const SearchBox = ({}) =>
{
    const [text, setText] = useState('');

    return (
        <>

        </>
    )

}



const fontFamilies = ['BIZ UDゴシック', 'Consolas'].map(x => ({label: x, value: x}));
const fontSizes = [...Array(20).keys()].map(x => (x + 4).toString()).map(x => ({label: x, value: x}))

export const EditorSettings = ({}) =>
{
    const { settings, storeState } = useSelect(select => {
        const s = select(store);
        const settings = s.getSettings();
        const storeState = s.getStoreState();
        return { settings, storeState }
    }, []);

    const { updateSettings } = useDispatch(store);
    const faultMsg = storeState.faultMessage ?? null;

    const { markdownCore } = useMarkdownAppContext();
    const { fontSize, fontFamily } = settings;

    return (
        <>
            <p>{storeState.isLoading ? "◎設定の更新中！" : faultMsg ?? '' }</p>

<p>{markdownCore.getConfigurationHelper().getRecentCodeLanguages().join(', ')}</p>

            <SelectControl
                label="Font Family"
                options={fontFamilies}
                value={fontFamily}
                onChange={fontFamily => updateSettings({ fontFamily })}
                />
            
            <SelectControl
                label="Font Size"
                options={fontSizes}
                value={(fontSize || 12).toString()}
                onChange={e => updateSettings({ fontSize: parseInt(e) })} />

            <OthreSettings />
            
        </>
    )
}



