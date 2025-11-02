import { Button, TextareaControl } from "@wordpress/components";
import { useEffect, useMemo, useState } from "react";
import { Table } from "./token-editor-forms/table";
import { IToken } from "@mde/markdown-core";


export const TokenEditor = ({ contexts }: any) =>
{
    const { tokenContext, markdownContext } = contexts;
    const { markdown } = markdownContext;
    const { singleToken, onEdits } = tokenContext;

    if(!singleToken)
    {
        return null;
    }

    // @ts-ignore


    const { form, start, end } = useMemo(() =>
        {
            const { start, end } = singleToken.getPosition();
            const text = markdown.substring(start, end);
            const form = getEditForm({
                token: singleToken,
                text,
                start,
                end,
                onEdit: (...p) => onEdits([[...p]])
            });
            return { start, end, form }
        },
        [singleToken]
    );


    return (
        <div className="token-editor">
            <p>{ singleToken?.getType() }</p>
            { form }
            <p>start: {start} end: {end}</p>
        </div>
    );
}



export type TokenEditorBaseProps =
{
    token: IToken;
    start: number;
    end: number;
    text: string;
    onEdit: (text: string, start: number, end: number) => void;
}

const getEditForm = (props: TokenEditorBaseProps) =>
{
    const { token } = props;

    switch (token.getType())
    {
        case 'table':
            return <Table />
    }

    return <TextTokenEditor {...props} />;
}

const TextTokenEditor = ({ token, text, start, end, onEdit }: TokenEditorBaseProps) =>
{
    const [value, setValue] = useState(text);

    useEffect(() => setValue(text), [text]);

    const edit = () =>
    {
        onEdit(value, start, end);
    }

    return (
        <div className="text-token-editor">

            <TextareaControl
                label={token.getType()}
                value={value}
                onChange={setValue}
                rows={6}
            />
            <Button value={value} onClick={edit} variant="primary">Update</Button>
        </div>
    )
}
