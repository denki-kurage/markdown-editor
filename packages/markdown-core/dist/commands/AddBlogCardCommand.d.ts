import { MarkdownCommandBase } from "./MarkdownCommandBase";
export type AddBlogCardParams = {
    url: string;
    title: string;
    image: string;
};
export declare class AddBlogCardCommand extends MarkdownCommandBase<AddBlogCardParams> {
    execute(parameter?: AddBlogCardParams | undefined): void;
    canExecute(parameter?: AddBlogCardParams | undefined): boolean;
}
//# sourceMappingURL=AddBlogCardCommand.d.ts.map