import { CommandBaseGeneric } from "./CommandBaseGeneric";
import { AppHelper } from "../AppHelper";
export class TableCommandBase extends CommandBaseGeneric {
    commandContext;
    appContext;
    appHelper;
    constructor(commandContext) {
        super();
        this.commandContext = commandContext;
        this.appContext = commandContext.appContext;
        this.appHelper = new AppHelper(this.appContext);
    }
    /**
     * デフォルトではパラメータの型の安全性は一切保証しません。
     * @param parameter
     */
    convert(parameter) {
        return parameter;
    }
}
//# sourceMappingURL=TableCommandBase.js.map