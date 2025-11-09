import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Button, CheckboxControl, SelectControl } from "@wordpress/components";

import { IToken } from "@mde/markdown-core";
import './token-viewer.scss';
import { getAncestors, tokenFilter, TokenSet } from "./token-explorer-hooks";
import { useExtensionContext } from "../../markdown-block-editor/src/kurage/context/markdown-extension-context";
import { ExtensionContext } from "../../markdown-block-editor/src/kurage/components/token-inspectors";



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
    ['text', 'テキスト'],
    ['emphasis', 'イタリック'],
    ['strong', '太字'],
    ['break', '改行'],
    ['list', 'リスト'],
    ['listItem', 'リストアイテム'],
    ['blockquote', '引用'],
    ['code', 'コード'],
    ['inlineCode', 'インラインコード'],
    ['link', 'リンク'],
    ['image', '画像'],
    ['thematicBreak', '水平線'],
    ['html', 'HTML']
])

const TokenTypeOptions = [...TokenTypes.entries()].map(t => {
    const [value, label] = t;
    return ({ label, value })
})


const Context = createContext<ExtensionContext>(null as any);
const useLocalCotnext = () => useContext(Context);


const TokenFilter = ({ tokenTypes, tokenTypesChanged }: any) =>
{
    // 後で変更
    const { editorContext } = useLocalCotnext();
    const { editorState, setEditorState } = editorContext;
    const { enabledSelectionsFilter } = editorState;

    const updateState = (f: boolean) =>
    {
        setEditorState({ enabledSelectionsFilter: f })
    }

    return (
        <>
            <SelectControl
                multiple
                label="Token Types"
                options={TokenTypeOptions}
                value={tokenTypes}
                onChange={tokenTypesChanged}
                />
            
            <CheckboxControl
                checked={enabledSelectionsFilter}
                onChange={updateState}
                label="選択フィルターを有効にする"
                />
        </>
    )
}


const filter = (rootToken: IToken, tokenTypes: string[], selections: [number, number][], useSelections: boolean = false) =>
{
    const hasTypes = tokenTypes.length && !tokenTypes.includes('');

    const newSelections = selections
        // .filter(([s, e]) => s !== e)
        .map(([s, e]) => [Math.min(s, e), Math.max(s, e)]);

    const filteredToken = tokenFilter(rootToken, token => {
        const type = token.getType();
        
        // トークンタイプによるフィルタリング
        if(hasTypes)
        {
            if(!tokenTypes.includes(type))
            {
                return false;
            }
        }

        // セレクションによるフィルタリング(TODO: 単一セレクトの場合を想定すること)
        if(useSelections && !!newSelections?.length)
        {
            const { start, end } = token.getPosition();

            //if(!newSelections.some(([b, e]) => (b <= start && end <= e)))
            if(!newSelections.some(([b, e]) => (b <= start && end <= e)))
            {
                return false;
            }
        }




        return true;
    });

    
    return filteredToken;
}



export const TokenExplorer = React.memo(({ contexts, extensionData }: { contexts: ExtensionContext, extensionData: any }) =>
{
    const { tokenContext, editorContext } = contexts;
    const { rootToken, singleToken, selections } = tokenContext;
    const [tokenTypes, setTokenTypes] = useState<string[]>([]);
    const ancestors = useMemo(() => getAncestors(singleToken), [singleToken]);



    const filteredToken = filter(rootToken, tokenTypes, selections ?? [], editorContext.editorState.enabledSelectionsFilter);
    const r = filteredToken ? [filteredToken] : []

    return (
        <Context.Provider value={contexts}>
            <TokenFilter tokenTypes={tokenTypes} tokenTypesChanged={setTokenTypes} />
            
            <div className="token-viewer">
                <TokenTree tokens={r} depsTokens={ancestors} />
            </div>

            { singleToken && <TokenDeps depsTokens={ancestors} /> }
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











