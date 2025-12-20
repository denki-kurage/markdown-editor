import { useCallback, useEffect, useMemo, useRef } from "react";
import { useMarkdownTokenContext } from "../context/markdown-token-context";
import { parseEditMarkdown } from "./parser";
import { IToken } from "@mde/markdown-core";
import { applyFilters, doAction } from "@wordpress/hooks";
import { Loading } from "./Loading";
import { useMarkdownEditorContext } from "../context/markdown-editor-context";
import { useMarkdownAppContext } from "../context/markdown-app-context";

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
    const { settings, settingOptions } = useMarkdownAppContext();
    const { isEditing } = useMarkdownEditorContext();
    const tokenContext = useMarkdownTokenContext();
    const { singleToken } = tokenContext;
    const { adminTheme, prismTheme } = settings;
    const { themeUrl } = settingOptions;

    const frameRef = useRef<HTMLIFrameElement>(null);

    const prismMap = useMemo(() => new Map(settingOptions.prismThemes.map(p => [p.key, p.url])), [settingOptions]);
    const adminMap = useMemo(() => new Map(settingOptions.adminThemes.map(p => [p.key, p.url])), [settingOptions]);

    const renderHtml = useCallback((markdown: string, iframe?: HTMLIFrameElement) => {
        const parsedCode = parseEditMarkdown(markdown, true);
        const html = `<div class="markdown-content-style">${parsedCode}</div>`;
        const { doc } = getDoms(iframe);

        if(doc)
        {
            doc.body.innerHTML = html;
            
            // @ts-ignore
            window.Prism?.highlightAllUnder(doc);

            doAction('extensionDomChanged', doc, markdown, () => tokenContext);
        }
    
    }, [tokenContext]);

    const reloadHead = useCallback((iframe?: HTMLIFrameElement) => {
        const { doc } = getDoms(iframe);
        if(doc)
        {
            const prismPath = prismMap.get(prismTheme);
            const adminPath = adminMap.get(adminTheme);

            if(prismPath || adminPath)
            {
                console.log("####################### Head Reloading #########################");
                doc.head.innerHTML = '';
            }

            if(prismPath)
            {
                //const theme = createCssLinkElement(`${themeUrl}/style.css`);
                //doc.head.appendChild(theme);

                const link = createCssLinkElement(`${prismPath}.css`);
                doc.head.appendChild(link);

                const script = createJsScriptElement(`${prismPath}.js`);

                console.log("####################### Prism Loading #########################");
                script.onload = () =>
                {
                    console.log("####################### @@ Prism Loaded #########################");
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
            

            doAction('extensionHeaderInitalize', doc);
        }
    }, [adminTheme, prismTheme, prismMap, adminMap]);



    useEffect(() => {
        if(!isEditing)
        {
            renderHtml(markdown, frameRef.current || undefined);
        }
    }, [isEditing, frameRef.current]);

    useEffect(() => {
        reloadHead(frameRef.current || undefined);
    }, [adminTheme, prismTheme]);

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
                'extensionSingleTokenChanged',
                (token: IToken, doc: Document) => () => {}
            ) as any;

            const dispose = execute(singleToken, doc);

            return () => dispose();            
        }
    }, [singleToken]);


    useEffect(() => console.log("★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★"), [])


    
    return (
        <div>
            <iframe className='width-panel' ref={frameRef}></iframe>
            <Loading isLoading={isEditing} />
        </div>
    )
}

