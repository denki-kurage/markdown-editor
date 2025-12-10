import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Button, CheckboxControl, Modal, SelectControl, ToggleControl } from "@wordpress/components";

import { IToken, Utils } from "@mde/markdown-core";
import { createFilter, filterTokenTreeFromBottom, flatItem, flatLeafTokenSet, getAncestorsByToken, TokenSet, TokenTypes } from "@mde/markdown-core-extensions";
import './token-viewer.scss';
import { TokenCheckerModal } from "./token-checker-modal";
import { ExtensionContexts } from "../../markdown-block-editor/src/kurage/components/hooks";





const TokenTypeOptions = [...TokenTypes.entries()].map(t => {
    const [value, labels] = t;
    const label = labels[0];
    return ({ label, value })
})


const Context = createContext<ExtensionContexts>(null as any);
const useLocalCotnext = () => useContext(Context);

type ComponentContextProps =
{
    filter: (token: IToken) => boolean;
    filteredTokenTree: TokenSet | null;
}
const ComponentContext = createContext<ComponentContextProps>(null as any);
const useComponentContext = () => useContext(ComponentContext);


const TokenFilter = ({ tokenTypes, tokenTypesChanged }: any) =>
{
    // 後で変更
    const { editorContext } = useLocalCotnext();
    const { editorState, setEditorState } = editorContext;
    const { enabledSelectionsFilter, enabledSelectionsFilterFillMode } = editorState;

    const updateState = (f: boolean) =>
    {
        setEditorState({ enabledSelectionsFilter: f })
    }

    const fillMode = (f: boolean) =>
    {
        setEditorState({ enabledSelectionsFilterFillMode: f })
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
            
            { enabledSelectionsFilter && (
                <>
                    <ToggleControl
                        checked={enabledSelectionsFilterFillMode}
                        onChange={fillMode}
                        help="選択範囲に完全に含まれるトークンのみを対象とするかどうかを切り替えます。"
                        label={(enabledSelectionsFilterFillMode ? "全部" : "部分") + "選択"} />
                </>
            )}
        </>
    )
}

const TokenChecker = () =>
{
    const { tokenContext, markdownContext } = useLocalCotnext();
    const { setSelections } = tokenContext;
    const { markdown } = markdownContext;
    const { filter, filteredTokenTree } = useComponentContext();
    const [checkerOpened, setCheckerOpened] = useState(false);
    const isActive = !!filteredTokenTree;

    const openChecker = () =>
    {
        setCheckerOpened(true);
    }

    const selectTokens = () =>
    {
        if(filteredTokenTree)
        {
            const filterdTokenSelections: [number, number][] =
                flatLeafTokenSet(filteredTokenTree)
                .map(ts => ts.token)
                .map(token => token.getPosition())
                .map(({ start, end }) => [start, end]);
            
            if(filterdTokenSelections.length)
            {
                setSelections(filterdTokenSelections)
            }
        }
    }

    const checkedTokens = (tokens: IToken[]) =>
    {
        const checkItems: [number, number][] =
            tokens
            .map(token => token.getPosition())
            .map(({ start, end }) => [start, end]);
        
        if(checkItems.length)
        {
            setSelections(checkItems);
            setCheckerOpened(false);
        }
    }

    return (
        <>
            <div>
                <Button
                    className="markdown-block-editor-button-vertical"
                    variant="primary"
                    text="範囲を選択する"
                    onClick={selectTokens}
                    />
            </div>
            
            <div>
                <Button
                    disabled={!isActive}
                    className="markdown-block-editor-button-vertical"
                    variant="primary"
                    text="Checker"
                    onClick={openChecker} />

                <p>よりトークンを絞る</p>

                { filteredTokenTree && <TokenCheckerModal
                    markdown={markdown}
                    tokenSet={filteredTokenTree}
                    isOpened={checkerOpened}
                    closed={() => setCheckerOpened(false)}
                    onCheckedTokens={checkedTokens}
                    />
                }

            </div>

        </>
    )
}




