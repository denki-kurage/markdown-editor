import { CheckBoxEditCommand, CheckBoxState } from '@kurage/markdown-core-extensions';
import { ToggleControl } from '@wordpress/components';
import { useState } from "@wordpress/element";
import { __ } from '@wordpress/i18n';

import type { TokenEditorProps } from "@kurage/markdown-block-editor";


export const ListItemEditor = ({ token, contexts }: TokenEditorProps) =>
{
    const { tokenContext, appContext } = contexts;
    const { appContext: markdownAppContext } = appContext;
    const { onEdits } = tokenContext;
    const text = tokenContext.getSingleText() || '';
    const { start, end } = token.getPosition();

    const command = new CheckBoxEditCommand(markdownAppContext, CheckBoxState.Toggle);
    const [isChecked, setIsChecked] = useState(() => command.isChecked(text));
    const hasCheckBox = command.hasCheckBox(text);

    return (
        <div>
            { hasCheckBox && <ToggleControl
                checked={isChecked}
                label={__('Checked', 'markdown-block-editor')}
                onChange={checked => {
                    setIsChecked(checked);
                    const newText = command.toggleCheckBox(text);
                    onEdits([[newText, start, end]]);
                }}
                />
            }

        </div>
    )
}
