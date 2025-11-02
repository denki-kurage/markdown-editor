import { CommandBaseGeneric } from "./CommandBaseGeneric";
import { AppHelper } from "../AppHelper";
export class TableCommandBase extends CommandBaseGeneric {
    commandContext;
    sealValue;
    appContext;
    appHelper;
    constructor(commandContext, sealValue) {
        super();
        this.commandContext = commandContext;
        this.sealValue = sealValue;
        this.appContext = commandContext.appContext;
        this.appHelper = new AppHelper(this.appContext);
    }
    /**
     * デフォルトではパラメータの型の安全性は一切保証しません。
     * @param parameter
     */
    convert(parameter) {
        return parameter ?? this.sealValue;
    }
}
//# sourceMappingURL=TableCommandBase.js.map