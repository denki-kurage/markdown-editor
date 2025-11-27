
import checkedLight from '../../resources/commands/light/checked.svg';
import checkedDark from '../../resources/commands/dark/checked.svg';

import uncheckedLight from '../../resources/commands/light/unchecked.svg';
import uncheckedDark from '../../resources/commands/dark/unchecked.svg';

import toggleCheckLight from '../../resources/commands/light/toggle-check.svg';
import toggleCheckDark from '../../resources/commands/dark/toggle-check.svg';

import removeCheckLight from '../../resources/commands/light/remove-check.svg';
import removeCheckDark from '../../resources/commands/dark/remove-check.svg';

import delDecorationsLight from '../../resources/commands/light/del-decorations.svg';
import delDecorationsDark from '../../resources/commands/dark/del-decorations.svg';

import delBoldLight from '../../resources/commands/light/del-bold.svg';
import delBoldDark from '../../resources/commands/dark/del-bold.svg';

import delItalicLight from '../../resources/commands/light/del-italic.svg';
import delItalicDark from '../../resources/commands/dark/del-italic.svg';

import delStrikeLight from '../../resources/commands/light/del-strike.svg';
import delStrikeDark from '../../resources/commands/dark/del-strike.svg';

import delUnderLight from '../../resources/commands/light/del-under.svg';
import delUnderDark from '../../resources/commands/dark/del-under.svg';


import { IAppContext, ICommandItem } from '@mde/markdown-core';
import { DelDecorations, DeleteHoldTextCommand } from '../DeleteHoldTextCommand';
import { CheckBoxEditCommand, CheckBoxState } from '../CheckBoxEditCommand';


const darkIcons = {
    'checked': checkedDark,
    'unchecked': uncheckedDark,
    'toggleCheck': toggleCheckDark,
    'removeCheck': removeCheckDark,
    'delDecoration': delDecorationsDark,
    'delBold': delBoldDark,
    'delItalic': delItalicDark,
    'delStrike': delStrikeDark,
    'delUnder': delUnderDark,
}

const lightIcons = {
    'checked': checkedLight,
    'unchecked': uncheckedLight,
    'toggleCheck': toggleCheckLight,
    'removeCheck': removeCheckLight,
    'delDecoration': delDecorationsLight,
    'delBold': delBoldLight,
    'delItalic': delItalicLight,
    'delStrike': delStrikeLight,
    'delUnder': delUnderLight,
}

export function createExtensionMarkdownCommandItem(appContext: IAppContext, mode: "light" | "dark" = "light"): ICommandItem
{
    const icons = mode === "light" ? lightIcons : darkIcons;

    return {
        name: "root",
        command: undefined,
        icon: undefined,
        label: 'root',
        children: [
            {
                name: 'del-decorations', label: 'Remove Text Decorations', icon: icons['delDecoration'], command: undefined, children: [
                    { name: 'del-bold', label: 'Remove Bold', icon: icons['delBold'], command: new DeleteHoldTextCommand(appContext, DelDecorations.Bold) },
                    { name: 'del-italic', label: 'Remove Italic', icon: icons['delItalic'], command: new DeleteHoldTextCommand(appContext, DelDecorations.Italic) },
                    { name: 'del-strike', label: 'Remove Strike', icon: icons['delStrike'], command: new DeleteHoldTextCommand(appContext, DelDecorations.Strike) },
                    { name: 'del-under', label: 'Remove Underline', icon: icons['delUnder'], command: new DeleteHoldTextCommand(appContext, DelDecorations.Under) }
                ]
            },
            { name: 'markdown:add-checked', label: 'Checked Checkbox', icon: icons['checked'], command: new CheckBoxEditCommand(appContext, CheckBoxState.Checked) },
            { name: 'markdown:add-unchecked', label: 'Unchecked Checkbox', icon: icons['unchecked'], command: new CheckBoxEditCommand(appContext, CheckBoxState.Unchecked) },
            { name: 'markdown:add-toggle-checkbox', label: 'Toggle CheckBox', icon: icons['toggleCheck'], command: new CheckBoxEditCommand(appContext, CheckBoxState.Toggle) },
            { name: 'markdown:remove-checkbox', label: 'Remove CheckBox', icon: icons['removeCheck'], command: new CheckBoxEditCommand(appContext, CheckBoxState.RemoveCheckBox) }
        ]
    }
}

