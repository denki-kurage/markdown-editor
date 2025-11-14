import { Button, TextareaControl } from "@wordpress/components";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IToken } from "@mde/markdown-core";
import { applyFilters } from "@wordpress/hooks";
import { ExtensionContexts } from "./token-inspectors";
import React from "react";



export type TokenEditorProps =
{
    token: IToken;
    contexts: ExtensionContexts;
}

export type TokenEditorComponentInfo =
{
    type: string;
    label: string;
    component: (props: TokenEditorProps) => JSX.Element
}

export type ExtensionEditorProps =
{
    contexts: ExtensionContexts;
}
export type ExtensionComponentInfo =
{
    label: string;
    component: (props: ExtensionEditorProps) => JSX.Element
}

export const useTokenEditorComponents = (type: string) =>
{
    const components = useMemo(() => {
        const defaults: TokenEditorComponentInfo = { type: 'text', label: 'Text Editor', component: TextTokenEditor };
        return applyFilters('getTokenEditorComponents', [defaults]) as TokenEditorComponentInfo[];
    }, []);

    return components.filter(c => c.type === type);
}

export const useExtensionComponents = () =>
{
    return useMemo(() => {
        return applyFilters('getExtensionComponents', []) as ExtensionComponentInfo[];
    }, []);
}


export const TextTokenEditor = ({ token, contexts }: TokenEditorProps) =>
{
    const { tokenContext } = contexts;
    const { start, end } = token.getPosition();
    const [value, setValue] = useState(tokenContext.getSingleText() ?? '');


    const edit = useCallback(() =>
    {
        tokenContext.onEdits([[value, start, end]]);
    }, []);

    return (
        <div className="text-token-editor">

            <TextareaControl
                label={token.getType()}
                value={value}
                onChange={setValue}
                rows={6}
            />
            <Button value={value} onClick={edit} variant="primary">Text Update</Button>
        </div>
    )
};