export const TokenExplorer = React.memo(({ contexts }: { contexts: ExtensionContexts }) =>
{
    const { tokenContext, editorContext } = contexts;
    const { rootToken, singleToken, selections } = tokenContext;
    const { editorState, setEditorState } = editorContext;
    const { enabledSelectionsFilter, enabledSelectionsFilterFillMode, tokenTypes } = editorState;

    const setTokenTypes = (tokenTypes: string[]) =>
    {
        setEditorState({tokenTypes});
    }
    
    const componentContext = useMemo(() => {
        
        const filter = createFilter({
            tokenTypes,
            selections: selections ?? [],
            useSelections:enabledSelectionsFilter,
            selectionAllMode: enabledSelectionsFilterFillMode
        });

        const filteredTokenTree = filterTokenTreeFromBottom(rootToken, filter);

        return { filter, filteredTokenTree }
    }, [rootToken, tokenTypes, selections, enabledSelectionsFilter, enabledSelectionsFilterFillMode])

    const { filteredTokenTree } = componentContext;
    const ancestors = useMemo(() => (singleToken && filteredTokenTree) ? getAncestorsByToken(singleToken, filteredTokenTree) : [], [singleToken, filteredTokenTree]);

    return (
        <Context.Provider value={contexts}>
            <ComponentContext.Provider value={componentContext}>
                <TokenFilter tokenTypes={tokenTypes} tokenTypesChanged={setTokenTypes} />
                
                <div className="token-viewer">
                    { filteredTokenTree && <TokenTree token={filteredTokenTree} depsTokenSets={ancestors} /> }
                </div>

                { singleToken && <TokenDeps depsTokenSets={ancestors} /> }

                <TokenChecker />
            </ComponentContext.Provider>

        </Context.Provider>
    );
});
export default TokenExplorer;

const TokenDeps = ({ depsTokenSets }: { depsTokenSets: TokenSet[] }) =>
{
    
    return (
        <ul className="token-deps">
        {
            [...depsTokenSets].reverse().map((t, i) => (
                <li key={i} className={`left-${i}`}>
                    
                </li>
            ))
        }
        </ul>
    )
}


const TokenTree = React.memo(({ token, depsTokenSets }: { token: TokenSet, depsTokenSets: TokenSet[] }) =>
{
    const tokenSets = [...flatItem(token, t => t.children)];
    const tokenList = tokenSets.map((ts, index) => <TokenView tokenSet={ts} key={index} depsTokens={depsTokenSets} />);
    return (
        <div className="token-deps">
            { tokenList }
        </div>
    )
});



const TokenView = React.memo(({ tokenSet, depsTokens }: { tokenSet: TokenSet, depsTokens: TokenSet[] }) =>
{
    const { tokenContext, markdownContext } = useContext(Context);
    const { token, children, deps } = tokenSet;
    const { markdown } = markdownContext;
    const { setSelectionsAndToken } = tokenContext;
    const isActive = !children.length;
    const { start, end } = token.getPosition();
    const txt = markdown.slice(start, end).slice(0, 20);

    const abb = TokenTypes.get(token.getType())?.[0] ?? ''
    const targetRef = useRef<HTMLDivElement>(null);
    const { singleToken } = tokenContext;
    const isCurrent = singleToken === token;
    const isAncestors = depsTokens.includes(tokenSet);

    const alt = `(${start}, ${end})`;
    const { docIndex } = Utils.indexToPosition(markdown, start);

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

    const selectText = useCallback(() =>
    {
        setSelectionsAndToken?.([[start, end]], token);
    }, [token, start, end, setSelectionsAndToken]);


    const classNames: string[] = [];
    classNames.push(isCurrent ? 'token-explorer-current' : (isAncestors ? 'token-explorer-ancestor' : ''));
    classNames.push(isActive ? 'token-leaf' : 'token-branch');
    classNames.push(`left-${Math.min(15, deps)}`);


    return (
        <div ref={targetRef} className={classNames.join(' ')} onClick={selectText}>
            <em>{abb}</em> {txt} <span>{docIndex + 1}</span>
        </div>
    )
});









