import { Marked, TokensList } from "marked";
import { createContext, createRef, MutableRefObject, useContext, useEffect, useMemo, useRef, useState } from "react";
import { addTokenPositions } from "marked-token-position";
import { Button, TextControl } from "@wordpress/components";

import './token-viewer.scss';
import { MarkdownEditorSynchronizer } from "./parser/MarkdownEditorSynchronizer";
import { IToken } from "./parser/IToken";
import { useMarkdownTokenContext } from "../context/markdown-token-context";

const c = `
# Hello World

- aaa
- bbb

## Next

- xxx
- yyy
- zzz

## code

\`\`\`ts
console.log("Hello World")
\`\`\`

this is my code.


[ ] www
[*] vvv

this is my code.


- [ ] www
[x]vvv


> ooooooooo

    ffff

---

![](www)

aaa **bbb** ccc *ddd* eee



`;


const getEditorTypes = () =>
{
    return ['heding', 'list', 'listItem', 'paragraph']
}

const getTargetToken = (tokens: IToken[]) =>
{
    const rev = [...tokens].reverse()
    const types = getEditorTypes();

    for(const current of rev)
    {
        if(types.includes(current.getType()))
        {
            return current;
        }
    }

    return rev[0];
}


const getSelectedTokens = (token: IToken, index: number) =>
{
    let current: IToken | undefined;
    let matches: IToken[] = [];

    const stack = [token];
    
    while(current = stack.shift())
    {
        const p = current.getPosition();
        const f = p.start <= index && p.end >= index;
        const c = current.getChildren();

        // 真になれば子以外のノードを除外。
        if(f)
        {
            matches.push(current);
            stack.splice(0);
        }

        stack.unshift(...c);
    }

    return matches;
}

const filteredTokenTree = (root: IToken) =>
{
    
} 


type TokenExplorerProps =
{
    markdown: string;
    index: number;
}

export const TokenExplorer = ({ markdown, index }: TokenExplorerProps) =>
{
    const { selections, setSelections } = useMarkdownTokenContext();
    const rootToken = useMemo(() => (new MarkdownEditorSynchronizer()).parseTokenTree(markdown), [markdown]);
    
    useEffect(() => {
        const currentTokens = getSelectedTokens(rootToken, index);
        const editableToken = getTargetToken(currentTokens);
    }, [markdown, index, rootToken])

    return (

        <div className="token-viewer">
            <TokenTree tokens={[rootToken]} />
        </div>

    );
}
export default TokenExplorer;




const TokenTree = ({ tokens }) =>
{
    return (
        <ul>
        {
            tokens.map((token, i) => <TokenView token={token} key={i} />)
        }
        </ul>
    )
}

const hasAncestors = (token: IToken, ancestor: IToken | undefined) =>
{
    let p: IToken|undefined = token;

    while(p = p.getParent())
    {
        if(p === ancestor)
        {
            return true;
        }
    }

    return false;
}

const TokenView = ({ token }: { token: IToken }) =>
{
    const children = token.getChildren();
    const { onSelectedToken, currentToken } = useMarkdownTokenContext();
    const [isCurrent, isAncestors] = useMemo(() => {
        return [currentToken === token, currentToken && hasAncestors(currentToken, token)]
    }, [currentToken, token]);
    const targetRef = useRef<HTMLDivElement>(null);

    const selectText = () =>
    {
        onSelectedToken(token)
    }

    useEffect(() => {
        if(isCurrent)
        {
            if(targetRef.current)
            {
                targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }, [isCurrent])

    return (
        <li className={isCurrent ? 'token-explorer-current' : (isAncestors ? 'token-explorer-ancestor' : undefined)}>
            <div ref={targetRef}>
                <Button variant="link" onClick={selectText}>{token.getType()}({token.getPosition().start}, {token.getPosition().end})</Button>
            </div>
            { children?.length !== 0 && <TokenTree tokens={children} /> }
        </li>
    )
}




const countString = (str: string) =>
{
    return str.length;
}








