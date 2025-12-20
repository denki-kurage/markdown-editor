import { Button, TextControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import React, { useCallback, useState } from "react";
import { ogpGenerator } from "../classes/OgpManager";
import { store as noticesStore } from "@wordpress/notices";
import { useDispatch } from "@wordpress/data";
import { AddBlogCardParams, MarkdownCore } from "@mde/markdown-core";
import { useMarkdownAppContext } from "../context/markdown-app-context";



const BlogCardGenerator = ({ onExecuted }: { onExecuted: () => void}) =>
{
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { createErrorNotice } = useDispatch(noticesStore);
    const { markdownCore } = useMarkdownAppContext();


    const updateState = (url: string) =>
    {
        setUrl(url);
        setError('');
    }

    const addBlogCard = useCallback(async () =>
    {
        setLoading(true);

        try
        {
            const ogp = await ogpGenerator.add(url);
            const originUrl = url;

            if(ogp)
            {
                ogp.url = ogp?.url ?? originUrl;
                const { type, title, url, image } = ogp;

                if(!title || !url)
                {
                    throw new Error('title or url is empty');
                }

                const p: AddBlogCardParams = { url, title, image };
                markdownCore?.createCommandCollection().execute('markdown:add-blog-card', p);
                onExecuted();
            }
        }
        catch(e: any)
        {
            const em = e.message ?? 'blog card load error';
            setError(em);
            createErrorNotice('blog card load error', { type: 'snackbar' })
        }

        setLoading(false);
    }, [url]);

    const style = error ? { borderColor: 'red', borderStyle: 'solid', borderWidth: 1 } : {};

    return (
        <>
            <TextControl value={url} onChange={updateState} style={style} help={error}  />

            <Button variant="primary" disabled={loading} onClick={() => addBlogCard()}>
                { __('Add blog card', 'mdtableeditor') }
            </Button>
        </>
    )
}

export default BlogCardGenerator;