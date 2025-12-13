import apiFetch from "@wordpress/api-fetch";
import { Button, Modal, RangeControl, SelectControl, Spinner, TextControl } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";

import { store as noticeStore } from "@wordpress/notices";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { store } from "../store";
import { useMarkdownAppContext } from "../context/markdown-app-context";

import { ISettings } from "../store/ISettings";



export const OthreSettings = ({}) =>
{
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button variant="primary" style={{width: '100%'}} onClick={() => setIsOpen(true)}>ほかの設定を開く</Button>
            { isOpen && <Modal onRequestClose={e => setIsOpen(false)}><OtherSettingsDialog /></Modal>}
        </>
    )
}

const OtherSettingsDialog = ({}) =>
{
    const { settings, settingOptions } = useMarkdownAppContext();
    const { monacoTheme, prismTheme, frontTheme, adminTheme } = settings;
    const { frontThemes, adminThemes, prismThemes, monacoThemes } = settingOptions;

    const { createSuccessNotice, createErrorNotice } = useDispatch(noticeStore);
    const { updateSettings } = useDispatch(store);
    const { markdownCore } = useMarkdownAppContext();
    const recentCodeLanguages = markdownCore.getConfigurationHelper().getRecentCodeLanguages();

    const { frontThemeOptions, adminThemeOptions, prismThemeOptions, monacoThemeOptions } = useMemo(() => {
        const frontThemeOptions = frontThemes.map(t => ({ value: t.key, label: t.name }));
        const adminThemeOptions = adminThemes.map(t => ({ value: t.key, label: t.name }));
        const prismThemeOptions = prismThemes.map(t => ({ value: t.key, label: t.name }));
        const monacoThemeOptions = monacoThemes.map(t => ({ value: t.key, label: t.name }));
        return { frontThemeOptions, adminThemeOptions, prismThemeOptions, monacoThemeOptions };
    }, [settingOptions]);

    return (
        <div>
            
            <p>{recentCodeLanguages.join(', ')}</p>

            <SelectControl
                label={__('Front Theme', 'mdtableeditor')}
                options={frontThemeOptions}
                value={frontTheme}
                onChange={value => updateSettings({ frontTheme: value })}
            />

            <SelectControl
                label={__('Admin Theme', 'mdtableeditor')}
                options={adminThemeOptions}
                value={adminTheme}
                onChange={value => updateSettings({ adminTheme: value })}
            />

            <SelectControl
                label={__('Monaco Editor Theme', 'mdtableeditor')}
                options={monacoThemeOptions}
                value={monacoTheme}
                onChange={value => updateSettings({ monacoTheme: value })}
            />

            <SelectControl
                label={__('Prism Theme', 'mdtableeditor')}
                options={prismThemeOptions}
                value={prismTheme}
                onChange={value => updateSettings({ prismTheme: value })}
            />

            <p>{ __('This will update the options used globally, but you will need to reload the page for the changes to take effect.', 'mdtableeditor') }</p>

        </div>
    )
}
