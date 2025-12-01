import { CheckBoxEditCommand, CheckBoxState } from '@mde/markdown-core-extensions';
import { ToggleControl } from '@wordpress/components';
import { useState } from 'react';
import { TokenEditorProps } from '../../markdown-block-editor/src/kurage/components/inspector-hooks';

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
                label="チェックボックス"
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
