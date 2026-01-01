import { Editor, Monaco, } from '@monaco-editor/react';
import { editor as monacoEditor } from 'monaco-editor';
import { useEffect, useMemo, useRef, useState } from "@wordpress/element";
import root from 'react-shadow';
import { useMarkdownContext } from "../context/markdown-context";
import { AppContextGenerateParams, useMarkdownAppContext } from '../context/markdown-app-context';
import { MarkdownEditorProps } from './editor-wrapper';
import { MonacoEditorContext } from '../classes/MonacoEditorContext';
import { useSelect } from '@wordpress/data';
import { store } from '../store';
import { IConfigurationStorage } from '@kurage/markdown-core';

export const useMarkdownApp = (
        configurationStorage: IConfigurationStorage,
        editor?: monacoEditor.IStandaloneCodeEditor,
        monaco?: Monaco
    ) =>
{
    return useMemo(() => {
        const model = editor?.getModel();

        if(editor && model && monaco)
        {

            // Monaco Editor は初期値に改行コードが含まれる場合はその改行コードが適用、
            // 無い場合はおそらくシステム依存。
            // LFにしないと、文字列数が正確にカウントできないなどいろいろ不都合なので
            model.setEOL(monaco.editor.EndOfLineSequence.LF)

            const appContext = new MonacoEditorContext(monaco, model, editor, configurationStorage);
            const x:  AppContextGenerateParams = { appContext };
            return x;
        }
    }, [editor, monaco]);
}

export const MonacoEditor = ({ initializedMarkdownCore }: MarkdownEditorProps) =>
{
    const [monaco, setMonaco] = useState<Monaco|undefined>();
    const [editor, setEditor] = useState<monacoEditor.IStandaloneCodeEditor|undefined>();
    const { configurationStorage } = useMarkdownAppContext();
    const { markdown, onMarkdownChanged: onValueChanged } = useMarkdownContext();
    const settings = useSelect(select => select(store).getSettings(), []);

    const domRef = useRef<HTMLDivElement>(null);

    const params = useMarkdownApp(configurationStorage, editor, monaco);
    useEffect(() => initializedMarkdownCore(params), [params])

    
    const family = editor?.getOption(monacoEditor.EditorOption.fontFamily);

    /*
    AABBCCDDEE
    あいうえお
    

| fruits     | price | color  | pr |
|------------|-------|--------|----|
| abcdefghij | 200   | red    | 1  |
| あいうえお | 1200  | purple | 22 |
| banana     | 160   | yellow | 3  |ff
| melon      | 2000  | green  | 51 |

    */
    useEffect(() => {
        if(settings && editor)
        {
            const { fontFamily, fontSize, monacoTheme } = settings;
            editor.updateOptions({
                fontFamily,
                fontSize,
                theme: monacoTheme
            });

            
        }
    }, [settings, editor]);


    /**
     * TODO: IMEの座標がズレる問題。DIVをInput要素にしている部分を取得しているが、ブラウザの実装依存のため対策が見つからない。
     * 
    useEffect(() => {
        const handle = setInterval(() => {
            const shadow = domRef?.current?.ownerDocument?.getElementsByClassName('monaco-shadow-dom')[0]?.shadowRoot;
            const active = shadow?.activeElement;
            const contentEditable = active?.getAttribute('contenteditable');

            console.log(shadow, active, contentEditable);            
        }, 8000);

        return () => clearInterval(handle);
    }, [domRef.current]);

    */

    return (
        <>
        
            <root.div className="monaco-shadow-dom">

                <link
                    rel="stylesheet"
                    type="text/css"
                    data-name="vs/editor/editor.main"
                    href="https://cdn.jsdelivr.net/npm/monaco-editor@0.54.0/min/vs/editor/editor.main.css"
                    />

                {/* <div ref={domRef} className="mark-editor-container" style={{position: 'absolute', bottom: 0}}>abcdefg</div> */}

                <Editor
                    width="100%"
                    height="100%"
                    defaultLanguage="markdown"
                    theme="vs-dark"
                    value={markdown}
                    onChange={e => {
                        onValueChanged(e ?? '')
                    }}
                    
                    onMount={(editor, monaco) => { setEditor(editor); setMonaco(monaco); }}

                    
                    />
                
            </root.div>

        </>
    )

}
