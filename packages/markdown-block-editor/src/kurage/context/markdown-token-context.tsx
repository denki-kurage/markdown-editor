import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { IReplaceText, IToken, MarkdownCore, MarkdownParser, Utils } from "@kurage/markdown-core";
import { useMarkdownEditorAttributeContext } from "./markdown-editor-attribute-context";
import { useMarkdownEditorStateContext } from "./markdown-editor-state-context";
import { useMarkdownCoreContext, useMarkdownCoreSession, useMarkdownCoreSessionInternal } from "./markdown-core-context";

export type TokenStates =
{

    /**
     * エディタレベルでの選択範囲。
     */
    selections: [number, number][] | null;
    

    rootToken: IToken;

    /**
     * 単一の選択されたトークン。
     */
    singleToken?: IToken;
}


export type MarkdownTokenContextType =
{
    onEdits: (edits: [string, number, number][]) => void;

    /**
     * エディタレベルでの選択範囲。
     */
    selections: [number, number][] | null;


    rootToken: IToken;

    /**
     * 単一の選択されたトークン。
     */
    singleToken?: IToken;

    /**
     * セレクションが一つの場合、start地点をインデックスとしてtokenを設定する。
     */
    setSelectionsAndToken: (selections: [number, number][] | null, singleToken?: IToken) => void;

    /**
     * 複数の選択の場合
     */
    setSelections: (selections: [number, number][]) => void;

    getSingleText: () => string | undefined;

}


const Context = createContext<MarkdownTokenContextType>({} as any);
export const { Provider: MarkdownTokenContextProvider } = Context;
export const useMarkdownTokenContext = () => useContext(Context);

const findTokenByIndex = (token: IToken, index: number): IToken | undefined =>
{
    const { start, end } = token.getPosition();

    // 子孫を優先して探索, 逆順で探索することで、同じ位置にある場合に後ろのものを優先する
    for (const child of [...token.getChildren()].reverse())
    {
        const found = findTokenByIndex(child, index);

        if (found)
        {
            return found;
        }
    }

    // 子孫にヒットしなかった場合は自分自身を返す
    if (start <= index && end >= index)
    {
        return token;
    }

    return undefined;
}


const execSelections = (selections: [number, number][], markdown: string, markdownCore: MarkdownCore | undefined) =>
{
    if(markdownCore === undefined)
    {
        return;
    }

    const s = selections.map(sl => Utils.IndexToSelection(markdown, ...sl))
    const cmd = markdownCore.createCommandCollection().getCommand('markdown:select');
    cmd?.command?.execute({ selections: s });
}

const selectionsAndTokenAction = (
    markdownCore: MarkdownCore | undefined,
    markdown: string,
    rootToken: IToken,
    selections: [number, number][] | null,
    singleToken?: IToken) => {

    let newSelections: [number, number][] = [];
    let newSingleToken: IToken|undefined;

    if(markdownCore === undefined)
    {
        return { newSelections, newSingleToken };
    }

    // イベントから拾ったセレクションは現在のエディタのセレクションに同期させる
    if(selections === null)
    {
        newSelections = markdownCore.appContext.getEditorModel().getSelections()
        .map(sel => [Utils.positionToIndex(markdown, sel.sPos), Utils.positionToIndex(markdown, sel.ePos ?? sel.sPos)] as [number, number]);
    }

    // トークン変更からの場合は、コマンド実行したあとそのトークンの位置をセレクションに同期させる。
    else
    {
        if(selections.length === 1)
        {
            execSelections(selections, markdown, markdownCore);
            newSelections = selections;
        }
    }

    if(singleToken)
    {
        newSingleToken = singleToken;
    }
    else
    {
        if(newSelections.length === 1)
        {
            const [start, end] = newSelections[0];
            const tokenByIndex = findTokenByIndex(rootToken, start);
            newSingleToken = tokenByIndex;
        }
    }

    return { newSelections, newSingleToken };
}

type ContextPropertyRef =
{
    isEditing: boolean;
    markdown: string;
    markdownCore: MarkdownCore | undefined;
    tokenStates: TokenStates;
}

