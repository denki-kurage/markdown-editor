import { Button, SelectControl } from "@wordpress/components"
import { sortedCodeLanguages } from "../../classes/CodeLanguages"
import { TokenEditorProps } from "../inspector-hooks"
import { useState } from "@wordpress/element"
import { IToken, MarkdownParser } from "@kurage/markdown-core"
import { __ } from "@wordpress/i18n"


const getTable = (token?: IToken) =>
{
    let current = token;
    do
    {
        if(current?.getType() === 'table')
        {
            return current;
        }
    }
    while(current = current?.getParent()!);
}
export const TableTokenEditor = ({ token, contexts }: TokenEditorProps) =>
{
    const { tokenContext, appContext } = contexts;
    const { onEdits } = tokenContext;

    const formatTable = () =>
    {
        const table = getTable(tokenContext.singleToken);
        if(table)
        {
            const { start, end } = table.getPosition();
            const tableText = appContext.appContext.getEditorModel().getText(undefined).substring(start, end);
            const fmt = MarkdownParser.formatTable(tableText, contexts.appContext.appContext.getStringCounter());
            if(fmt)
            {
                onEdits([[fmt, start, end]]);
            }
        }
    }

    return (
        <>
            <Button onClick={formatTable} variant="primary">{__('format table', 'markdown-block-editor')}</Button>
        </>
    )
}


const headingItems = [...Array(6).keys()].map(v => v + 1).map(v => ({ value: '#'.repeat(v), label: `${'#'.repeat(v)} ${v}` }))
export const HeadingTokenEditor = ({ token, contexts }: TokenEditorProps) =>
{
    const { tokenContext, appContext } = contexts;
    const { onEdits } = tokenContext;
    const text = tokenContext.getSingleText() || '';
    const [, head, headText] = text.match(/^(#+)(.*)/) ?? [, '', '']
    const { start, end } = token.getPosition();

    const changed = (e: string) =>
    {
        onEdits([[`${e}${headText}`, start, end]])
    }

    return (
        <>
            <SelectControl
                label={__('Heading Level', 'markdown-block-editor')}
                options={headingItems}
                value={head}
                onChange={changed} />
        </>
    )
}


export const CodeEditor = ({ token, contexts }: TokenEditorProps) =>
{
    const { tokenContext, appContext } = contexts;
    const { markdownCore } = appContext;
    const { onEdits } = tokenContext;
    const text = tokenContext.getSingleText() || '';
    const [lang, setLang] = useState(/^\s*\`\`\`(\S*)/.exec(text)?.[1] || '');
    const { start, end } = token.getPosition();
    const languages = sortedCodeLanguages(markdownCore.getConfigurationHelper().getRecentCodeLanguages());
    
    const updateRecentCodeLanguage = (lang: string) =>
    {
        markdownCore.getConfigurationHelper().updateRecentCodeLanguage(lang);
    }

    return (
        <div>
            <SelectControl
                label="Language"
                value={lang}
                options={[
                    { label: 'Auto', value: '' },
                    ...languages.map(l => ({ label: `${l.name} (${l.label})`, value: l.name }))
                ]}
                onChange={(value) => {
                    setLang(value);
                    updateRecentCodeLanguage(value);
                    const lines = text.split('\n');
                    if(lines.length > 0)
                    {
                        lines[0] = '```' + value;
                        const newText = lines.join('\n');
                        onEdits([[newText, start, end]]);
                    }
                }}
                />
        </div>
    )
}

