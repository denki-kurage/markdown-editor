import { MarkdownCore } from '@mde/markdown-core';
import { MediaPlaceholder } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import React, { useState } from 'react';


const ImagePreview = ({ url, thu }: any) =>
{

    return (
        <>
            { url && <a href={url} target="_blank"><img src={thu ?? url} /></a> }
        </>
    )
}

const getDetails = (details: any, sizeType: string) =>
{
    const st = details?.sizes?.[sizeType];

    return st ? {
        height: st.height,
        width: st.width,
        file: st.source_url,
        fileSize: st.filesize
    } : undefined;
}
const ImageUploadEditor = ({ mc, onExecuted }: { mc?: MarkdownCore, onExecuted: () => void}) =>
{
    const [imageId, setImageId] = useState<number|undefined>(undefined);
    
    // @ts-ignore
    const img = useSelect(select => select('core').getMedia(imageId), [imageId]);
    const de = img?.media_details;


    /**
     * TODO: ここは設定可能にするかどうかは未定義。
     */
    const sizeTypes = ['medium', 'thumbnail'];
    const details = sizeTypes.map(s => getDetails(de, s)).find(d => !!d);
    const fullDetails = getDetails(de, 'full');

    const { width, height, file } = details ?? fullDetails ?? { width: undefined, height: undefined, file: '' };
    const originFile = fullDetails?.file;



    const addImage = () =>
    {
        mc?.createCommandCollection().execute('markdown:add-image', {imageUrl: originFile, thumbnailUrl: file, width, height });
        onExecuted();
    }

    const prv = (
        <div style={{maxWidth: '50vh', maxHeight: '50vh', overflow: 'scroll' }}>
            <ImagePreview url={originFile} thu={file} />
        </div>
    );

    
    return (
        <div>
            <MediaPlaceholder
                onSelect={e => setImageId(e.id)}
                mediaPreview={prv}
                />

            <Button disabled={imageId === undefined} variant="primary" onClick={() => addImage()}>
                追加する
            </Button>
        </div>
    )
}


export default ImageUploadEditor;

