import { MarkdownContentBase } from "@mde/markdown-core";
export class MarkdownLineContent extends MarkdownContentBase {
    text;
    constructor(text) {
        super();
        this.text = text;
    }
    toString() {
        return this.text;
    }
}
//# sourceMappingURL=MarkdownLineContent.js.map