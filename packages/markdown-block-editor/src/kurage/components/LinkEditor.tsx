// @ts-ignore
import { LinkControl } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import { useState } from "@wordpress/element";
import { useMarkdownAppContext } from "../context/markdown-app-context";
import { __ } from "@wordpress/i18n";



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

            <Button variant="primary" disabled={!link} onClick={accept}>{__('Accept', 'markdown-block-editor')}</Button>
        </>
    );
};
