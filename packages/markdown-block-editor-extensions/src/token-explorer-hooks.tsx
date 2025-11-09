import { IToken } from "@mde/markdown-core"

export const filterSelections = (tokens: IToken[], selections: [number, number][]) =>
{

}

export const flatTokenNodes = (rootToken: IToken) =>
{

}

export type TokenSet = { token: IToken, children: TokenSet[] }
export type tokenFilterFunc = (current: IToken, predicate: (token: IToken) => boolean) => TokenSet | null;
/**
 * 子から走査、つまり末端からフィルタリングして切り離されていきます。
 */
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


export const getAncestors = (token?: IToken) =>
{
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

}