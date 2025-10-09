import { MarkdownRange } from "../MarkdownRange";
import { MarkdownCommandBase } from "./MarkdownCommandBase";
import { sanitize } from "./sanitizer";
export class AddBlogCardCommand extends MarkdownCommandBase {
    execute(parameter) {
        if (parameter) {
            const pos = this.appContext.getEditorModel().getCursor();
            const replacer = this.appContext.getEditorModel();
            const { url, title, image } = parameter;
            const host = new URL(url).host;
            const u = sanitize(url);
            const t = sanitize(title);
            const i = sanitize(image);
            const h = sanitize(host);
            const blogCard = [
                '<div class="blog-card">',
                `<a href="${u}" target="_blank">`,
                '<div>',
                `<div>${t}</div>`,
                `<span>${h}</span>`,
                '</div>',
                `<img src="${i}" />`,
                '</a>',
                '</div>'
            ].join('');
            const p = pos?.docIndex ?? 0;
            this.getTextReplacer().replaceLines([{
                    area: new MarkdownRange(p, p + 1),
                    text: blogCard
                }]);
        }
    }
    canExecute(parameter) {
        return true;
    }
}
//# sourceMappingURL=AddBlogCardCommand.js.map