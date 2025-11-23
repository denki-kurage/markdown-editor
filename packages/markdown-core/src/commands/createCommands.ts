import boldLight from '../../icons/light/bold.svg';
import boldDark from '../../icons/dark/bold.svg';

import italicLight from '../../icons/light/italic.svg';
import italicDark from '../../icons/dark/italic.svg';

import strikeLight from '../../icons/light/strike.svg';
import strikeDark from '../../icons/dark/strike.svg';

import underLight from '../../icons/light/under.svg';
import underDark from '../../icons/dark/under.svg';

import codeLight from '../../icons/light/code.svg';
import codeDark from '../../icons/dark/code.svg';

import linkLight from '../../icons/light/link.svg';
import linkDark from '../../icons/dark/link.svg';


import checkedLight from '../../icons/light/checked.svg';
import checkedDark from '../../icons/dark/checked.svg';

import uncheckedLight from '../../icons/light/unchecked.svg';
import uncheckedDark from '../../icons/dark/unchecked.svg';

import toggleCheckLight from '../../icons/light/toggle-check.svg';
import toggleCheckDark from '../../icons/dark/toggle-check.svg';

import removeCheckLight from '../../icons/light/remove-check.svg';
import removeCheckDark from '../../icons/dark/remove-check.svg';


import { ICommandItem } from './ICommandItem';
import { IAppContext } from '../IAppContext';
import { AddImageCommand } from './AddImageCommand';
import { AddBlogCardCommand } from './AddBlogCardCommand';
import { CodeHoldTextCommand, HoldTextCommand } from './HoldTextCommand';
import { SelectCommand } from './SelectCommand';
import { CheckBoxEditCommand, CheckBoxState } from './CheckBoxEditCommand';

const darkIcons = {
    'bold': boldDark,
    'italic': italicDark,
    'strike': strikeDark,
    'under': underDark,
    'code': codeDark,
    'link': linkDark,
    'checked': checkedDark,
    'unchecked': uncheckedDark,
    'toggleCheck': toggleCheckDark,
    'removeCheck': removeCheckDark,
}

const lightIcons = {
    'bold': boldLight,
    'italic': italicLight,
    'strike': strikeLight,
    'under': underLight,
    'code': codeLight,
    'link': linkLight,
    'checked': checkedLight,
    'unchecked': uncheckedLight,
    'toggleCheck': toggleCheckLight,
    'removeCheck': removeCheckLight,
}

export function createDefaultMarkdownCommandItem(appContext: IAppContext, mode: "light" | "dark" = "light"): ICommandItem
{
    const icons = mode === "light" ? lightIcons : darkIcons;

    return {
        name: "root",
        command: undefined,
        icon: undefined,
        label: 'root',
        children: [
            { name: 'markdown:add-bold', label: '**Bold**', icon: icons['bold'], command: new HoldTextCommand(appContext, '**') },
            { name: 'markdown:add-italic', label: '*Italic*', icon: icons['italic'], command: new HoldTextCommand(appContext, '*') },
            { name: 'markdown:add-strike', label: 'Strikethrough', icon: icons['strike'], command: new HoldTextCommand(appContext, '~~') },
            { name: 'markdown:add-under-tag', label: 'Underline Tag', icon: icons['under'], command: new HoldTextCommand(appContext, '<u>', '</u>') },
            { name: 'markdown:add-under-line', label: '__Underline__', icon: icons['under'], command: new HoldTextCommand(appContext, '__', '__') },
            { name: 'markdown:add-code', label: 'Code', icon: icons['code'], command: new CodeHoldTextCommand(appContext) },
            { name: 'markdown:add-inline-code', label: 'Inline Code', icon: icons['code'], command: new HoldTextCommand(appContext, '`', '`') },

            //{ name: 'markdown:add-link', label: 'Link', icon: icons['link'], command: undefined },
            { name: 'markdown:add-checked', label: 'Checked Checkbox', icon: icons['checked'], command: new CheckBoxEditCommand(appContext, CheckBoxState.Checked) },
            { name: 'markdown:add-unchecked', label: 'Unchecked Checkbox', icon: icons['unchecked'], command: new CheckBoxEditCommand(appContext, CheckBoxState.Unchecked) },
            { name: 'markdown:add-toggle-checkbox', label: 'Toggle CheckBox', icon: icons['toggleCheck'], command: new CheckBoxEditCommand(appContext, CheckBoxState.Toggle) },
            { name: 'markdown:remove-checkbox', label: 'Remove CheckBox', icon: icons['removeCheck'], command: new CheckBoxEditCommand(appContext, CheckBoxState.RemoveCheckBox) },
            { name: 'markdown:select', label: undefined, icon: undefined, command: new SelectCommand(appContext) },
        ]
    }
}

