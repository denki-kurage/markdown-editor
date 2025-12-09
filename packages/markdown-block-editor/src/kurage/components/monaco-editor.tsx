import { Editor, Monaco,  } from '@monaco-editor/react';
import { editor, editor as ieditor } from 'monaco-editor';
import { useEffect, useMemo, useState } from "react";
import root from 'react-shadow';
// @ts-ignore
import css2 from './table.dscss';
import { useMarkdownContext } from "../context/markdown-context";
import { AppContextGenerateParams, useMarkdownAppContext } from '../context/markdown-app-context';
import { MarkdownEditorProps } from './editor-wrapper';
import { MonacoEditorContext } from '../classes/MonacoEditorContext';
import { useSelect } from '@wordpress/data';
import { store } from '../store';
import { IConfigurationStorage } from '@mde/markdown-core';
import { Button, TextControl } from '@wordpress/components';

export const useMarkdownApp = (
        configurationStorage: IConfigurationStorage,
        editor?: editor.IStandaloneCodeEditor,
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
    const [editor, setEditor] = useState<ieditor.IStandaloneCodeEditor|undefined>();
    const { configurationStorage } = useMarkdownAppContext();
    const { markdown, onMarkdownChanged: onValueChanged } = useMarkdownContext();
    const settings = useSelect(select => select(store).getSettings(), []);


    const params = useMarkdownApp(configurationStorage, editor, monaco);
    useEffect(() => initializedMarkdownCore(params), [params])

    
    const family = editor?.getOption(ieditor.EditorOption.fontFamily);

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
            const { fontFamily, fontSize } = settings;
            editor.updateOptions({
                fontFamily,
                fontSize
            })
        }
    }, [settings])

    useEffect(() => {

    }, [editor?.getModel()?.getEndOfLineSequence()])


    return (
        <>
        
            <root.div className="monaco-shadow-dom">

                <style>{css2}</style>

                <link
                    rel="stylesheet"
                    type="text/css"
                    data-name="vs/editor/editor.main"
                    href="https://cdn.jsdelivr.net/npm/monaco-editor@0.54.0/min/vs/editor/editor.main.css"
                    />


                <Editor
                    width="100%"
                    height="100%"
                    defaultLanguage="markdown"
                    theme="vs-dark"
                    value={markdown}
                    onChange={e => {
                        //if(app && reciever) app.createRecieverWrapper().replace();
                        onValueChanged(e ?? '')
                    }}
                    
                    onMount={(editor, monaco) => { setEditor(editor); setMonaco(monaco); }}

                    
                    />
                
            </root.div>

        </>
    )

}
