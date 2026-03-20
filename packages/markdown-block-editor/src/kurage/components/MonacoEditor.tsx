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
import { ConfigurationHelper, IConfigurationStorage, ISnippet, MarkdownCore } from '@kurage/markdown-core';
import { applyFilters } from '@wordpress/hooks';
import monacoStyle from './editor.main.xcss';
import { ISettingOptions } from '../store/ISettingOptions';



export const useSnippets = (options: ISettingOptions, core: MarkdownCore) =>
{
    return useMemo(() => {
        const snippets = options.snippets;
        const customSnippets = applyFilters('markdown_block_editor_custom_snippets', [], core) as ISnippet[];
        const mergeSnippets = [...customSnippets, ...snippets];
        return mergeSnippets;
    }, [options, core]);
}

export const createAppContext = (
        configurationStorage: IConfigurationStorage,
        editor?: editorType.IStandaloneCodeEditor,
        monaco?: Monaco,
        snippets: ISnippet[] = []
    ) =>
{
    const model = editor?.getModel();

    if(editor && model && monaco)
    {

        // Monaco Editor は初期値に改行コードが含まれる場合はその改行コードが適用、
        // 無い場合はおそらくシステム依存。
        // LFにしないと、文字列数が正確にカウントできないなどいろいろ不都合なので
        model.setEOL(monaco.editor.EndOfLineSequence.LF);

        return new MonacoEditorContext(monaco, model, editor, configurationStorage, snippets);
    }
}

export const MonacoEditor = ({ initializedAppContext }: MarkdownEditorProps) =>
{
    const [monaco, setMonaco] = useState<Monaco|undefined>();
    const [editor, setEditor] = useState<editorType.IStandaloneCodeEditor|undefined>();
    const { configurationStorage, markdownCore } = useMarkdownAppContext();
    const { markdown, onMarkdownChanged: onValueChanged } = useMarkdownContext();
    const settings = useSelect(select => select(store).getSettings(), []);
    const options = useSelect(select => select(store).getSettingOptions(), []);
    const snippets = useSnippets(options, markdownCore);



    
    //const family = editor?.getOption(editorVar.EditorOption.fontFamily);
    const styles: string[] = useMemo(() => applyFilters('markdown_block_editor_editor_styles', []), []) as string[];

    useEffect(() => {
        const appContext = createAppContext(configurationStorage, editor, monaco, snippets);
        initializedAppContext(appContext);
        return () => initializedAppContext(undefined);
    }, [monaco, editor, initializedAppContext]);

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
             <root.div className="monaco-shadow-dom">
                
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




