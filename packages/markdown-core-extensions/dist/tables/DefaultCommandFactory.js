import { ChangeAlignmentCommand } from "./commands/ChangeAlignmentCommand";
import { RemoveColumnCommand } from "./commands/RemoveColumnCommand";
import { InsertColumnCommand } from "./commands/InsertColumnCommand";
import { InsertRowCommand } from "./commands/InsertRowCommand";
import { MoveRowCommand } from "./commands/MoveRowCommand";
import { MoveColumnCommand } from "./commands/MoveColumnCommand";
import { FillCellsCommand } from "./commands/FillCellsCommand";
import { FormatCommand } from "./commands/FormatCommand";
import { RemoveRowCommand } from "./commands/RemoveRowCommand";
import { FocusCommand } from "./commands/FocusCommand";
import { DeleteCommentCommand } from "./commands/DeleteCommetCommand";
import { SortCommand } from "./commands/SortCommand";
import { TextSortCommand } from "./commands/TextSortCommand";
import { ScrollCommand } from "./commands/ScrollCommand";
import { MarkdownAlignments } from "./MarkdownAlignments";
import { MarkdownTableConverter, MarkdownTableRenderMode } from "./MarkdownTableConverter";
import { Direction } from "./Direction";
import { ColumnSelectCommand, SelectType } from "./commands/ColumnSelectCommand";
export class DefaultCommandFactory {
    appContext;
    cache;
    formatterContext;
    constructor(appContext, cache, formatterContext) {
        this.appContext = appContext;
        this.cache = cache;
        this.formatterContext = formatterContext;
    }
    commandContext(renderMode = MarkdownTableRenderMode.Natural) {
        const ctx = renderMode ? this.formatterContext : {
            formatter: this.formatterContext.formatter,
            tableConverter: new MarkdownTableConverter(renderMode, this.appContext.returnKey())
        };
        return new CommandContext(this.appContext, ctx, this.cache);
    }
    //#region セルベースのコマンド
    createMoveLeft() {
        return new MoveColumnCommand(this.commandContext(), true);
    }
    createMoveRight() {
        return new MoveColumnCommand(this.commandContext(), false);
    }
    createMoveTop() {
        return new MoveRowCommand(this.commandContext(), true);
    }
    createMoveBottom() {
        return new MoveRowCommand(this.commandContext(), false);
    }
    createInsertLeft() {
        return new InsertColumnCommand(this.commandContext(), true);
    }
    createInsertRight() {
        return new InsertColumnCommand(this.commandContext(), false);
    }
    createInsertTop() {
        return new InsertRowCommand(this.commandContext(), true);
    }
    createInsertBottom() {
        return new InsertRowCommand(this.commandContext(), false);
    }
    createChangeAlignLeft() {
        return new ChangeAlignmentCommand(this.commandContext(), MarkdownAlignments.Left);
    }
    createChangeAlignCenter() {
        return new ChangeAlignmentCommand(this.commandContext(), MarkdownAlignments.Center);
    }
    createChangeAlignRight() {
        return new ChangeAlignmentCommand(this.commandContext(), MarkdownAlignments.Right);
    }
    createNaturalFormat() {
        return new FormatCommand(this.commandContext(MarkdownTableRenderMode.Natural));
    }
    createBeautifulFormat() {
        return new FormatCommand(this.commandContext(MarkdownTableRenderMode.Beautiful));
    }
    createFocusLeft() {
        return new FocusCommand(this.commandContext(), Direction.Left);
    }
    createFocusRight() {
        return new FocusCommand(this.commandContext(), Direction.Right);
    }
    createFocusTop() {
        return new FocusCommand(this.commandContext(), Direction.Top);
    }
    createFocusBottom() {
        return new FocusCommand(this.commandContext(), Direction.Bottom);
    }
    createColumnSelect() {
        return new ColumnSelectCommand(this.commandContext(), SelectType.Full);
    }
    createColumnSelectAll() {
        return new ColumnSelectCommand(this.commandContext(), SelectType.Empty | SelectType.Full);
    }
    createColumnSelectEmpty() {
        return new ColumnSelectCommand(this.commandContext(), SelectType.Empty);
    }
    createDeleteComment() {
        return new DeleteCommentCommand(this.commandContext());
    }
    createFillCells() {
        return new FillCellsCommand(this.commandContext());
    }
    createRemoveRow() {
        return new RemoveRowCommand(this.commandContext());
    }
    createRemoveColumn() {
        return new RemoveColumnCommand(this.commandContext());
    }
    createSortAsc() {
        return new SortCommand(this.commandContext(), true);
    }
    createSortDesc() {
        return new SortCommand(this.commandContext(), false);
    }
    createTextSortAsc() {
        return new TextSortCommand(this.commandContext(), true, false);
    }
    createTextSortDesc() {
        return new TextSortCommand(this.commandContext(), false, false);
    }
    createTextSortAscIgnore() {
        return new TextSortCommand(this.commandContext(), true, true);
    }
    createTextSortDescIgnore() {
        return new TextSortCommand(this.commandContext(), false, true);
    }
    //#endregion
    //#region 全体的なコマンド
    createIndexScrollCommand() {
        return new ScrollCommand(this.commandContext(), true);
    }
    //#endregion
    createCommandFactries() {
        const factory = this;
        const commands = new Map();
        commands.set('markdown:table:format:beautiful', factory.createBeautifulFormat());
        //commands.set('markdown:table:format:natural', factory.createNaturalFormat());
        //commands.set('markdown:table:format:delete-comment', factory.createDeleteComment());
        commands.set('markdown:table:format:fill-cells', factory.createFillCells());
        commands.set('markdown:table:align:right', factory.createChangeAlignRight());
        commands.set('markdown:table:align:center', factory.createChangeAlignCenter());
        commands.set('markdown:table:align:left', factory.createChangeAlignLeft());
        commands.set('markdown:table:insert:top', factory.createInsertTop());
        commands.set('markdown:table:insert:bottom', factory.createInsertBottom());
        commands.set('markdown:table:insert:left', factory.createInsertLeft());
        commands.set('markdown:table:insert:right', factory.createInsertRight());
        commands.set('markdown:table:remove:column', factory.createRemoveColumn());
        commands.set('markdown:table:remove:row', factory.createRemoveRow());
        commands.set('markdown:table:move:top', factory.createMoveTop());
        commands.set('markdown:table:move:bottom', factory.createMoveBottom());
        commands.set('markdown:table:move:left', factory.createMoveLeft());
        commands.set('markdown:table:move:right', factory.createMoveRight());
        commands.set('markdown:table:focus:left', factory.createFocusLeft());
        commands.set('markdown:table:focus:top', factory.createFocusTop());
        commands.set('markdown:table:focus:bottom', factory.createFocusBottom());
        commands.set('markdown:table:focus:right', factory.createFocusRight());
        commands.set('markdown:table:multi-select:nonempty', factory.createColumnSelect());
        commands.set('markdown:table:multi-select:all', factory.createColumnSelectAll());
        commands.set('markdown:table:multi-select:empty', factory.createColumnSelectEmpty());
        commands.set('markdown:table:sort:number-asc', factory.createSortAsc());
        commands.set('markdown:table:sort:number-desc', factory.createSortDesc());
        commands.set('markdown:table:sort:text-asc', factory.createTextSortAsc());
        commands.set('markdown:table:sort:text-desc', factory.createTextSortDesc());
        commands.set('markdown:table:sort:text-asc-ignore', factory.createTextSortAscIgnore());
        commands.set('markdown:table:sort:text-desc-ignore', factory.createTextSortDescIgnore());
        commands.set('scroll', factory.createIndexScrollCommand());
        return commands;
    }
}
class CommandContext {
    appContext;
    formatterContext;
    cache;
    constructor(appContext, formatterContext, cache) {
        this.appContext = appContext;
        this.formatterContext = formatterContext;
        this.cache = cache;
    }
    getTable() {
        return this.cache.cachedItem;
    }
    getFormatterContext() {
        return this.formatterContext;
    }
}
//# sourceMappingURL=DefaultCommandFactory.js.map