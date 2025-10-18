import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useMarkdownContext } from "./markdown-context";
import { useAppContext } from "./Markdown-app-context";
import { IReplaceText, IToken, MarkdownParser, Utils } from "@mde/markdown-core";



export type MarkdownTokenContextProps =
{
    onEdits: (edits: [string, number, number][]) => void;

    rootToken: IToken;
    
    /**
     * 単一の選択されたトークン。
     */
    singleToken: IToken | undefined;


    /**
     * エディタレベルでの選択範囲。
     */
    selections: [number, number][];

    /**
     * セレクションが一つの場合、start地点をインデックスとしてtokenを設定する。
     */
    setSelectionsAndToken: (selections: [number, number][] | null, singleToken?: IToken) => void;

}


const Context = createContext<MarkdownTokenContextProps>({} as any);
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

export const MarkdownTokenContextProviderWrapper = ({ children }: any) =>
{
    const { markdown } = useMarkdownContext();
    const { markdownCore, appContext } = useAppContext();
    const [singleToken, setCurrentToken] = useState<IToken|undefined>(undefined);
    const [selections, setSelections] = useState<[number, number][]>([]);
    
    const rootToken = useMemo(() => (new MarkdownParser()).parseTokenTree(markdown), [markdown]);

    useEffect(() => {
        console.log("markdown changed", markdown);
    }, [markdown]);

    /*
    useEffect(() => {
        console.log("rootToken changed", rootToken);
        const cursor = appContext.getEditorModel().getCursor();
        const index = cursor ? Utils.positionToIndex(markdown, cursor) : 0;
        const tokenByIndex = findTokenByIndex(rootToken, index);
        setCurrentToken(tokenByIndex);
        setSelections([]);
    }, [rootToken])
    */

    useEffect(() => {
        console.log("singleToken changed", singleToken);
    }, [singleToken]);

    useEffect(() => {
        console.log("selections changed", selections);
    }, [selections]);

    useEffect(() => {
        console.log("markdownCore changed", markdownCore);
    }, [markdownCore]);

    useEffect(() => {
        console.log("appContext changed", appContext);
    }, [appContext]);




    const ctx = useMemo<MarkdownTokenContextProps>(() => {
        return {
            rootToken,
            singleToken,
            selections,
            onEdits: (edits: [string, number, number][]) => {
                const s = edits.map<IReplaceText>(e => {
                    const [text, start, end] = e;
                    return { area: Utils.IndexToSelection(markdown, start, end), text };
                })

                if(s.length)
                {
                    appContext.getEditorModel().replaces(s);
                }
            },
            setSingleToken: setCurrentToken,
            setSelectionsAndToken: (selections, singleToken) =>
            {
                let newSelections: [number, number][] = [];

                // イベントから拾ったセレクションは現在のエディタのセレクションに同期させる
                if(selections === null)
                {
                    newSelections = appContext.getEditorModel().getSelections()
                    .map(sel => [Utils.positionToIndex(markdown, sel.sPos), Utils.positionToIndex(markdown, sel.ePos ?? sel.sPos)] as [number, number]);
                }

                // トークン変更からの場合は、コマンド実行したあとそのトークンの位置をセレクションに同期させる。
                else
                {
                    if(selections.length === 1)
                    {
                        const s = selections.map(sl => Utils.IndexToSelection(markdown, ...sl))
                        const cmd = markdownCore.createCommandCollection().getCommand('markdown:select');
                        cmd?.command?.execute({ selections: s });
                        newSelections = selections;
                    }
                }

                if(singleToken)
                {
                    setCurrentToken(singleToken);
                }
                else
                {
                    if(newSelections.length === 1)
                    {
                        const [start, end] = newSelections[0];
                        const tokenByIndex = findTokenByIndex(rootToken, start);
                        setCurrentToken(tokenByIndex);
                    }
                }

                setSelections(newSelections);
            }
        }
    }, [markdown, rootToken, selections, singleToken, markdownCore, appContext]);
    
    useEffect(() => {
        const ec = markdownCore.eventCollection.add({
            selectChanged: () => ctx.setSelectionsAndToken(null),
        })

        return () => ec.dispose();
    }, [markdown, appContext, markdownCore, ctx]);

    return (
        <MarkdownTokenContextProvider value={ctx}>
            { children }
        </MarkdownTokenContextProvider>
    )
}
