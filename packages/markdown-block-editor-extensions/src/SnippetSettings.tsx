import { ISnippet } from "@kurage/markdown-core";
import { Button, Modal, TextareaControl, TextControl } from "@wordpress/components";
import { createContext, useCallback, useContext, useMemo, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { useEffect } from "@wordpress/element";
import { ExtensionSettingsProps } from "./ExtensionSettingsProps";
import { ExMarkdownCore } from "@kurage/markdown-core-extensions";

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

export const SnippetsSettings = ({configurations, extensionContexts}: ExtensionSettingsProps) =>
{
    const { markdownCore } = extensionContexts.appContext;
    const markdownCoreEx = markdownCore as ExMarkdownCore;
    
    const snippets = markdownCoreEx.getConfigurationHelper().getSnippets();
    const [isOpen, setIsOpen] = useState(false);
    const [editingSnippet, setEditingSnippet] = useState<ISnippet | undefined>();

    const editSnippet = (snippet: ISnippet) =>
    {
        const newSnippets = [...snippets];
        markdownCoreEx.getConfigurationHelper().updateSnippets(newSnippets);
    }

    const addSnippet = (snippet: ISnippet) =>
    {
        const newSnippets = [...snippets, { ...snippet }];
        markdownCoreEx.getConfigurationHelper().updateSnippets(newSnippets);
    }

    const removeSnippet = (snippet: ISnippet) =>
    {
        const newSnippets = snippets.filter((s: ISnippet) => s !== snippet);
        markdownCoreEx.getConfigurationHelper().updateSnippets(newSnippets);
    }

    const updateSelectedSnippet = (snippet?: ISnippet) =>
    {
        setEditingSnippet(snippet);
    }

    const checkUniquePrefix = (prefix: string) =>
    {
        return !snippets.some(s => s.prefix === prefix);
    }

    const clearSelectedSnippet = useCallback(() => setEditingSnippet(undefined), []);

    const ctx: SnippetSettingsContextType = useMemo(() => ({
        snippets: snippets ?? [],
        selectedSnippet: editingSnippet,
        updateSelectedSnippet,
        editSnippet,
        addSnippet,
        removeSnippet,
        checkUniquePrefix,
    }), [snippets, editingSnippet, editSnippet, addSnippet, removeSnippet, updateSelectedSnippet, checkUniquePrefix]);


    useEffect(() => {
        if(editingSnippet && !snippets.includes(editingSnippet))
        {
            clearSelectedSnippet();
        }
    }, [snippets])

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
                                <Button variant="primary" className="markdown-block-editor-button-vertical" style={{ marginBottom: '1em' }} onClick={clearSelectedSnippet}>
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
    ) as JSX.Element;
}

const SnippetsList = () =>
{
    const { snippets } = useSnippetSettingsContext();

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
        <Button variant={isSelected ? "primary" : "secondary"} style={{ overflow: 'hidden', opacity: isSelected ? 0.7 : undefined }} className="markdown-block-editor-button-vertical" onClick={() => updateSelectedSnippet(snippet)}>
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


