import { Marked, TokensList } from "marked";
import { createContext, createRef, MutableRefObject, useContext, useEffect, useMemo, useRef, useState } from "react";
import { addTokenPositions } from "marked-token-position";
import { Button, SelectControl, TextControl } from "@wordpress/components";

import './token-viewer.scss';
import { useMarkdownTokenContext } from "../context/markdown-token-context";
import { IToken, MarkdownParser } from "@mde/markdown-core";
import { MarkdownEditorSynchronizer } from "./MarkdownEditorSynchronizer";

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


const TokenTypes = new Map<string, string>([
    ['', '選択無し'],
    ['heading', 'ヘディング'],
    ['table', 'テーブル'],
    ['tableRow', 'テーブル行'],
    ['tableCell', 'テーブルセル'],
    ['paragraph', '段落'],
    ['text', 'テキスト']
])

const TokenTypeOptions = [...TokenTypes.entries()].map(t => {
    const [value, label] = t;
    return ({ label, value })
})

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


type TokenExplorerProps =
{
    markdown: string;
    index: number;
}

type TokenSet = { token: IToken, children: TokenSet[] }
type tokenFilterFunc = (current: IToken, predicate: (token: IToken) => boolean) => TokenSet | null;

export const tokenFilter: tokenFilterFunc = (current, predicate) =>
{
    const matched = predicate(current);
    const children = current.getChildren().map(c => tokenFilter(c, predicate)).filter(f => !!f)

    if(children.length || matched)
    {
        return { token: current, children }
    }

    return null;
}



const TokenFilter = ({ tokenTypes, tokenTypesChanged }: any) =>
{
    return (
        <>
            <SelectControl
                multiple
                label="Token Types"
                options={TokenTypeOptions}
                value={tokenTypes}
                onChange={tokenTypesChanged}
                />
        </>
    )
}

const useAncestors = (token?: IToken) =>
{
    return useMemo(() => {
        const tokens: IToken[] = [];
        let current: IToken | undefined = token;

        if(!current)
        {
            return tokens;
        }

        do
        {
            tokens.push(current);
        }
        while (current = current.getParent());

        return tokens;
    }, [token]);

}

export const TokenExplorer = ({ markdown, index }: TokenExplorerProps) =>
{
    const { rootToken } = useMarkdownTokenContext();
    const { singleToken } = useMarkdownTokenContext();
    const [tokenTypes, setTokenTypes] = useState<string[]>([]);
    const ancestors = useAncestors(singleToken);


    const filteredToken = tokenFilter(rootToken, token => {
        const type = token.getType();
        return (!tokenTypes.length || tokenTypes[0] === '') ? true : tokenTypes.includes(type);
    });

    const r = filteredToken ? [filteredToken] : []

    return (
        <>
            <TokenFilter tokenTypes={tokenTypes} tokenTypesChanged={setTokenTypes} />

            <div className="token-viewer">
                <TokenTree tokens={r} depsTokens={ancestors} />
            </div>

            { singleToken && <TokenDeps token={singleToken} depsTokens={ancestors} /> }

        </>
    );
}
export default TokenExplorer;

const TokenSelectButton = ({ token }: { token: IToken }) =>
{
    
    const { setSelectionsAndToken: setSelections } = useMarkdownTokenContext();
    const selectText = () =>
    {
        const pos = token.getPosition();
        setSelections([[pos.start, pos.end]], token);
    }

    return (
        <Button
            variant="link"
            onClick={selectText}>
                {token.getType()}({token.getPosition().start}, {token.getPosition().end})
        </Button>
    )

}
const TokenDeps = ({ token, depsTokens }: { token: IToken, depsTokens: IToken[] }) =>
{
    
    return (
        <ul className="token-deps">
        {
            [...depsTokens].reverse().map((t, i) => (
                <li key={i} className={`left-${i}`}>
                    <TokenSelectButton token={t} />
                </li>
            ))
        }
        </ul>
    )
}

const TokenTree = ({ tokens, depsTokens }: { tokens: TokenSet[], depsTokens: IToken[] }) =>
{
    return (
        <ul>
        {
            tokens.map((token, i) => <TokenView tokenSet={token} key={i} depsTokens={depsTokens} />)
        }
        </ul>
    )
}

const TokenView = ({ tokenSet, depsTokens }: { tokenSet: TokenSet, depsTokens: IToken[] }) =>
{
    const { token, children } = tokenSet;
    const targetRef = useRef<HTMLDivElement>(null);
    const { singleToken } = useMarkdownTokenContext();
    const isCurrent = singleToken === token;
    const isAncestors = depsTokens.includes(token);

    useEffect(() => {
        if(isCurrent)
        {
            if(targetRef.current)
            {
                targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }            
        }

    }, [singleToken])

    return (
        <li className={isCurrent ? 'token-explorer-current' : (isAncestors ? 'token-explorer-ancestor' : undefined)}>
            <div ref={targetRef}>
                <TokenSelectButton token={token} />
            </div>
            { children?.length !== 0 && <TokenTree tokens={children} depsTokens={depsTokens} /> }
        </li>
    )
}











