import { useMemo, useEffect, memo } from "@wordpress/element";
import { TokenEditorProps } from "./inspector-hooks";
import { useMarkdownTokenContext } from "../context/markdown-token-context";
import { useState } from "react";
import * as React from "react";
import { parseSaveMarkdown } from "./parser";
import { useThemes } from "./hooks";
import { useMarkdownAppContext } from "../context";
import { Utils } from "@kurage/markdown-core";
import { createContext, useContext } from '@wordpress/element';
import { Button, RadioControl, SelectControl, TextareaControl, TextControl } from "@wordpress/components";
import { MarkdownEscapeHelper } from "@kurage/markdown-core/src/commands/MarkdownEscapeHelper";
import { __ } from "@wordpress/i18n";



interface AssistContextProps
{
    executed: () => void;
}

const Context = createContext<AssistContextProps>(null as any as AssistContextProps);
const { Provider: AssistProvider } = Context;
const useAssistContext = () => useContext<AssistContextProps>(Context);


const HeadingAssist = (props: any) =>
{
    const [text, setText] = useState('');
    const { executed } = useAssistContext();
    const { appContext } = useMarkdownAppContext();
    const createeHedding = (level: number) => '#'.repeat(level);
    const insertHedding = (level: number) =>
    {
        const headingSyntax = createeHedding(level) + ' ';
        const pos = appContext.getEditorModel().getCursor();
        if(pos)
        {
            appContext.getEditorModel().replaces([{text: headingSyntax, area: {ePos: pos, sPos: pos }}]);
            executed();
        }
    }

    return (
        <div>
            <div>
                <TextControl value={text} onChange={setText} />
            </div>
            <div>
                {[...Array(6).keys()].map(i => [i + 1, `h${i + 1}`] as [number, React.ElementType]).map(([level, H]) => (
                    <H
                        key={level}
                        className="markdown-block-editor-beginner-assist-item" 
                        onClick={() => insertHedding(level)}
                        style={{
                            display: 'block',
                            padding: '8px 12px',
                            margin: '0.5em 0',
                            backgroundColor: '#f0f6ff',
                            border: '1px solid #0066cc',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                        >
                        { createeHedding(level) + text }
                    </H>
                ))}                
            </div>
        </div>
    )
}

const ImageAssist = (props: any) =>
{
    const [isImage, setIsImage] = useState(true);
    const [alt, setAlt] = useState('');
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [text, setText] = useState('');
    const { executed } = useAssistContext();
    const { appContext } = useMarkdownAppContext();

    useEffect(() => {
        const [escapedAlt, escapedTitle, escapedUrl] = [
            MarkdownEscapeHelper.escapeKeywords(alt, ['[', ']']),
            MarkdownEscapeHelper.escapeKeywords(title, ['"', "'"]),
            MarkdownEscapeHelper.escapeKeywords(url, ['(', ')'])
        ];
        const imageSyntax = `${isImage ? '!' : ''}[${escapedAlt}](${escapedUrl}${title ? ` "${escapedTitle}"` : ''})`;
        setText(imageSyntax);
    }, [alt, title, url, isImage]);

    const onClick = () =>
    {
        const pos = appContext.getEditorModel().getCursor();
        if(pos)
        {
            appContext.getEditorModel().replaces([{text, area: {ePos: pos, sPos: pos }}]);
            executed();
        }
    }

    return (
        <div>
            <p style={{ fontFamily: 'monospace'}}>{ text }</p>
            <div style={ {padding: 10} }>
                <RadioControl
                    label="Type"
                    selected={isImage ? 'image' : 'link'}
                    options={[
                        { label: 'Image', value: 'image' },
                        { label: 'Link', value: 'link' },
                    ]}
                    onChange={(value) => setIsImage(value === 'image')}
                />
            </div>
            <TextControl label="alt" value={alt} onChange={setAlt} />
            <TextControl label="title" value={title} onChange={setTitle} />
            <TextControl label="url" value={url} onChange={setUrl} />

            <Button
                onClick={onClick}
                className="markdown-block-editor-button-vertical"
                variant="primary">追加</Button>
        </div>
    )
}


const HorizontalRuleAssist = (props: any) =>
{
    const { executed } = useAssistContext();
    const { appContext } = useMarkdownAppContext();

    const onClick = () =>
    {
        const pos = appContext.getEditorModel().getCursor();
        if(pos)
        {
            appContext.getEditorModel().replaces([{text: '---\n', area: {ePos: pos, sPos: pos }}]);
            executed();
        }
    }

    return (
        <div>
            <Button
                variant="primary"
                className="markdown-block-editor-button-vertical"
                onClick={onClick}
                >Insert Horizontal Rule</Button>
        </div>
    )
}

const ListAssist = (props: any) =>
{
    const [isNumbered, setIsNumbered] = useState(false);
    const [length, setLength] = useState<any>('3');
    const { appContext } = useMarkdownAppContext();
    const { executed } = useAssistContext();

    const onClick = () =>
    {
        const pos = appContext.getEditorModel().getCursor();
        if(pos)
        {
            const listSyntax = Array.from({ length: parseInt(length) }, (_, i) => `${isNumbered ? `${i + 1}.` : '-'} Item ${i + 1}`).join('\n') + '\n';
            appContext.getEditorModel().replaces([{text: listSyntax, area: {ePos: pos, sPos: pos }}]);
            executed();
        }
    }

    return (
        <div>
            <div>
                <RadioControl
                    label="Type"
                    selected={isNumbered ? 'numbered' : 'bulleted'}
                    options={[
                        { label: 'Bulleted List', value: 'bulleted' },
                        { label: 'Numbered List', value: 'numbered' },
                    ]}
                    onChange={(value) => setIsNumbered(value === 'numbered')}
                />
            </div>
            <SelectControl
                label="Length"
                multiple={false}
                value={length}
                options={[
                    { label: '1 item', value: '1' },
                    { label: '2 items', value: '2' },
                    { label: '3 items', value: '3' },
                    { label: '4 items', value: '4' },
                    { label: '5 items', value: '5' },
                    { label: '6 items', value: '6' },
                    { label: '7 items', value: '7' },
                    { label: '8 items', value: '8' },
                    { label: '9 items', value: '9' },
                    { label: '10 items', value: '10' },
                ]}
                onChange={setLength}
            />
            <Button
                variant="primary"
                className="markdown-block-editor-button-vertical"
                onClick={onClick}
                >Insert List</Button>
        </div>
    )
}

const TableAssist = (props: any) =>
{
    const [headers, setHeaders] = useState('');
    const [rows, setRows] = useState<any>('3');
    const { appContext } = useMarkdownAppContext();
    const { executed } = useAssistContext();

    const onClick = () =>
    {
        const pos = appContext.getEditorModel().getCursor();
        if(pos)
        {
            const headerCells = headers.split(',').map(h => h.trim());
            const headerSyntax = `| ${headerCells.join(' | ')} |\n| ${headerCells.map(() => '---').join(' | ')} |\n`;
            const rowSyntax = Array.from({ length: parseInt(rows) }, () => `| ${headerCells.map(() => '   ').join(' | ')} |\n`).join('');
            const tableSyntax = headerSyntax + rowSyntax;
            appContext.getEditorModel().replaces([{text: tableSyntax, area: {ePos: pos, sPos: pos }}]);
            executed();
        }
    }

    return (
        <div>
            <TextControl
                label="Headers (comma separated)"
                value={headers}
                onChange={setHeaders}
            />

            <SelectControl
                label="Rows"
                multiple={false}
                value={rows}
                options={[
                    { label: '1 row', value: '1' },
                    { label: '2 rows', value: '2' },
                    { label: '3 rows', value: '3' },
                    { label: '4 rows', value: '4' },
                    { label: '5 rows', value: '5' },
                    { label: '6 rows', value: '6' },
                    { label: '7 rows', value: '7' },
                    { label: '8 rows', value: '8' },
                    { label: '9 rows', value: '9' },
                    { label: '10 rows', value: '10' },
                ]}
                onChange={setRows}
            />
            <Button
                variant="primary"
                className="markdown-block-editor-button-vertical"
                onClick={onClick}
                >Insert Table</Button>
        </div>
    )
}

const BlockquotesAssist = (props: any) =>
{
    const [text, setText] = useState('');
    const { appContext } = useMarkdownAppContext();
    const { executed } = useAssistContext();

    const onClick = () =>
    {
        const pos = appContext.getEditorModel().getCursor();
        if(pos)
        {
            const blockquoteSyntax = text.split('\n').map(line => `> ${line}`).join('\n') + '\n';
            appContext.getEditorModel().replaces([{text: blockquoteSyntax, area: {ePos: pos, sPos: pos }}]);
            executed();
        }
    }
    
    return (
        <div>
            <TextareaControl
                label="Blockquote Text"
                rows={6}
                value={text}
                onChange={setText}
            />

            <Button
                variant="primary"
                className="markdown-block-editor-button-vertical"
                onClick={onClick}
                >Insert Blockquote</Button>
        </div>
    )
}

const DecorateAssist = (props: any) =>
{
    const [text, setText] = useState('');
    const { appContext } = useMarkdownAppContext();
    const { executed } = useAssistContext();

    const items = [
        { label: 'Bold', value: 'bold', syntax: '**' },
        { label: 'Italic', value: 'italic', syntax: '*' },
        { label: 'Strikethrough', value: 'strikethrough', syntax: '~~' },
    ]

    const onClick = (item: any) =>
    {
        const pos = appContext.getEditorModel().getCursor();
        if(pos)
        {
            const decoratedSyntax = `${item.syntax}${text}${item.syntax}\n`;
            appContext.getEditorModel().replaces([{text: decoratedSyntax, area: {ePos: pos, sPos: pos }}]);
            executed();
        }
    }
    
    return (
        <div>
            <TextControl
                label="Text to Decorate"
                value={text}
                onChange={setText}
            />

            <table width="100%" style={{ marginTop: '10px', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <td>Insert</td>
                        <td>Syntax</td>
                        <td>Preview</td>
                    </tr>
                </thead>
                <tbody>
                    { items.map(item => (
                        <tr key={item.value}>
                            <td>
                                <Button
                                    variant="primary"
                                    className="markdown-block-editor-button-vertical"
                                    onClick={() => onClick(item)}
                                    >{ item.label }</Button>
                            </td>
                            <td><code>{ `${item.syntax}Text${item.syntax}` }</code></td>
                            <td style={{ maxWidth: '200px', overflow: 'hidden' }}>
                                <span style={{
                                    fontWeight: item.value === 'bold' ? 'bold' : 'normal',
                                    fontStyle: item.value === 'italic' ? 'italic' : 'normal',
                                    textDecoration: item.value === 'strikethrough' ? 'line-through' : 'none'
                                }}>{ text || 'Text' }</span>
                            </td>
                        </tr>
                    )) }
                </tbody>
            </table>


        </div>
    )
}






interface TabItem
{
    name: string;
    title: string;
    description: JSX.Element;
    exampleCode: string;
    component: (props: any) =>JSX.Element;
}

const tabItems: TabItem[] = [
    {
        name: 'heading',
        title: 'Heading',
        description: <span>Create a heading</span>,
        exampleCode: `
# Xxx xxx

xxxxx xxx

## Yyy yyy

yyyy yyy

### Zzz zzz

zzzz zzz
`.trim(),
        component: () => <HeadingAssist />
    },
    {
        name: 'link',
        title: 'Link or Image',
        description: <span>{ __('Insert a link or image', 'markdown-block-editor') }</span>,
        exampleCode: `![Alt text](https://example.com/image.jpg)`,
        component: () => <ImageAssist />
    },
    {
        name: 'hr',
        title: 'Horizontal Rule',
        description: <span>{ __('Add a horizontal rule', 'markdown-block-editor') }</span>,
        exampleCode: `---`,
        component: () => <HorizontalRuleAssist />
    },
    {
        name: 'list',
        title: 'List',
        description: <span>{ __('Create a list', 'markdown-block-editor') }</span>,
        exampleCode: `- Item 1\n- Item 2\n- Item 3`,
        component: () => <ListAssist />
    },
    {
        name: 'table',
        title: 'Table',
        description: <span>{ __('Create a table', 'markdown-block-editor') }</span>,
        exampleCode: `| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |`,
        component: () => <TableAssist />
    },
    {
        name: 'blockquotes',
        title: '引用',
        description: <span>{ __('Add a blockquote', 'markdown-block-editor') }</span>,
        exampleCode: `> This is a quote`,
        component: () => <BlockquotesAssist />
    },
    {
        name: 'decorate',
        title: 'Decorate',
        description: <span>{ __('Decorate text with bold or italic', 'markdown-block-editor') }</span>,
        exampleCode: `**Bold Text**\n\n*Italic Text*`,
        component: () => <DecorateAssist />
    },
    // -----------------------------------------------
    // { name: 'details', title: 'Details', component: () => <div>details</div> },
]

const TabPanel = ({ onTabChange, activeTabName, tabItems }: { onTabChange: (tabName: string) => void; activeTabName: string; tabItems: TabItem[] }) =>
{
    return (
        <div>
            { tabItems.map(tab => (
                <div key={tab.name} className={`markdown-block-editor-beginner-assist-tab-item ${activeTabName === tab.name ? 'active' : ''}`} onClick={() => onTabChange(tab.name)} style={{
                    padding: '12px',
                    cursor: 'pointer',
                    borderLeft: activeTabName === tab.name ? '4px solid #0066cc' : '4px solid transparent',
                    backgroundColor: activeTabName === tab.name ? '#f0f6ff' : 'transparent',
                    transition: 'all 0.2s ease'
                }}>
                    <h4 style={{ margin: '0', color: activeTabName === tab.name ? '#0066cc' : '#333' }}>{ tab.title }</h4>
                </div>
            )) }
        </div>
    )
}



export const BeginnerAssist = ({ close }: { close: () => void }) =>
{
    const { onEdits, getSingleText } = useMarkdownTokenContext();
    const text = getSingleText() || '';
    const [tabName, setTabName] = useState<string>('heading');

    const activeTab = useMemo(() => tabItems.find(t => t.name === tabName), [tabName]);

    const ctx: AssistContextProps =
    {
        executed: () => { close() }
    }

    return (
        <div style={{ display: 'flex', height: '50vh' }}>
            <div style={{ width: '200px', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
                <TabPanel onTabChange={setTabName} activeTabName={tabName} tabItems={tabItems} />
            </div>
            <div style={{ width: '30vw', overflowY: 'auto' }}>
                <AssistProvider value={ctx}>
                    { activeTab && <AssistPanel tabItem={activeTab} />}
                </AssistProvider>
            </div>
        </div>
    )
}

const AssistPanel = memo(({tabItem}: {tabItem: TabItem}) =>
{
    const [showHelp, setShowHelp] = useState(false);
    const ActiveComponent = tabItem.component;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: '0 0 auto', minHeight: '100px', maxHeight: '200px', overflowY: 'auto' }}>
            <AssistDescription tabItem={tabItem} showHelp={showHelp} changeShowHelp={setShowHelp} />
            </div>
            <div style={{ flex: '1 1 0', overflowY: 'auto', position: 'relative' }}>
            <div style={{ padding: 10 }}>
                <ActiveComponent />
            </div>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                zIndex: 10,
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                overflowY: 'auto',
                display: showHelp ? 'block' : 'none',
                pointerEvents: showHelp ? 'auto' : 'none'
            }}>
                <HelpView tabItem={tabItem} />
            </div>
            </div>
        </div>
    )
});

const AssistDescription = ({tabItem, showHelp, changeShowHelp}: {tabItem: TabItem, showHelp: boolean, changeShowHelp: (show: boolean) => void}) =>
{
    return (
        <div>
            <div style={{ flex: '0 0 20%', overflow: 'auto', borderBottom: '1px solid #ccc', padding: '10px' }}>
            <p>{tabItem.description}</p>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
            <span>{tabItem.title}</span>
            </div>
            <div style={{ textAlign: 'right', minWidth: '60px' }}>
            <button
            onClick={() => changeShowHelp(!showHelp)}
            style={{
            padding: '6px 12px',
            cursor: 'pointer',
            backgroundColor: 'transparent',
            border: 'none',
            position: 'relative',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            outline: 'none',
            transition: 'transform 0.3s ease'
            }}>
            {showHelp ? (
              <span style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '24px',
            color: '#0066cc',
            width: '20px',
            height: '20px'
              }}>
            <span style={{ position: 'absolute', width: '100%', height: '2px', backgroundColor: '#0066cc', top: '50%', left: 0, transform: 'rotate(45deg)' }}></span>
            <span style={{ position: 'absolute', width: '100%', height: '2px', backgroundColor: '#0066cc', top: '50%', left: 0, transform: 'rotate(-45deg)' }}></span>
              </span>
            ) : (
              <span style={{
            textAlign: 'center',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '20px',
            color: '#0066cc'
              }}>?</span>
            )}
            </button>
            </div>
            </div>
            </div>
        </div>
    )
}

