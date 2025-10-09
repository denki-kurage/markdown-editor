import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import rehypeStringify from 'rehype-stringify';
import remarkRehype from 'remark-rehype';
export class MarkdownParser {
    parseSaveMarkdown(markdown) {
        return unified()
            .use(remarkParse)
            .use(remarkBreaks)
            .use(remarkGfm)
            .use(remarkRehype, { allowDangerousHtml: true })
            .use(rehypeStringify, { allowDangerousHtml: true })
            .processSync(markdown)
            .toString();
    }
    parseEditMarkdown(markdown) {
        const rec = () => (tree) => {
            const nodes = [tree];
            while (nodes.length) {
                const top = nodes.shift();
                if (top.children) {
                    nodes.push(...top.children);
                }
                const position = top?.position;
                top.properties = {
                    ...top.properties,
                    "data-offset-start": position?.start?.offset,
                    "data-offset-end": position?.end?.offset,
                    "data-line-number": position?.start?.line,
                    "data-offset": true
                };
            }
        };
        return unified()
            .use(remarkParse)
            .use(remarkBreaks)
            .use(remarkGfm)
            .use(remarkRehype, { allowDangerousHtml: true })
            .use(rec)
            .use(rehypeStringify, { allowDangerousHtml: true })
            .processSync(markdown)
            .toString();
    }
    parseTokenTree(markdown) {
        const root = unified()
            .use(remarkParse)
            .use(remarkGfm)
            .parse(markdown);
        const createNode = (node, parent = undefined) => {
            const n = {
                node,
                getPosition: () => ({
                    start: node.position?.start?.offset ?? 0,
                    end: node.position?.end?.offset ?? 0
                }),
                getChildren: () => children,
                getParent: () => parent,
                getType: () => node.type ?? '*',
                getData: () => node.data
            };
            const children = node.children?.map((c) => createNode(c, n)) ?? [];
            return n;
        };
        return createNode(root);
    }
}
//# sourceMappingURL=MarkdownParser.js.map