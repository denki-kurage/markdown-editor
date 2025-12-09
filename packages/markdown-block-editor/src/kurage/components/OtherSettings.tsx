import apiFetch from "@wordpress/api-fetch";
import { Button, Modal, RangeControl, SelectControl, Spinner, TextControl } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";

import { store as noticeStore } from "@wordpress/notices";
import React, { useCallback, useEffect, useState } from "react";
import { ISettings } from "../../../ISettings";
import { store } from "../store";


export const OthreSettings = ({}) =>
{
    const [isOpen, setIsOpen] = useState(false);
    const settings = useSelect(select => select(store).getSettings(), []);
    const storeState = useSelect(select => select(store).getStoreState(), []);

    return (
        <>
            <Button variant="primary" style={{width: '100%'}} onClick={() => setIsOpen(true)}>ほかの設定を開く</Button>
            { isOpen && <Modal onRequestClose={e => setIsOpen(false)}><OtherSettingsDialog settings={settings} /></Modal>}
        </>
    )
}

const OtherSettingsDialog = ({settings}: { settings: ISettings }) =>
{
    const { adminCss, frontCss } = settings;
    const { createSuccessNotice, createErrorNotice } = useDispatch(noticeStore);
    const { updateSettings } = useDispatch(store);

    const changed = () =>
    {
        updateSettings({ adminCss, frontCss })
    }

    return (
        <div>

            <TextControl value={frontCss} onChange={changed} label="front css" />
            <TextControl value={adminCss} onChange={changed} label="admin css" />

            <p>{ __('This will update the options used globally, but you will need to reload the page for the changes to take effect.', 'mdtableeditor') }</p>

        </div>
    )
}
