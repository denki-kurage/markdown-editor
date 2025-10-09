import { IDisposable, MarkdownParser } from "@mde/markdown-core";
import { MarkdownEditorSynchronizer } from "./MarkdownEditorSynchronizer";

const ps = new MarkdownParser();
const mp = new MarkdownEditorSynchronizer();

// save component
export const parseSaveMarkdown = (html: string) =>
{
    return ps.parseSaveMarkdown(html);
}

// edit component
export const parseEditMarkdown = (txt: string, breaks = false) =>
{
    return ps.parseEditMarkdown(txt);
}

export const registerMarkdownViewer = (
    document: HTMLDocument,
    documentLineNumberChanged: (lineNumber: number) => void) =>
{
    const listener = () => documentLineNumberChanged(mp.getLineNumberFromDocument(document));
    document.addEventListener('scroll', listener);
    return { dispose: () => document.removeEventListener('scroll', listener) } as IDisposable;
}

export const scrollToLineNumber = (win: Window, lineNumber: number) =>
{
    if(win)
    {
        const pos = mp.getPositionFromLineNumber(win, lineNumber);
        win.scrollTo({ top: pos, behavior: 'auto' });
    }
}

// 以降はmarkedを使っていた時のもの。
// 現在は使用していない。


