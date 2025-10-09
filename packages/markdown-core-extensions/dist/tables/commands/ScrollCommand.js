import { MarkdownRange } from "@mde/markdown-core";
import { TableCommandBase } from "./TableCommandBase";
/**
 * isIndexがtrueの時、テーブルがparameter個目(0から数えて)へ、falseの時はドキュメントインデックスにあるテーブルへ移動します。
 */
export class ScrollCommand extends TableCommandBase {
    isIndex;
    constructor(commandContext, isIndex = true) {
        super(commandContext);
        this.isIndex = isIndex;
    }
    executeGeneric(parameter) {
        const table = this.getTargetTable(parameter);
        if (table) {
            const pos = Math.floor((table.range.begin + table.range.end) / 2);
            this.commandContext.appContext.getEditorModel().scroll(pos);
            /**
             * TODO: 仕様忘れた
             */
            this.commandContext.appContext.getEditorModel().setSelections([{
                    sPos: {
                        docIndex: table.range.begin,
                        charIndex: 0
                    }
                }]);
        }
    }
    canExecuteGeneric(parameter) {
        return !!this.getTargetTable(parameter);
    }
    getTargetTable(parameter) {
        let tables = undefined;
        if (this.isIndex) {
            tables = this.appHelper.getTableContents();
            if (new MarkdownRange(0, tables.length).internal(parameter)) {
                return tables[parameter];
            }
        }
        else {
            tables = tables || this.appHelper.getTableContents();
            return tables.find(_ => _.range.internal(parameter));
        }
    }
}
//# sourceMappingURL=ScrollCommand.js.map