const HelpView = memo(({tabItem}: {tabItem: TabItem}) =>
{
    const { prismPath, frontPath } = useThemes();
    const html = parseSaveMarkdown(tabItem.exampleCode);

    const codeRef = React.useRef<HTMLIFrameElement>(null);
    const previewRef = React.useRef<HTMLIFrameElement>(null);

    const getDocuments = () =>
    {
        const codeDoc = codeRef.current?.contentDocument;
        const previewDoc = previewRef.current?.contentDocument;
        return { code: codeDoc, preview: previewDoc };
    }
    
    
    useEffect(() => {
        const { code } = getDocuments();

        if(code)
        {
            code.body.style.margin = '0';
            code.body.style.overflow = 'hidden';
            if(prismPath)
            {
                const link = code.createElement('link');
                link.rel = 'stylesheet';
                link.href = `${prismPath}.css`;
                code.head.innerHTML = '';
                code.head.appendChild(link);

                // @ts-ignore
                window?.Prism?.highlightAllUnder(code);
            }
        }

    }, [codeRef.current, prismPath]);

    useEffect(() => {
        const { preview } = getDocuments();

        if(preview)
        {
            preview.body.style.margin = '8px';
            if(frontPath)
            {
                const link = preview.createElement('link');
                link.rel = 'stylesheet';
                link.href = frontPath;
                preview.head.innerHTML = '';
                preview.head.appendChild(link);
            }
        }

    }, [frontPath, previewRef.current]);

    useEffect(() => {
        const { code, preview } = getDocuments();
        
        if(code)
        {
            code.body.innerHTML = `<pre style="margin: 0; height: calc(100% - 20px); padding: 10px; border-width: 0;"><code class="language-markdown">${tabItem.exampleCode}</code></pre>`;
            // @ts-ignore
            window?.Prism?.highlightAllUnder(code);
        }
        if(preview)
        {
            preview.body.innerHTML = `<div class="markdown-content-style">${html}</div>`;
        }

    }, [tabItem.exampleCode, html ])


    return (
        <div style={{ height: '100%', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '0px' }}>
            <iframe ref={codeRef} style={{ width: '100%', height: '50%' }}></iframe>
            <iframe ref={previewRef} style={{ width: '100%', height: '50%' }}></iframe>
        </div>
    )
});