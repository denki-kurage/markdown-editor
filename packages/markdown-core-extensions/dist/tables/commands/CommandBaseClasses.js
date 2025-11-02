/**
 * コンストラクタによる初期化を行う基底クラスです。
 *
 */
import { TableCellCommandBase } from "./TableCellCommandBase";
export class MoveCommandBase extends TableCellCommandBase {
    constructor(commandContext, isBefore) {
        super(commandContext, isBefore);
    }
}
export class InsertCommandBase extends TableCellCommandBase {
    constructor(commandContext, isBefore) {
        super(commandContext, isBefore);
    }
}
export class RemoveCommandBase extends TableCellCommandBase {
    constructor(commandContext) {
        super(commandContext);
    }
}
export class ChangeAlignmentCommandBase extends TableCellCommandBase {
    constructor(commandContext, align) {
        super(commandContext, align);
    }
}
export class FormatCommandBase extends TableCellCommandBase {
    constructor(commandContext) {
        super(commandContext);
    }
}
export class FocusCommandBase extends TableCellCommandBase {
    constructor(commandContext, direction) {
        super(commandContext, direction);
    }
}
export class SortCommandBase extends TableCellCommandBase {
    constructor(commandContext, isAsc) {
        super(commandContext, isAsc);
    }
}
export class TextSortCommandBase extends TableCellCommandBase {
    isAsc;
    ignoreCase;
    constructor(commandContext, isAsc, ignoreCase) {
        super(commandContext);
        this.isAsc = isAsc;
        this.ignoreCase = ignoreCase;
    }
}
//# sourceMappingURL=CommandBaseClasses.js.map