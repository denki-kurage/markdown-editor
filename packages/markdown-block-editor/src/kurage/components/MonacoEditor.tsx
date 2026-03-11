import { Editor, Monaco, } from '@monaco-editor/react';
import type { editor as editorType } from "monaco-editor/esm/vs/editor/editor.api.d.js";
import { editor as editorVar } from 'monaco-editor';

import { useEffect, useMemo, useRef, useState } from "@wordpress/element";
import root from 'react-shadow';
import { useMarkdownContext } from "../context/markdown-context";
import { useMarkdownAppContext } from '../context/markdown-app-context';
import { MarkdownEditorProps } from './editor-wrapper';
import { MonacoEditorContext } from '../classes/MonacoEditorContext';
import { useSelect } from '@wordpress/data';
import { store } from '../store';
import { IConfigurationStorage } from '@kurage/markdown-core';
import { applyFilters } from '@wordpress/hooks';
import monacoStyle from './editor.main.xcss';
import { ISettingOptions } from '../store/ISettingOptions';




export const useMarkdownApp = (
        configurationStorage: IConfigurationStorage,
        options: ISettingOptions,
        editor?: editorType.IStandaloneCodeEditor,
        monaco?: Monaco,
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

            return new MonacoEditorContext(monaco, model, editor, configurationStorage, options.snippets);
        }
    }, [editor, monaco]);
}

export const MonacoEditor = ({ initializedAppContext }: MarkdownEditorProps) =>
{
    const [monaco, setMonaco] = useState<Monaco|undefined>();
    const [editor, setEditor] = useState<editorType.IStandaloneCodeEditor|undefined>();
    const { configurationStorage } = useMarkdownAppContext();
    const { markdown, onMarkdownChanged: onValueChanged } = useMarkdownContext();
    const settings = useSelect(select => select(store).getSettings(), []);
    const options = useSelect(select => select(store).getSettingOptions(), []);

    const appContext = useMarkdownApp(configurationStorage, options, editor, monaco);
    useEffect(() => initializedAppContext(appContext), [appContext])

    
    const family = editor?.getOption(editorVar.EditorOption.fontFamily);
    const styles: string[] = useMemo(() => applyFilters('markdown_block_editor_editor_styles', []), []) as string[];


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


    return (
        <>
             <root.div className="monaco-shadow-dom2">
                
                <style>{ monacoStyle }</style>
                
                {
                    styles.map(style => <style>{ style }</style>)
                }

                
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

/**/