export const MarkdownTokenContextProviderWrapper = ({ children }: any) =>
{
    const { markdown } = useMarkdownEditorAttributeContext();
    const { isEditing } = useMarkdownEditorStateContext();
    const { markdownCore, editorContext } = useMarkdownCoreSessionInternal() ?? {};
    
    const [tokenStates, setTokenStates] = useState<TokenStates>({
        rootToken: new MarkdownParser().parseTokenTree(markdown),
        selections: [],
        singleToken: undefined
    });

    const contextPropertyRef = useRef<ContextPropertyRef>(null as any);
    contextPropertyRef.current =
    {
        markdown,
        isEditing,
        markdownCore,
        tokenStates
    };


    const updateTokenStatesRef = useRef<any>(null);
    updateTokenStatesRef.current = (states: Partial<TokenStates>) =>
    {
        let s = tokenStates;
        const { rootToken, selections, singleToken } = states;

        if(selections) s = { ...s, selections }
        if(singleToken) s = { ...s, singleToken }
        if(rootToken) s = { ...s, rootToken }

        if(s !== tokenStates)
        {
            //console.log("wwwwwwwwwwwwwwwwwwwwwwwwwww update states wwwwwwwwwwwwwwwwwwwwwwwww")
            //console.log(s)
            setTokenStates(s);
            return s;
        }

        return tokenStates;
    }

    //console.log("::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::")
    //console.log("::::::::::::::::::::::: Token Context ReRender :::::::::::::::::::::")
    

    const setRootToken = useCallback(() => {
        //console.log(" >>>>>>>>>>>>>> RootChanged()")
        const { markdown, markdownCore } = contextPropertyRef.current;
        const rootToken = new MarkdownParser().parseTokenTree(markdown);
        const { newSelections, newSingleToken } = selectionsAndTokenAction(markdownCore, markdown, rootToken, null);
        updateTokenStatesRef.current({ rootToken, selections: newSelections, singleToken: newSingleToken });
    }, [])

    const setSelectionsAndToken = useCallback((selections: [number, number][] | null, singleToken?: IToken) => {
        //console.log(" >> >> >> >> >> >> >> Context Selection and Token Changed()")
        const { markdown, markdownCore, tokenStates } = contextPropertyRef.current;
        const { newSelections, newSingleToken } = selectionsAndTokenAction(markdownCore, markdown, tokenStates.rootToken, selections, singleToken);
        updateTokenStatesRef.current({ selections: newSelections, singleToken: newSingleToken});
    }, []);

    const ctx = useMemo<MarkdownTokenContextType>(() => {
        return {
            ...tokenStates,
            onEdits: (edits: [string, number, number][]) => {
                const s = edits.map<IReplaceText>(e => {
                    const [text, start, end] = e;
                    return { area: Utils.IndexToSelection(contextPropertyRef.current.markdown, start, end), text };
                })

                if(s.length)
                {
                    editorContext?.getEditorModel().replaces(s);
                }
            },
            setSelections: (selections) =>
            {
                const { markdown, markdownCore } = contextPropertyRef.current;
                execSelections(selections, markdown, markdownCore)
            },
            setSelectionsAndToken,
            getSingleText: () =>
            {
                const pos = tokenStates.singleToken?.getPosition();
                if(pos)
                {
                    const {start, end} = pos;
                    return contextPropertyRef.current.markdown.slice(start, end)
                }
            }
        }
    }, [tokenStates]);

    //useEffect(() => console.log("-------------------------> context changed <--------------------------"), [tokenStates])
    //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", ctx.selections)
    

    return (
        <MarkdownTokenContextProvider value={ctx}>
            { children }
            <MarkdownCoreTokenEffects
                isEditing={isEditing}
                setRootToken={setRootToken}
                setSelectionsAndToken={setSelectionsAndToken}
                markdownCore={markdownCore}
                contextPropertyRef={contextPropertyRef}
            />
        </MarkdownTokenContextProvider>
    )
}

type MarkdownCoreTokenEffectsProps =
{
    isEditing: boolean;
    setRootToken: () => void;
    setSelectionsAndToken: (selections: [number, number][] | null, singleToken?: IToken) => void;
    markdownCore?: MarkdownCore;
    contextPropertyRef: React.MutableRefObject<ContextPropertyRef>;
}

const MarkdownCoreTokenEffects = ({
    isEditing,
    setRootToken,
    setSelectionsAndToken,
    markdownCore,
    contextPropertyRef
}: MarkdownCoreTokenEffectsProps) =>
{
    
    useEffect(() => {
        if(!isEditing)
        {
            setRootToken()
        }
    }, [isEditing])

    //console.log(contextPropertyRef.current.tokenStates.selections)

    useEffect(() => {
        const ec = markdownCore?.eventCollection.add({
            selectChanged: (e: any) => {
                const { isEditing } = contextPropertyRef.current;
                if(!isEditing)
                {
                    //console.log(" >>>>>>>>>>>>>> SelectChanged()");
                    try
                    {
                        setSelectionsAndToken(null);
                    }
                    catch(ex)
                    {
                        //console.log("######################################", ex);
                    }
                }
            }
        })

        return () => ec?.dispose();
    }, [markdownCore]);

    return null;

}

/*
優先度	箇所	問題
高	MarkdownCoreTokenEffects の useEffect	rootToken の再生成が isEditing の変化時に限られています。編集状態が変わらないまま markdown が更新されると、トークンツリーが古いまま残ります。
高	updateTokenStatesRef の状態更新	singleToken が未指定（undefined）の場合は更新されません。選択解除や、対応するトークンが見つからない場面でも以前の singleToken が残り、getSingleText() が古いトークンのテキストを返す可能性があります。
中	ctx の useMemo	editorContext を参照していますが、依存配列は [tokenStates] のみです。エディターコンテキストだけが切り替わり tokenStates が変わらない場合、onEdits が以前のコンテキストを使う可能性があります。
なお、選択変更時の例外も catch ブロック で握りつぶされています。失敗時に状態が同期されないうえ原因も追いにくくなるため、必
*/