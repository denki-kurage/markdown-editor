import { unified } from "unified";
import remarkParse from "remark-parse"
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm"
import rehypeStringify from 'rehype-stringify'
import remarkRehype from 'remark-rehype'
import { visit } from "unist-util-visit";
import { IToken } from "./IToken";


export class MarkdownParser
{
    public parseSaveMarkdown(markdown: string): string
    {
        return unified()
            .use(remarkParse)
            .use(remarkBreaks)
            .use(remarkGfm)
            .use(remarkRehype, { allowDangerousHtml: true })
            .use(rehypeStringify, { allowDangerousHtml: true })
            .processSync(markdown)
            .toString();
    }

    public parseEditMarkdown(markdown: string): string
    {
        const rec = () => (tree: any) =>
        {
            const nodes = [tree]
            while(nodes.length)
            {
                const top = nodes.shift();
                if(top.children)
                {
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
        }

        const addTextElement = () =>tree => {
            
            visit(tree, 'element', (node) => {
                const { tagName } = node;
    
                if(['td', 'th', 'li', 'strong', 'paragraph'].includes(tagName))
                {
                    for(const textNode of node?.children ?? [])
                    {
                        if(textNode.type === 'text')
                        {
                            Object.assign(textNode,
                                {
                                    type: 'element',
                                    tagName: 'span',
                                    //properties: { className: 'table-cell' },
                                    children: [{ type: 'text', value: textNode.value }]
                                }
                            )
                        }

                    }

                }
            })
        }

        return unified()
            .use(remarkParse)
            .use(remarkBreaks)
            .use(remarkGfm)
            .use(remarkRehype, { allowDangerousHtml: true })
            .use(addTextElement)
            .use(rec)
            .use(rehypeStringify, { allowDangerousHtml: true })
            .processSync(markdown)
            .toString();
    }

    public parseTokenTree(markdown: string): IToken
    {
        const root = unified()
            .use(remarkParse)
            .use(remarkGfm)
            .parse(markdown);
        
        const createNode = (node: any, parent: any = undefined) =>
        {
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
            }
            
            const children = node.children?.map((c: any) => createNode(c, n)) ?? []

            return n;
        }


        return createNode(root);
    }

}


