import { ICommandItem } from './ICommandItem';
import { IAppContext } from '../IAppContext';
import { CodeHoldTextCommand, HoldTextCommand } from './HoldTextCommand';
import { SelectCommand } from './SelectCommand';


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

import inlineCodeLight from '../../icons/light/inline-code.svg';
import inlineCodeDark from '../../icons/dark/inline-code.svg';

import linkLight from '../../icons/light/link.svg';
import linkDark from '../../icons/dark/link.svg';


const darkIcons = {
    'bold': boldDark,
    'italic': italicDark,
    'strike': strikeDark,
    'under': underDark,
    'code': codeDark,
    'inlineCode': inlineCodeDark,
    'link': linkDark
}

const lightIcons = {
    'bold': boldLight,
    'italic': italicLight,
    'strike': strikeLight,
    'under': underLight,
    'code': codeLight,
    'inlineCode': inlineCodeLight,
    'link': linkLight
}

export function createDefaultMarkdownCommandItem(appContext: IAppContext, mode: "light" | "dark" = "light"): ICommandItem
{
    const icons = mode === "light" ? lightIcons : darkIcons;

    return {
        name: "basic",
        command: undefined,
        icon: undefined,
        label: 'basicCommands',
        children: [
            { name: 'markdown:add-bold', label: '**Bold**', icon: icons['bold'], command: new HoldTextCommand(appContext, '**') },
            { name: 'markdown:add-italic', label: '*Italic*', icon: icons['italic'], command: new HoldTextCommand(appContext, '*') },
            { name: 'markdown:add-strike', label: 'Strikethrough', icon: icons['strike'], command: new HoldTextCommand(appContext, '~~') },
            { name: 'markdown:add-under-tag', label: 'Underline Tag', icon: icons['under'], command: new HoldTextCommand(appContext, '<u>', '</u>') },
            { name: 'markdown:add-inline-code', label: 'Inline Code', icon: icons['inlineCode'], command: new HoldTextCommand(appContext, '`', '`') },
            { name: 'markdown:add-code', label: 'Code', icon: icons['code'], command: new CodeHoldTextCommand(appContext) },
            //{ name: 'markdown:add-link', label: 'Link', icon: icons['link'], command: undefined },
            { name: 'markdown:select', label: undefined, icon: undefined, command: new SelectCommand(appContext) },
        ]
    }
}

