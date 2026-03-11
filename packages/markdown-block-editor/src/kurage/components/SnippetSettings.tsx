import { ISnippet } from "@kurage/markdown-core";
import { Button, Modal, TextareaControl, TextControl } from "@wordpress/components";
import { createContext, useCallback, useContext, useMemo, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { useMarkdownAppContext } from "../context";
import { useEffect } from "@wordpress/element";


type SnippetSettingsContextType = {
    snippets: ISnippet[];
    selectedSnippet?: ISnippet;
    checkUniquePrefix: (prefix: string) => boolean;
    updateSelectedSnippet: (snippets?: ISnippet) => void;
    editSnippet: (snippet: ISnippet) => void;
    addSnippet: (snippet: ISnippet) => void;
    removeSnippet: (snippet: ISnippet) => void;
}

const SnippetContext = createContext<SnippetSettingsContextType | undefined>(undefined);
const { Provider: SnippetContextProvider } = SnippetContext;

export const useSnippetSettingsContext = () =>
{
    const context = useContext(SnippetContext);

    if(!context)
    {
        throw new Error('useSnippetSettingsContext must be used within a SnippetContextProvider');
    }

    return context;
}

export const SnippetsSettings = () =>
{
    const { markdownCore } = useMarkdownAppContext();
    const snippets = markdownCore.getConfigurationHelper().getSnippets();
    const [isOpen, setIsOpen] = useState(false);
    const [editingSnippet, setEditingSnippet] = useState<ISnippet | undefined>();

    const editSnippet = (snippet: ISnippet) =>
    {
        const newSnippets = [...snippets];
        const index = newSnippets.findIndex(s => s === editingSnippet);
        if (index !== -1)
        {
            newSnippets[index] = { ...snippet };
        }
        markdownCore.getConfigurationHelper().updateSnippets(newSnippets);
    }

    const addSnippet = (snippet: ISnippet) =>
    {
        const newSnippets = [...snippets, { ...snippet }];
        markdownCore.getConfigurationHelper().updateSnippets(newSnippets);
    }

    const removeSnippet = (snippet: ISnippet) =>
    {
        const newSnippets = snippets.filter(s => s !== snippet);
        markdownCore.getConfigurationHelper().updateSnippets(newSnippets);
    }

    const updateSelectedSnippet = (snippet?: ISnippet) =>
    {
        setEditingSnippet(snippet);
    }

    const checkUniquePrefix = (prefix: string) =>
    {
        return !snippets.some(s => s.prefix === prefix);
    }

    const ctx: SnippetSettingsContextType = useMemo(() => ({
        snippets: snippets ?? [],
        editingSnippet,
        updateSelectedSnippet,
        editSnippet,
        addSnippet,
        removeSnippet,
        checkUniquePrefix,
    }), [snippets, editingSnippet, editSnippet]);

    const clearSelectedSnippet = useCallback(() => setEditingSnippet(undefined), []);

    useEffect(() => {
        if(editingSnippet && !snippets.includes(editingSnippet))
        {
            clearSelectedSnippet();
        }
    }, [snippets])

    console.log(editingSnippet);

    return (
        <SnippetContextProvider value={ctx}>
            <div>
                <Button variant="primary" className="markdown-block-editor-button-vertical" onClick={() => setIsOpen(true)}>
                    {__('Snippets Settings', 'markdown-block-editor')}
                </Button>
                { isOpen && (
                    <Modal title={__('Snippets Settings', 'markdown-block-editor')} onRequestClose={() => setIsOpen(false)}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ width: '200px', overflow: 'scroll', padding: '.3em' }}>
                                <Button variant="primary" className="markdown-block-editor-button-vertical" onClick={clearSelectedSnippet}>
                                    {__('View add form', 'markdown-block-editor')}
                                </Button>
                                <SnippetsList />
                            </div>
                            <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px', minWidth: '300px' }}>
                                <SnippetEditor snippet={editingSnippet} />
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </SnippetContextProvider>
    )
}

const SnippetsList = () =>
{
    const { snippets, selectedSnippet, updateSelectedSnippet } = useSnippetSettingsContext();


    return (
        <div>
            { snippets.map(snippet => <SnippetView snippet={snippet} key={snippet.prefix} />) }
        </div>
    )
}

const SnippetView = ({ snippet }: { snippet: ISnippet }) =>
{
    const { selectedSnippet, updateSelectedSnippet } = useSnippetSettingsContext();
    const isSelected = selectedSnippet === snippet;

    return (
        <Button variant={isSelected ? "tertiary" : "secondary"} style={{ overflow: 'hidden' }} className="markdown-block-editor-button-vertical" onClick={() => updateSelectedSnippet(snippet)}>
            {snippet.prefix}
        </Button>
    )
}
const SnippetEditor = ({ snippet }: { snippet?: ISnippet }) =>
{
    const [item, setItem] = useState({ prefix: '', body: '', description: '' } as ISnippet);
    const [isPrefixUnique, setIsPrefixUnique] = useState(true);
    const [canSave, setCanEdit] = useState(false);
    const { addSnippet, editSnippet, removeSnippet } = useSnippetSettingsContext();
    
    const isAdding = !snippet;

    const { checkUniquePrefix } = useSnippetSettingsContext();

    useEffect(() => {
        const newItem = snippet ? { ...snippet } : { prefix: '', body: '', description: '' } as ISnippet;
        setItem(newItem);
    }, [snippet]);

    useEffect(() => {
        // 自身のprefixがフォーム値と同じ場合はユニークとみなす。　追加時は空文字もユニークとみなす。
        const isPrefixUnique = checkUniquePrefix(item.prefix) || (item.prefix === snippet?.prefix) || (isAdding && item.prefix === '');
        const canSave = item.prefix.trim() !== '' && item.body.trim() !== '' && isPrefixUnique;
        setIsPrefixUnique(isPrefixUnique);
        setCanEdit(canSave);
    }, [item])

    const onSave = () => {
        if(canSave)
        {
            if(isAdding)
            {
                addSnippet(item);
                setItem({ prefix: '', body: '', description: '' } as ISnippet);
            }
            else
            {
                Object.assign(snippet, item);
                editSnippet(snippet);
            }
        }
    }

    return (
        <div>
            <p>{ isAdding ? 'Add' : 'Edit' } Snippet</p>
            <TextControl label={__('Prefix', 'markdown-block-editor')} value={item.prefix} onChange={(value) => setItem({...item, prefix: value})} help={isPrefixUnique ? undefined : __('This prefix is already in use.', 'markdown-block-editor')} />
            <TextareaControl label={__('Body', 'markdown-block-editor')} value={item.body} onChange={(value) => setItem({...item, body: value})} style={{ whiteSpace: 'nowrap' }} />
            <TextareaControl label={__('Description', 'markdown-block-editor')} value={item.description ?? ''} onChange={(value) => setItem({...item, description: value})} />
            <Button variant="primary" onClick={onSave} disabled={!canSave}>
                { isAdding ? __('Add', 'markdown-block-editor') : __('Save', 'markdown-block-editor') }
            </Button>
            { !isAdding && <Button variant="secondary" onClick={() => removeSnippet(snippet)}>
                { __('Delete', 'markdown-block-editor') }
            </Button> }
        </div>
    )
}


