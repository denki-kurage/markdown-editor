import { MarkdownCore } from '@kurage/markdown-core';
import { MediaPlaceholder } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState } from "@wordpress/element";
import { useMarkdownAppContext } from '../context/markdown-app-context';


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
const ImageUploadEditor = ({ onExecuted }: { onExecuted: () => void}) =>
{
    const [imageId, setImageId] = useState<number|undefined>(undefined);
    const { markdownCore } = useMarkdownAppContext();
    
    // @ts-ignore
    const img = useSelect(select => select('core').getEntityRecord('postType', 'attachment', imageId), [imageId]);
    const de = img?.media_details;

    //console.log(img)

    
    /**
     * TODO: ここは設定可能にするかどうかは未定義。
     */
    const sizeTypes = ['medium', 'thumbnail'];
    const details = sizeTypes.map(s => getDetails(de, s)).find(d => !!d);
    const fullDetails = getDetails(de, 'full');

    const { width, height, file } = details ?? fullDetails ?? { width: undefined, height: undefined, file: '' };
    const originFile = fullDetails?.file;



    const acceptImage = (img: any) =>
    {
        //console.log(img);
        setImageId(img.id);
    }

    const addImage = (addMode: 'figure' | 'markdown') =>
    {
        const thumbnail = [file, width, height];
        markdownCore?.createCommandCollection().execute('markdown:add-image', {imageUrl: originFile, thumbnail, addMode});
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
                onSelect={acceptImage}
                mediaPreview={prv}
                />

            <div style={{ marginTop: '1em', padding: '.5em 0' }}>
                <Button className="markdown-block-editor-button-vertical" disabled={imageId === undefined} variant="primary" onClick={() => addImage('figure')}>
                    WordPress方式で追加する
                </Button>
                <Button className="markdown-block-editor-button-vertical" disabled={imageId === undefined} variant="primary" onClick={() => addImage('markdown')}>
                    Markdown方式で追加する
                </Button>
            </div>

        </div>
    )
}


export default ImageUploadEditor;

