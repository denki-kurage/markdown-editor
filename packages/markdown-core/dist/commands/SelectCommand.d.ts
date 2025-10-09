import { ISelection } from "../ISelection";
import { MarkdownCommandBase } from "./MarkdownCommandBase";
export type SelectCommandParams = {
    selections: ISelection[];
};
export declare class SelectCommand extends MarkdownCommandBase<SelectCommandParams> {
    execute(parameter?: SelectCommandParams | undefined): void;
    canExecute(parameter?: SelectCommandParams | undefined): boolean;
}
//# sourceMappingURL=SelectCommand.d.ts.map