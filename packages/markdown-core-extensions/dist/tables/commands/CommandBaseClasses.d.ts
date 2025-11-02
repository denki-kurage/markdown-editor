/**
 * コンストラクタによる初期化を行う基底クラスです。
 *
 */
import { TableCellCommandBase } from "./TableCellCommandBase";
import { MarkdownAlignments } from "../MarkdownAlignments";
import { Direction } from "../Direction";
import { ICommandContext } from "../ICommandContext";
export declare abstract class MoveCommandBase extends TableCellCommandBase<boolean> {
    constructor(commandContext: ICommandContext, isBefore: boolean);
}
export declare abstract class InsertCommandBase extends TableCellCommandBase<boolean> {
    constructor(commandContext: ICommandContext, isBefore: boolean);
}
export declare abstract class RemoveCommandBase extends TableCellCommandBase<void> {
    constructor(commandContext: ICommandContext);
}
export declare abstract class ChangeAlignmentCommandBase extends TableCellCommandBase<MarkdownAlignments> {
    constructor(commandContext: ICommandContext, align: MarkdownAlignments);
}
export declare abstract class FormatCommandBase extends TableCellCommandBase<void> {
    constructor(commandContext: ICommandContext);
}
export declare abstract class FocusCommandBase extends TableCellCommandBase<Direction> {
    constructor(commandContext: ICommandContext, direction: Direction);
}
export declare abstract class SortCommandBase extends TableCellCommandBase<boolean> {
    constructor(commandContext: ICommandContext, isAsc: boolean);
}
export declare abstract class TextSortCommandBase extends TableCellCommandBase<void> {
    readonly isAsc: boolean;
    readonly ignoreCase: boolean;
    constructor(commandContext: ICommandContext, isAsc: boolean, ignoreCase: boolean);
}
//# sourceMappingURL=CommandBaseClasses.d.ts.map