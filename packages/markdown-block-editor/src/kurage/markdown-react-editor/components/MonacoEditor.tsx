import { Editor, Monaco, loader } from '@monaco-editor/react';
import root from 'react-shadow';

import { IConfigurationStorage, ISnippet } from '@kurage/markdown-core';
import monacoStyle from './editor.main.xcss';
import { useEffect, useMemo, useState } from 'react';
import { ISettingOptions } from '../ISettingOptions';
import { MonacoEditorContext } from '../MonacoEditorContext';
import { MarkdownEditorComponentProps } from './EditorType';
import { useMarkdownCoreContext, useMarkdownEditorAttributeContext } from '../context';

//import type { editor as editorType } from "monaco-editor/esm/vs/editor/editor.api.d.js";
type IStandaloneCodeEditor = Parameters<NonNullable<React.ComponentProps<typeof Editor>['onMount']>>[0];

// @ts-ignore
const localVs = window.MarkdownBlockEditor?.monacoUrl;

loader.config({
    paths: {
        vs: localVs
    }
})


export const useSnippets = (options: ISettingOptions, defaultSnippets: ISnippet[], useSnippets: boolean = true) =>
{
    return useMemo(() => {
        if(!useSnippets) return [];
        const snippets = options.snippets;
        const customSnippets = defaultSnippets;
        const mergeSnippets = [...customSnippets, ...snippets];
        return mergeSnippets;
    }, [options, useSnippets]);
}

export const createAppContext = (
        configurationStorage: IConfigurationStorage,
        editor?: IStandaloneCodeEditor,
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

export const MonacoEditor = ({ initializedAppContext, snippets: defaultSnippets, editorStyles }: MarkdownEditorComponentProps) =>
{
    const [monaco, setMonaco] = useState<Monaco|undefined>();
    const [editor, setEditor] = useState<IStandaloneCodeEditor|undefined>();
    const { configurationStorage } = useMarkdownCoreContext();
    
    const { markdown, onMarkdownChanged: onValueChanged } = useMarkdownEditorAttributeContext();
    const { settings, settingOptions: options } = useMarkdownCoreContext();
    const snippets = useSnippets(options, defaultSnippets ?? [], settings.useSnippets);


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
                    (editorStyles ?? []).map(style => <style>{ style }</style>)
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




