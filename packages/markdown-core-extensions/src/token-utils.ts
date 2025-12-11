import { IToken } from "@mde/markdown-core"



export type TokenSet = { deps: number, token: IToken, children: TokenSet[] }
export type tokenFilterFunc = (current: IToken, predicate: (token: IToken) => boolean, deps?: number) => TokenSet | null;
/**
 * 子から走査、つまり末端からフィルタリングして切り離されていきます。
 * 末端(リーフ)からチェックされますが、上位の階層(枝)はフィルタリングされません。
 * リーフが発見された時点でその上位ノードも無条件に追加されることに注意してください。
 */
export const filterTokenTreeFromBottom: tokenFilterFunc = (current, predicate, deps = 0) =>
{
    const matched = predicate(current);
    const children = current.getChildren().map(c => filterTokenTreeFromBottom(c, predicate, deps + 1)).filter(f => !!f)

    // 自身、または子孫が一つでもマッチしたらセーフ。
    if(children.length || matched)
    {
        return { deps, token: current, children }
    }

    return null;
}

export const getAncestorsByToken = (token: IToken, tokenSet: TokenSet) =>
{
    const tokenStack = [...getAncestors(token)];
    const tokenSetList = new Map([...flatItem(tokenSet, ts => ts.children)].map(s => [s.token, s]));
    return tokenStack.map(token => tokenSetList.get(token)).filter(s => !!s);
}

export function getAncestors(token: IToken)
{
    return [...getAncestorsInternal(token)].reverse();
}

function *getAncestorsInternal(token: IToken)
{
    let current = token;
    do
    {
        yield current;
    }
    while (current = current.getParent()!);
}

/**
 * ITokenから探索していき子孫一覧を返します。
 */
export function *flatItem<T>(item: T, getChildren: (item: T) => T[], predicate?: (item: T) => boolean)
{
    let current = item;
    const list = [item];

    while(current = list.shift()!)
    {
        // 成功したら子は追加しない。
        if(!predicate?.(current))
        {
            list.unshift(...getChildren(current));
        }
        yield current;
    }
}

export const flatLeafTokenSet = (tokenSet: TokenSet) =>
{
    return [...flatItem(tokenSet, ts => ts.children)].filter(ts => ts.children.length === 0);
}



export type filterParams =
{
    tokenTypes: string[];
    selections: [number, number][];
    useSelections: boolean;
    selectionAllMode: boolean;
}

export const createFilter = (params: filterParams) =>
{
    const { selections, tokenTypes, useSelections, selectionAllMode } = params;

    const hasTypes = tokenTypes.length && !tokenTypes.includes('');

    const newSelections = selections
        // .filter(([s, e]) => s !== e)
        .map(([s, e]) => [Math.min(s, e), Math.max(s, e)]);
    
    const selector: (s: number, e: number, start: number, end: number) => boolean = selectionAllMode ?
        (s, e, start, end) => (s <= start && end <= e) :
        (s, e, start, end) => (e > start && end > s);
    
    return (token: IToken) =>
    {
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

            if(!newSelections.some(([s, e]) => selector(s, e, start, end)))
            {
                return false;
            }
        }

        return true;
    }
}
