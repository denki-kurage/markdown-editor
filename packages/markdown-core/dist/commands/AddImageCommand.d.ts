import { MarkdownCommandBase } from "./MarkdownCommandBase";
export interface AddImageCommandParams {
    imageUrl: string;
    thumbnailUrl: string;
    width: number | undefined;
    height: number | undefined;
}
export declare class AddImageCommand extends MarkdownCommandBase<AddImageCommandParams> {
    execute(parameter: AddImageCommandParams): void;
    canExecute(parameter?: any): boolean;
}
//# sourceMappingURL=AddImageCommand.d.ts.map