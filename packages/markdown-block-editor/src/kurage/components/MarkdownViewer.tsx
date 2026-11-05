import { useCallback, useEffect, useMemo, useRef } from "@wordpress/element";
import { useMarkdownTokenContext } from "../markdown-react-editor/context/markdown-token-context";
import { parseEditMarkdown } from "../markdown-react-editor/parser";
import { IToken } from "@kurage/markdown-core";
import { applyFilters, doAction } from "@wordpress/hooks";
import { DefaultLoading } from "../markdown-react-editor/components/Loading";
import { useThemes } from "../markdown-react-editor/hooks";
import { useMarkdownEditorStateContext } from "../markdown-react-editor/context/markdown-editor-state-context";

const getDoms = (iframe: HTMLIFrameElement|undefined|null) =>
{
    const win = iframe?.contentWindow;
    const doc = (iframe?.contentDocument ?? iframe?.contentWindow?.document);
    return { iframe, win, doc };
}

const createCssLinkElement = (href: string) =>
{
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = href;
    return link;
}

const createJsScriptElement = (src: string) =>
{
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    return script;
}

export const MarkdownViewer = ({markdown, setWindow}: { markdown: string, setWindow: (win: Window) => void }) =>
{
    const { isEditing } = useMarkdownEditorStateContext();
    const tokenContext = useMarkdownTokenContext();
    const { singleToken } = tokenContext;
    const { prismPath, adminPath } = useThemes();

    const frameRef = useRef<HTMLIFrameElement>(null);


    const renderHtml = useCallback((markdown: string, iframe?: HTMLIFrameElement) => {
        const parsedCode = parseEditMarkdown(markdown, true);
        const html = `<div class="markdown-content-style">${parsedCode}</div>`;
        const { doc } = getDoms(iframe);

        if(doc)
        {
            doc.body.innerHTML = html;
            
            // @ts-ignore
            window.Prism?.highlightAllUnder(doc);

            doAction('markdown_block_editor_dom_changed', doc, markdown, () => tokenContext);
        }
    
    }, [tokenContext]);

    const reloadHead = useCallback((iframe?: HTMLIFrameElement) => {
        const { doc } = getDoms(iframe);
        if(doc)
        {

            if(prismPath || adminPath)
            {
                doc.head.innerHTML = '';
            }

            if(prismPath)
            {
                //const theme = createCssLinkElement(`${themeUrl}/style.css`);
                //doc.head.appendChild(theme);

                const link = createCssLinkElement(`${prismPath}.css`);
                doc.head.appendChild(link);

                const script = createJsScriptElement(`${prismPath}.js`);

                script.onload = () =>
                {
                    // @ts-ignore
                    window.Prism.highlightAllUnder(doc);
                }
                window.document.head.appendChild(script);
            }

            if(adminPath)
            {
                const link = createCssLinkElement(adminPath);
                doc.head.appendChild(link);
            }
            

            doAction('markdown_block_editor_header_initalize', doc);
        }
    }, [adminPath, prismPath]);



    useEffect(() => {
        if(!isEditing)
        {
            renderHtml(markdown, frameRef.current || undefined);
        }
    }, [isEditing, frameRef.current]);

    useEffect(() => {
        reloadHead(frameRef.current || undefined);
    }, [prismPath, adminPath]);

    useEffect(() => {
        const { win } = getDoms(frameRef.current);
        if(win)
        {
            setWindow(win);
        }
    }, [frameRef.current]);



    // 選択トークンの位置までスクロールとハイライト
    useEffect(() => {
        if(singleToken && frameRef.current)
        {
            const { doc } = getDoms(frameRef.current);
            const execute = applyFilters(
                'markdown_block_editor_single_token_changed',
                (token: IToken, doc: Document) => () => {}
            ) as any;

            const dispose = execute(singleToken, doc);

            return () => dispose();            
        }
    }, [singleToken]);

    
    return (
        <div>
            <iframe className='width-panel' ref={frameRef}></iframe>
            <DefaultLoading isLoading={isEditing} />
        </div>
    )
}

