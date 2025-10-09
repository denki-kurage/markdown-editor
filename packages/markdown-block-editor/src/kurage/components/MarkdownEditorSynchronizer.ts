
export type LineMapType =
{
    lineNumber: number;
    offsetTop: number;
    line: HTMLElement;
}


export class MarkdownEditorSynchronizer
{

    public getOffsetTop = (line: Element, document: HTMLDocument) =>
    {
        let current: Element | null = line;

        do
        {
            // TDのようなエレメントはoffsetTopがTABLEからの相対位置になるため、getBoundingClientRectで取得する
            const top = current.getBoundingClientRect().top + document.body.scrollTop;
            if(top)
            {
                return top;
            }
        }
        while((current = current.parentElement) && (current !== document.body))

        return 0;
    }


    public getLineMap(document: HTMLDocument): LineMapType[]
    {
        const lines = document.querySelectorAll('[data-line-number]');

        return [...lines.values()].map(line => {
            const offsetTop = this.getOffsetTop(line, document);
            const lineNumber = parseInt(line.getAttribute('data-line-number') ?? '0');
            return { lineNumber, offsetTop, line } as LineMapType;
        })
    }


    public getLineNumberFromDocument(document: HTMLDocument): number
    {
        const top = document.body.scrollTop;
        const items = this.getLineMap(document);

        // スクロール位置に最も近い上部DOMを取得
        const [topItem] = items
            .filter(item => item.offsetTop < top)
            .reduce<[LineMapType|null, number]>(
                (p, c) => p[1] < c.offsetTop ? [c, c.offsetTop] : p,
                [null, Number.MIN_SAFE_INTEGER]
            );

        // スクロール位置に最も近い下部DOMを取得
        const [bottomItem] = items
            .filter(item => item.offsetTop >= top)
            .reduce<[LineMapType|null, number]>(
                (p, c) => p[1] > c.offsetTop ? [c, c.offsetTop] : p,
                [null, Number.MAX_SAFE_INTEGER]
            );

        if(topItem && bottomItem)
        {
            // DOMの上下部のDOMとスクロール位置の比率を計算
            const denominator = bottomItem.offsetTop - topItem.offsetTop;
            const numerator = top - topItem.offsetTop;
            const proportion = denominator ? numerator / denominator : 0;

            // 比率分を上部の行番号に加算
            const lineDiff = bottomItem.lineNumber - topItem.lineNumber;
            const lin = Math.floor(lineDiff * proportion) + topItem.lineNumber;

            return lin - 1;
        }
        else
        {
            const [nearItem] = items.reduce<[LineMapType|null, number]>(
                (p, c) => {
                    const a = Math.abs(c.offsetTop - top);
                    return a < p[1] ? [c, a] : p;
                },
                [null, Number.MAX_SAFE_INTEGER]
            );

            return (nearItem?.lineNumber ?? 1) - 1;
        }
    }

    public getPositionFromLineNumber = (win: Window, lineNumber: number) =>
    {
        const lineMap = this.getLineMap(win.document);
        const numbers = lineMap.map(l => l.lineNumber);
        const minNumner = Math.max(...numbers.filter(n => n <= lineNumber));
        const maxNumber = Math.min(...numbers.filter(n => n >= lineNumber));

        const minPos = Math.max(...lineMap.filter(m => m.lineNumber === minNumner).map(m => m.offsetTop));
        const maxPos = Math.min(...lineMap.filter(m => m.lineNumber === maxNumber).map(m => m.offsetTop));

        if(numbers.length === 0)
        {
            return 0;
        }

        const b = (lineNumber - minNumner + 1)  / (maxNumber - minNumner + 1) 
        const diff = (maxPos - minPos) * b + minPos;
        return diff;
    }

}

