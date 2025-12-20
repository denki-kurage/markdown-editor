// @ts-ignore
import { LinkControl } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import React, { useState } from "react";
import { useMarkdownAppContext } from "../context/markdown-app-context";



export const LinkEditor = ({ onExecuted }: any) =>
{
    const { markdownCore } = useMarkdownAppContext();
    const [link, setLink] = useState<{ url: string; title: string } | null>(null);

    const accept = () => {
        if(link)
        {
            const { url, title } = link;
            markdownCore?.createCommandCollection().execute('markdown:add-link', { url, title });
            onExecuted();            
        }

    };

    return (
        <>
            <LinkControl onChange={setLink} />

            <Button variant="primary" disabled={!link} onClick={accept}>決定</Button>
        </>
    );
};
