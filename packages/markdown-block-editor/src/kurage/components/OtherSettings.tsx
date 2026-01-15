import apiFetch from "@wordpress/api-fetch";
import { Button, CheckboxControl, Modal, RangeControl, SelectControl, Spinner, TextControl } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";

import { store as noticeStore } from "@wordpress/notices";
import { useCallback, useEffect, useMemo, useState } from "@wordpress/element";
import { store } from "../store";
import { useMarkdownAppContext } from "../context/markdown-app-context";

import { ISettings } from "../store/ISettings";
import { applyFilters } from "@wordpress/hooks";
import { useExtensionContexts } from "./hooks";



export const OthreSettings = ({}) =>
{
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button variant="primary" style={{width: '100%'}} onClick={() => setIsOpen(true)}>{__('Open Other Settings', 'markdown-block-editor')}</Button>
            { isOpen && <Modal onRequestClose={e => setIsOpen(false)}><OtherSettingsDialog /></Modal>}
        </>
    )
}

const OtherSettingsDialog = ({}) =>
{
    const { settings, settingOptions } = useMarkdownAppContext();
    const { monacoTheme, prismTheme, frontTheme, adminTheme, previewInterval, configurations } = settings;
    const { frontThemes, adminThemes, prismThemes, monacoThemes } = settingOptions;

    const { createSuccessNotice, createErrorNotice } = useDispatch(noticeStore);
    const { updateSettings } = useDispatch(store);
    const { markdownCore } = useMarkdownAppContext();
    const recentCodeLanguages = markdownCore.getConfigurationHelper().getRecentCodeLanguages();

    const ctxs = useExtensionContexts();

    const { frontThemeOptions, adminThemeOptions, prismThemeOptions, monacoThemeOptions } = useMemo(() => {
        const frontThemeOptions = frontThemes.map(t => ({ value: t.key, label: t.name }));
        const adminThemeOptions = adminThemes.map(t => ({ value: t.key, label: t.name }));
        const prismThemeOptions = prismThemes.map(t => ({ value: t.key, label: t.name }));
        const monacoThemeOptions = monacoThemes.map(t => ({ value: t.key, label: t.name }));
        return { frontThemeOptions, adminThemeOptions, prismThemeOptions, monacoThemeOptions };
    }, [settingOptions]);


    const extensionSettings: any[] = useMemo(() => applyFilters('markdown_block_editor_settings', []), []) as any;

    return (
        <div>
            
            <p>{recentCodeLanguages.join(', ')}</p>

            <RangeControl
                label={__('Preview Interval', 'markdown-block-editor')}
                value={previewInterval}
                onChange={v => updateSettings({previewInterval: v})}
                max={5000}
                min={500}
                />

            <SelectControl
                label={__('Front Theme', 'markdown-block-editor')}
                options={frontThemeOptions}
                value={frontTheme}
                onChange={value => updateSettings({ frontTheme: value })}
            />

            <SelectControl
                label={__('Admin Theme', 'markdown-block-editor')}
                options={adminThemeOptions}
                value={adminTheme}
                onChange={value => updateSettings({ adminTheme: value })}
            />

            <SelectControl
                label={__('Monaco Editor Theme', 'markdown-block-editor')}
                options={monacoThemeOptions}
                value={monacoTheme}
                onChange={value => updateSettings({ monacoTheme: value })}
            />

            <SelectControl
                label={__('Prism Theme', 'markdown-block-editor')}
                options={prismThemeOptions}
                value={prismTheme}
                onChange={value => updateSettings({ prismTheme: value })}
            />

            <p>{ __('This will update the options used globally, but you will need to reload the page for the changes to take effect.', 'markdown-block-editor') }</p>


            { extensionSettings.map(Control => <Control configurations={configurations} extensionContexts={ctxs} />) }


        </div>
    )
}
