/**
 * コンストラクタによる初期化を行う基底クラスです。
 *
 */
import { TableCellCommandBase } from "./TableCellCommandBase";
export class MoveCommandBase extends TableCellCommandBase {
    isBefore;
    constructor(commandContext, isBefore) {
        super(commandContext);
        this.isBefore = isBefore;
    }
}
export class InsertCommandBase extends TableCellCommandBase {
    isBefore;
    constructor(commandContext, isBefore) {
        super(commandContext);
        this.isBefore = isBefore;
    }
}
export class RemoveCommandBase extends TableCellCommandBase {
    constructor(commandContext) {
        super(commandContext);
    }
}
export class ChangeAlignmentCommandBase extends TableCellCommandBase {
    align;
    constructor(commandContext, align) {
        super(commandContext);
        this.align = align;
    }
}
export class FormatCommandBase extends TableCellCommandBase {
    constructor(commandContext) {
        super(commandContext);
    }
}
export class FocusCommandBase extends TableCellCommandBase {
    direction;
    constructor(commandContext, direction) {
        super(commandContext);
        this.direction = direction;
    }
}
export class SortCommandBase extends TableCellCommandBase {
    isAsc;
    constructor(commandContext, isAsc) {
        super(commandContext);
        this.isAsc = isAsc;
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