import { Button, CheckboxControl, Modal } from "@wordpress/components";
import { flatItem, flatLeafTokenSet, TokenSet } from '@mde/markdown-core-extensions';

import { useEffect, useMemo, useState } from "react";
import { IToken } from "@mde/markdown-core";

type TokenCheckerModalProps =
{
    markdown: string;
    tokenSet: TokenSet
    isOpened: boolean;
    closed: () => void;
    onCheckedTokens: (tokens: IToken[]) => void;
}

export const TokenCheckerModal = ({ markdown, tokenSet, isOpened, closed, onCheckedTokens }: TokenCheckerModalProps) =>
{
    const [selections, setSelections] = useState<IToken[]>([]);

    const { leafTokenList, data } = useMemo(() => {
        const leafTokenList = flatLeafTokenSet(tokenSet).map(leaf => leaf.token);
        const data = [...toList(tokenSet)].map(({ts, deps}, index) => ({ id: index.toString(), ...toListItem(ts, markdown), deps }));
        return { leafTokenList, data }
    }, [tokenSet]);

    const enables = useMemo(() => {
        // 最も高い位置のトークンセット探索
        return [...flatItem(tokenSet, ts => ts.children, ts => selections.includes(ts.token))].filter(ts => selections.includes(ts.token)).map(ts => ts.token);
    }, [selections, tokenSet]);

    useEffect(() => {
        setSelections(leafTokenList);
    }, [tokenSet])


    const toggle = (token: IToken) =>
    {
        if(!selections.includes(token))
        {
            setSelections([...selections, token]);
        }
        else
        {
            const index = selections.indexOf(token);
            if(index >= 0)
            {
                const s = [...selections];
                s.splice(index, 1);
                setSelections([...s])
            }
        }
    }


    if(!isOpened) return null;

    return (
        <Modal onRequestClose={e => closed()}>
            <div className="token-deps">
                <Button variant="primary" onClick={() => onCheckedTokens(enables)}>選択する</Button>
                <table>
                    <thead>
                        <tr>
                            <th>Check</th>
                            <th>Token Type</th>
                            <th>Text</th>
                            <th>Length</th>
                            <th>Breaks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map(d => {
                                const enabled = enables.includes(d.token);
                                const checked = selections.includes(d.token);
                                return <ListItem
                                    key={d.id}
                                    enabled={enabled}
                                    data={d}
                                    deps={d.deps}
                                    checked={checked}
                                    toggle={() => toggle(d.token)}
                                    />
                            })
                        }
                    </tbody>
                </table>
            </div>
        </Modal>
    )
}

const ListItem = ({ enabled, data, deps, checked, toggle }:  { enabled: boolean, data: toListItemType, deps: number, checked: boolean, toggle: () => void }) =>
{
    const { type, description, length, breaks } = data;
    const cls = enabled ? 'enable-selection' : undefined;

    return (
        <>
            <tr onClick={toggle} className={cls}>
                <td>
                    <CheckboxControl
                        checked={checked}
                        onChange={e => {}}
                        />
                </td>
                <td className={`left-${deps}`}>{ type }</td>
                <td>{ description }</td>
                <td>{ length }</td>
                <td>{ breaks }</td>
            </tr>
        </>
    )
}

function *toList(ts: TokenSet)
{
    const list = [{ ts, deps: 0}];
    let current = list[0];

    while(current = list.shift()!)
    {
        const { ts, deps } = current;
        list.unshift(...ts.children.map(child => ({ ts: child, deps: deps + 1})));
        yield current;
    }
}

const toListItem = (tokenSet: TokenSet, markdown: string) =>
{
    const token = tokenSet.token;
    const type = token.getType();
    const { start, end } = token.getPosition();
    const text = markdown.substring(start, end);
    const length = text.length;
    const breaks = text.split("\n").length;
    const description = text.substring(0, 50) + (text.length > 50 ? ' .....' : '');

    return { token, type, start, end, length, breaks, text, description }
}
type toListItemType = ReturnType<typeof toListItem>;
