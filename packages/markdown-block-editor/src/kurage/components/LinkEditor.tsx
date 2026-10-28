// @ts-ignore
import { LinkControl } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { useMarkdownCoreInstance } from "../context/markdown-core-context";



export const LinkEditor = ({ onExecuted }: any) =>
{
    const markdownCore = useMarkdownCoreInstance();
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

            <Button variant="primary" disabled={!link} onClick={accept}>{__('Accept', 'markdown-block-editor')}</Button>
        </>
    );
};
