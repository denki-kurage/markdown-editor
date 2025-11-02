import { CommandBaseGeneric } from "./CommandBaseGeneric";
import { AppHelper } from "../AppHelper";
import { IAppContext } from "@mde/markdown-core";
import { ICommandContext } from "../ICommandContext";
export declare abstract class TableCommandBase<T> extends CommandBaseGeneric<T> {
    protected readonly commandContext: ICommandContext;
    protected readonly sealValue?: T;
    protected readonly appContext: IAppContext;
    protected readonly appHelper: AppHelper;
    constructor(commandContext: ICommandContext, sealValue?: T);
    /**
     * デフォルトではパラメータの型の安全性は一切保証しません。
     * @param parameter
     */
    protected convert(parameter: any): T | undefined;
}
//# sourceMappingURL=TableCommandBase.d.ts.map