import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Button, PanelBody, SelectControl } from "@wordpress/components";

import { IToken } from "@mde/markdown-core";
import './token-viewer.scss';
import { useMarkdownTokenContext } from "../../markdown-block-editor/src/kurage/context/markdown-token-context";



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

const Context = createContext(null as any)

export const TokenExplorer = React.memo(({ contexts }: any) =>
{
    const { tokenContext } = contexts;
    const { rootToken, singleToken } = tokenContext;
    const [tokenTypes, setTokenTypes] = useState<string[]>([]);
    const ancestors = useAncestors(singleToken);


    const filteredToken = tokenFilter(rootToken, token => {
        const type = token.getType();
        return (!tokenTypes.length || tokenTypes[0] === '') ? true : tokenTypes.includes(type);
    });

    const r = filteredToken ? [filteredToken] : []

    return (
        <Context.Provider value={contexts}>
            <PanelBody title="Token Explorer">
                <TokenFilter tokenTypes={tokenTypes} tokenTypesChanged={setTokenTypes} />
                
                <div className="token-viewer">
                    <TokenTree tokens={r} depsTokens={ancestors} />
                </div>

                { singleToken && <TokenDeps depsTokens={ancestors} /> }
            </PanelBody>
        </Context.Provider>
    );
});
export default TokenExplorer;

const TokenSelectButton = React.memo(({ token }: { token: IToken }) =>
{
    const { tokenContext } = useContext(Context);
    const { setSelectionsAndToken } = tokenContext;

    const selectText = useCallback(() =>
    {
        const pos = token.getPosition();
        setSelectionsAndToken?.([[pos.start, pos.end]], token);
    }, [token, setSelectionsAndToken]);


    return (
        <Button
            variant="link"
            onClick={selectText}>
                {token.getType()}({token.getPosition().start}, {token.getPosition().end})
        </Button>
    )

})
const TokenDeps = ({ depsTokens }: { depsTokens: IToken[] }) =>
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

const TokenTree = React.memo(({ tokens, depsTokens }: { tokens: TokenSet[], depsTokens: IToken[] }) =>
{
    return (
        <ul>
        {
            tokens.map((token, i) => <TokenView tokenSet={token} key={i} depsTokens={depsTokens} />)
        }
        </ul>
    )
})

const TokenView = React.memo(({ tokenSet, depsTokens }: { tokenSet: TokenSet, depsTokens: IToken[] }) =>
{
    const { token, children } = tokenSet;
    const targetRef = useRef<HTMLDivElement>(null);
    const { tokenContext } = useContext(Context);
    const { singleToken } = tokenContext;
    const isCurrent = singleToken === token;
    const isAncestors = depsTokens.includes(token);


    console.log("--- Token View ---")

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
});











