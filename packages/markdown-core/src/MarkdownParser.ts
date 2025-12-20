import { unified } from "unified";
import remarkParse from "remark-parse"
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm"
import rehypeStringify from 'rehype-stringify'
import remarkRehype from 'remark-rehype'
import { visit } from "unist-util-visit";
import { IToken } from "./IToken";
import { IStringCounter } from "./IStringCounter";


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
            visit(tree, (node, index, parent) => {
                const position = node?.position;
                const flag = [
                    parent?.tagName === 'pre' && node?.tagName === 'code'
                ];

                if(position && !flag.some(f => f))
                {
                    node.properties = {
                        ...node.properties,
                        "data-offset-start": position?.start?.offset,
                        "data-offset-end": position?.end?.offset,
                        "data-line-number": position?.start?.line,
                        "data-offset": true
                    };
                }
            });
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


    public static formatTable(markdown: string, strCounter: IStringCounter)
    {
        const table = parseTable(markdown);
        return table ? formatTables(table, strCounter) : null;
    }

}



interface ITable
{
    headers: string[];
    alignments: ('center'|'right'|'left'|'')[];
    rows: string[][]
}


const parseTable = (md: string) =>
{
    const p = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .parse(md)
    ;

    const getTable = (root: any) =>
    {
        const stack: any[] = [root];
        let current = null;

        while(current = stack.shift())
        {
            if(current.type === 'table')
            {
                return current;
            }

            stack.unshift(...(current.children ?? []));
        }
    }

    const rowTexts = (row: any) =>
    {
        return row.children.map(c => {
            const children = c?.children ?? [];
            if(children.length)
            {
                const sp = children[0].position;
                const ep = children[children.length - 1].position;
                if(sp)
                {
                    const s = sp.start.offset;
                    const e = (ep ?? sp).end.offset;
                    return md.slice(s, e).trim();
                }
            }
            return '';
        });
    }

    const table = getTable(p);

    if(table)
    {
        console.log(table);


        const tableHeader = table.children.shift();
        const tableRows = [...table.children];
        return {
            alignments: table.align.map(a => a ?? ''),
            headers: rowTexts(tableHeader),
            rows: tableRows.map(tr => rowTexts(tr))
        } as ITable;
    }
}


const alignmentFill = (alignment: string, widthLen: number) =>
{
    const lineLen = alignment === 'center' ? widthLen - 2 : widthLen - 1;
    const line = "-".repeat(lineLen);
    return alignment === 'center' ? `:${line}:` : alignment === 'right' ? `${line}:` : alignment === 'left' ? `:${line}` : `-${line}`;
}
const alignmentText = (text: string, textLen: number, widthLen: number, alignment: string) =>
{
    const space = widthLen - textLen;
    const r = Math.floor(space / 2);
    const a = [
        [0, space],
        [r, space - r],
        [space, 0]
    ];
    const [left, right] = alignment === 'right' ? a[2] : alignment === 'center' ? a[1] : a[0];
    const ls = " ".repeat(left);
    const rs = " ".repeat(right);
    return `${ls}${text}${rs}`;
}

const formatTables = (table: ITable, strCount: (text: string) => number) =>
{
    const { headers, alignments, rows } = table;
    const columnSpaces = alignments
        .map((h, index) => [headers[index] ?? '', ...rows.map(row => row?.[index] ?? '')])
        .map(rowTexts => Math.max(...rowTexts.map(r => strCount(r))))
    
    const toRow = (cells: string[]) =>
    {
        const l = alignments.length;
        const c = [...cells];
        const x = c.splice(l);
        const r = c.map((c, i) => alignmentText(c, strCount(c), columnSpaces[i] ?? strCount(c), alignments[i]));
        
        // @ts-ignore 生やす～！
        r.comments = x.join('|');
        return r;
    }
    const h = toRow(headers);
    const a = alignments.map((a, i) => alignmentFill(a, columnSpaces[i] + 2));
    const rs = rows.map(row => toRow(row));

    const wrap = text => `| ${text} |`;

    return [
        //@ts-ignore
        wrap(h.join(' | ')) + h.comments,
        `|${a.join('|')}|`,
        // @ts-ignore
        ...rs.map(r => wrap(r.join(' | ')) + r.comments)
    ].join("\n");
}







