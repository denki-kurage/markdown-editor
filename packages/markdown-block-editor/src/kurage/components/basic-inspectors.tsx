import { Button, Modal, PanelBody, RangeControl } from "@wordpress/components";
import { OptionSettings } from "./option-settings";
import { useState } from "react";
import { __ } from "@wordpress/i18n";

type BasicInspectorsProps = {
    editHeight: number | undefined;
    onEditHeightChanged: (h: number | undefined) => void;
}

export const BasicInspectors = ({ editHeight, onEditHeightChanged }: BasicInspectorsProps) =>
{
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    return (
        <>
        
            <PanelBody title="attributes">
                <div>
                    <RangeControl
                        label={ __(`Editor Height`, 'mdtableeditor') + (editHeight ? `(${editHeight})` : '') }
                        min={100}
                        max={2000}
                        withInputField={false}
                        value={editHeight}
                        allowReset={true}
                        onReset={e => onEditHeightChanged(undefined)}
                        onChange={e => onEditHeightChanged(e)}
                        />
                </div>
            </PanelBody>

            <PanelBody title="settings">

                <div>
                    <Button variant="primary" disabled={isSettingsOpen} onClick={() => setIsSettingsOpen(true)}>
                        { __('Open settings from', 'mdtableeditor') }
                    </Button>
                    { isSettingsOpen && (
                        <Modal title={ __('global settings', 'mdtableeditor') } onRequestClose={e => setIsSettingsOpen(false)}>
                            <OptionSettings />
                        </Modal>
                    )}
                </div>

            </PanelBody>
        </>
    );
}