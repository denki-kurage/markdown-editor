import { ICommandContext } from "../ICommandContext";
import { MarkdownTableContent } from "../MarkdownTableContent";
import { TableCommandBase } from "./TableCommandBase";
/**
 * isIndexがtrueの時、テーブルがparameter個目(0から数えて)へ、falseの時はドキュメントインデックスにあるテーブルへ移動します。
 */
export declare class ScrollCommand extends TableCommandBase<number> {
    readonly isIndex: boolean;
    constructor(commandContext: ICommandContext, isIndex?: boolean);
    protected executeGeneric(parameter: number): void;
    protected canExecuteGeneric(parameter: number): boolean;
    getTargetTable(parameter: number): MarkdownTableContent | undefined;
}
//# sourceMappingURL=ScrollCommand.d.ts.map