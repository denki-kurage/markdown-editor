import { IToken } from "@mde/markdown-core"


export type TokenSet = { token: IToken, children: TokenSet[] }
export type tokenFilterFunc = (current: IToken, predicate: (token: IToken) => boolean) => TokenSet | null;
/**
 * 子から走査、つまり末端からフィルタリングして切り離されていきます。
 * 末端(リーフ)からチェックされますが、上位の階層(枝)はフィルタリングされません。
 * リーフが発見された時点でその上位ノードも無条件に追加されることに注意してください。
 */
export const filterTokenTreeFromBottom: tokenFilterFunc = (current, predicate) =>
{
    const matched = predicate(current);
    const children = current.getChildren().map(c => filterTokenTreeFromBottom(c, predicate)).filter(f => !!f)

    if(children.length || matched)
    {
        return { token: current, children }
    }

    return null;
}

export const getAncestorsByToken = (token: IToken, tokenSet: TokenSet) =>
{
    const tokenStack = [...getAncestors(token)];
    const tokenSetList = new Map([...flatItem(tokenSet, ts => ts.children)].map(s => [s.token, s]));
    return tokenStack.map(token => tokenSetList.get(token)).filter(s => !!s);
}

export function *getAncestors(token: IToken)
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
