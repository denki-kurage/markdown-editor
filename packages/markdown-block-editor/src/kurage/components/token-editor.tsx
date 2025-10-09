import { Button, TextareaControl } from "@wordpress/components";
import { useEffect, useState } from "react";
import { Table } from "./token-editor-forms/table";
import { useMarkdownContext } from "../context/markdown-context";
import { useMarkdownTokenContext } from "../context/markdown-token-context";
import { IToken } from "./parser/IToken";


export const TokenEditor = () =>
{
    const { markdown, markdownApp } = useMarkdownContext();
    const { currentToken: token, onEdit } = useMarkdownTokenContext();

    // @ts-ignore
    const pos = token?.position;
    const [start, end] = pos ? [pos.start.offset, pos.end.offset] : [0, 0];
    const tx = markdown.substring(start, end);


    const form = (markdownApp && token) ? getEditForm({ token, text: tx, start, end, onEdit }) : null;


    return (
        <div className="token-editor">
            <p>{ token?.getType() }</p>
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
