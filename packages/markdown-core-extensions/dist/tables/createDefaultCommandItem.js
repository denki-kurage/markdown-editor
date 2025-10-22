import formatFillCellsLight from '../../resources/icons/format/light/fill-cells.svg';
import formatButifulLight from '../../resources/icons/format/light/beautiful.svg';
//import formatNaturalLight from '../../resources/icons/format/light/natural.svg';
//import formatDeleteCommentLight from '../../resources/icons/format/light/delete-comment.svg';
import focusLeftLight from '../../resources/icons/focus/light/left.svg';
import focusTopLight from '../../resources/icons/focus/light/top.svg';
import focusBottomLight from '../../resources/icons/focus/light/bottom.svg';
import focusRightLight from '../../resources/icons/focus/light/right.svg';
import alignLeftLight from '../../resources/icons/align/light/left.svg';
import alignCenterLight from '../../resources/icons/align/light/center.svg';
import alignRightLight from '../../resources/icons/align/light/right.svg';
import insertLeftLight from '../../resources/icons/insert/light/left.svg';
import insertTopLight from '../../resources/icons/insert/light/top.svg';
import insertBottomLight from '../../resources/icons/insert/light/bottom.svg';
import insertRightLight from '../../resources/icons/insert/light/right.svg';
import removeColumnLight from '../../resources/icons/remove/light/column.svg';
import removeRowLight from '../../resources/icons/remove/light/row.svg';
import moveLeftLight from '../../resources/icons/move/light/left.svg';
import moveTopLight from '../../resources/icons/move/light/top.svg';
import moveBottomLight from '../../resources/icons/move/light/bottom.svg';
import moveRightLight from '../../resources/icons/move/light/right.svg';
import multiSelectLight from '../../resources/icons/multi-select/light/select.svg';
import multiSelectAllLight from '../../resources/icons/multi-select/light/all.svg';
import multiSelectEmptyLight from '../../resources/icons/multi-select/light/empty.svg';
import numberSortAscLight from '../../resources/icons/sort/light/number-asc.svg';
import numberSortDescLight from '../../resources/icons/sort/light/number-desc.svg';
import textSortAscLight from '../../resources/icons/sort/light/text-asc.svg';
import textSortDescLight from '../../resources/icons/sort/light/text-desc.svg';
import textSortAscIgnoreLight from '../../resources/icons/sort/light/text-asc-ignore.svg';
import textSortDescIgnoreLight from '../../resources/icons/sort/light/text-desc-ignore.svg';
import formatFillCellsDark from '../../resources/icons/format/dark/fill-cells.svg';
import formatButifulDark from '../../resources/icons/format/dark/beautiful.svg';
//import formatNaturalDark from '../../resources/icons/format/dark/natural.svg';
//import formatDeleteCommentDark from '../../resources/icons/format/dark/delete-comment.svg';
import focusLeftDark from '../../resources/icons/focus/dark/left.svg';
import focusTopDark from '../../resources/icons/focus/dark/top.svg';
import focusBottomDark from '../../resources/icons/focus/dark/bottom.svg';
import focusRightDark from '../../resources/icons/focus/dark/right.svg';
import alignLeftDark from '../../resources/icons/align/dark/left.svg';
import alignCenterDark from '../../resources/icons/align/dark/center.svg';
import alignRightDark from '../../resources/icons/align/dark/right.svg';
import insertLeftDark from '../../resources/icons/insert/dark/left.svg';
import insertTopDark from '../../resources/icons/insert/dark/top.svg';
import insertBottomDark from '../../resources/icons/insert/dark/bottom.svg';
import insertRightDark from '../../resources/icons/insert/dark/right.svg';
import removeColumnDark from '../../resources/icons/remove/dark/column.svg';
import removeRowDark from '../../resources/icons/remove/dark/row.svg';
import moveLeftDark from '../../resources/icons/move/dark/left.svg';
import moveTopDark from '../../resources/icons/move/dark/top.svg';
import moveBottomDark from '../../resources/icons/move/dark/bottom.svg';
import moveRightDark from '../../resources/icons/move/dark/right.svg';
import multiSelectDark from '../../resources/icons/multi-select/dark/select.svg';
import multiSelectAllDark from '../../resources/icons/multi-select/dark/all.svg';
import multiSelectEmptyDark from '../../resources/icons/multi-select/dark/empty.svg';
import numberSortAscDark from '../../resources/icons/sort/dark/number-asc.svg';
import numberSortDescDark from '../../resources/icons/sort/dark/number-desc.svg';
import textSortAscDark from '../../resources/icons/sort/dark/text-asc.svg';
import textSortDescDark from '../../resources/icons/sort/dark/text-desc.svg';
import textSortAscIgnoreDark from '../../resources/icons/sort/dark/text-asc-ignore.svg';
import textSortDescIgnoreDark from '../../resources/icons/sort/dark/text-desc-ignore.svg';
const lightIconsList = {
    formatFillCellsLight, formatButifulLight, /* formatNaturalLight, formatDeleteCommentLight, */
    focusLeftLight, focusTopLight, focusBottomLight, focusRightLight,
    alignLeftLight, alignCenterLight, alignRightLight,
    insertLeftLight, insertTopLight, insertBottomLight, insertRightLight,
    removeColumnLight, removeRowLight,
    moveLeftLight, moveTopLight, moveBottomLight, moveRightLight,
    multiSelectLight, multiSelectAllLight, multiSelectEmptyLight,
    numberSortAscLight, numberSortDescLight,
    textSortAscLight, textSortDescLight, textSortAscIgnoreLight, textSortDescIgnoreLight
};
const darkIconsList = {
    formatFillCellsDark, formatButifulDark, /* formatNaturalDark, formatDeleteCommentDark, */
    focusLeftDark, focusTopDark, focusBottomDark, focusRightDark,
    alignLeftDark, alignCenterDark, alignRightDark,
    insertLeftDark, insertTopDark, insertBottomDark, insertRightDark,
    removeColumnDark, removeRowDark,
    moveLeftDark, moveTopDark, moveBottomDark, moveRightDark,
    multiSelectDark, multiSelectAllDark, multiSelectEmptyDark,
    numberSortAscDark, numberSortDescDark,
    textSortAscDark, textSortDescDark, textSortAscIgnoreDark, textSortDescIgnoreDark
};
const maps = {
    'format': ['fill-cells', 'beautiful', 'natural', 'delete-comment'],
    'focus': ['left', 'top', 'bottom', 'right'],
    'align': ['left', 'center', 'right'],
    'insert': ['left', 'top', 'bottom', 'right'],
    'remove': ['column', 'row'],
    'move': ['left', 'top', 'bottom', 'right'],
    'multi-select': ['select', 'all', 'empty'],
    'sort': ['number-asc', 'number-desc', 'text-asc', 'text-desc', 'text-asc-ignore', 'text-desc-ignore']
};
const toCamelCase = (str) => {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};
const upCap = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
export const createDefaultCommandItem = (commands, mode) => {
    const iconsMap = mode === 'light' ? lightIconsList : darkIconsList;
    const children = Object.keys(maps).map((group) => {
        const children = maps[group].map((name) => {
            const commandName = `markdown:table:${group}:${name}`;
            const iconName = toCamelCase(group) + upCap(toCamelCase(name)) + (mode === 'light' ? 'Light' : 'Dark');
            return {
                name: commandName,
                label: `${group} ${name}`,
                icon: iconsMap[iconName],
                command: commands.get(commandName)
            };
        });
        return {
            name: group,
            label: group,
            icon: '',
            command: undefined,
            children: children
        };
    });
    return {
        name: 'table',
        label: 'table',
        icon: undefined,
        command: undefined,
        children
    };
};
//# sourceMappingURL=createDefaultCommandItem.js.map