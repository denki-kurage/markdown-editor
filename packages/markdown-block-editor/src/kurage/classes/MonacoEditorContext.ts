import { Monaco } from "@monaco-editor/react";
import { editor, IRange, languages } from 'monaco-editor';
import { IAppContext, IDisposable, IEditorDecorateSelection, IEditorModel, IEventsInitializer, IMarkdownEvents, IReplaceText, IScrollSynchronizer, IStringCounter, ITextSource } from "@mde/markdown-core"
import { MonacoDecorator } from "./MonacoDecorator";




export class MonacoEventsInitializer implements IEventsInitializer<IMarkdownEvents>
{
    public constructor(
        private readonly monaco: Monaco,
        private readonly model: editor.ITextModel,
        private readonly editor: editor.IStandaloneCodeEditor)
    {
        
    }


    public initializeEvents(events: IMarkdownEvents): IDisposable
    {
        const disposables = [

        this.editor.getModel()?.onDidChangeContent(e => {
            const { startColumn, startLineNumber } = e.changes[0].range;
            events.textChanged({ startPosition: { docIndex: startLineNumber, charIndex: startColumn } });
        }),

        this.editor.onDidChangeCursorSelection(e => {
            const { startColumn, startLineNumber } = e.selection;
            events.selectChanged({ startPosition: { docIndex: startLineNumber, charIndex: startColumn } });
        }),

        this.editor.onDidChangeCursorPosition(e => {
            const pos = e.position;
            events.cursorChanged(this.model.getOffsetAt(pos));
        }),

        this.monaco.languages.registerCompletionItemProvider(
            'markdown',
            {
                triggerCharacters: ['x'],
                provideCompletionItems: (model, pos, content, token) =>
                {
                    if(pos.column === 3)
                    {
                        const txt = model.getLineContent(pos.lineNumber).substring(0, 2);
                        const nbr = Number(txt.charAt(0));
    
                        if(!isNaN(nbr) && txt.charAt(1) === 'x')
                        {
                            const items = [...Array(9).keys()].map(_ => {
    
                                const len = _ + 1;
                                const line = '|' + 'x'.repeat(nbr).split('').join('|') + '|';
                                const row = line.replace(/x/g, '   ');
                                const alignment = line.replace(/x/g, '---');
    
                                const table = [
                                    row,
                                    alignment,
                                    ...[...Array(len).keys()].map(_ => row)
                                ]
                                
                                // TODO: 改行コードってそのまま挿入するのまずそう、フォーマッターもそうだけど、検証が必要。
                                .join("\n");
    
                                const doc = table.replace(/   /g, ' A ');
    
                                return <languages.CompletionItem>{
                                    label: `${nbr}x${len}`,
                                    kind: this.monaco.languages.CompletionItemKind.Snippet,
                                    detail: `Create a new table.`,
                                    documentation: doc,
                                    insertText: table
                                };
                            });
                            return { suggestions: items };
                        }
                    }
                }
            }
        ),

        this.monaco.languages.registerSelectionRangeProvider(
            'markdown',
            {

                provideSelectionRanges: (model, positions) =>
                {
                    const ranges = positions.map(pos =>
                    {
                        const charIndex = pos.column - 1;
                        const docIndex = pos.lineNumber - 1;

                        return ({
                            range: new this.monaco.Range(docIndex + 1, charIndex + 1, docIndex + 1, charIndex + 1) as IRange
                        });
                    });

                    return [ranges];
                    return null;
                },
                
            }
        )

        ]

        return { dispose: () => disposables.forEach(d => d?.dispose())}

    }

}



export class MonacoEditorContext implements IAppContext
{
    private decorator: MonacoDecorator;

    public constructor(
        private readonly monaco: Monaco,
        private readonly model: editor.ITextModel,
        private readonly editor: editor.IStandaloneCodeEditor)
    {
        this.decorator = new MonacoDecorator(editor);
    }
    
    public getEventsInitializer(): IEventsInitializer<IMarkdownEvents>
    {
        return new MonacoEventsInitializer(this.monaco, this.model, this.editor)
    }

    public getEditorName(): string
    {
        return "Monaco Editor";
    }

    public getTextSource(): ITextSource | undefined
    {
        const self = this;

        return {
            lineAt: (line: number) =>
            {
                return self.model.getLineContent(line + 1);
            },
            hasLine: (line: number) =>
            {
                const count = self.model.getLineCount();
                return line >= 0 && line < count 
            }
        }
    }

    public getStringCounter(): IStringCounter
    {
        return str => {
            let len = 0;
            let strSrc = escape(str);
            for(let i = 0; i < strSrc.length; i++, len++){
                if(strSrc.charAt(i) === "%"){
                    if(strSrc.charAt(++i) === "u"){
                        i += 3;
                        len++;
                    }
                    i++;
                }
            }
            return len;
        }
    }

    public getAppConfig()
    {
        return {}
    }

    public returnKey()
    {
        return this.editor.getModel()?.getEOL() ?? "\n";
    }

    public getDecorator()
    {
        return {
            decorate: (selections: IEditorDecorateSelection[]) =>
            {
                this.decorator.decorate(selections);
            },
            clearDecorate: () =>
            {
                this.decorator.clear();
            },
        }
    }

    public getScrollSynchronizer(): IScrollSynchronizer
    {
        return {
            scroll: (lineNumber: number) =>
            {
                const ln = this.editor.getVisibleRanges()?.[0].startLineNumber;
                if(lineNumber !== ln)
                {
                    const pos = this.editor.getTopForPosition(lineNumber + 1, 1);
                    this.editor.setScrollTop(pos, editor.ScrollType.Immediate);
                }
            },
            addScrollEventListener: (scrolled: (lineNumber: number) => void) =>
            {
                return this.editor.onDidScrollChange(e => {
                    const ln = this.editor.getVisibleRanges()?.[0].startLineNumber;
                    if(ln)
                    {   
                        scrolled(ln - 1)
                    }
                })
            }
        }
    }

    public getEditorModel(): IEditorModel
    {
        return {
            getCursor: () =>
            {
                const selection = this.editor.getSelection();

                if(selection)
                {
                    return {
                        docIndex: selection.positionLineNumber - 1,
                        charIndex: selection.positionColumn - 1
                    }
                }
            },
            getSelections: () =>
            {
                const selections = this.editor.getSelections();
                if(selections)
                {
                    return selections.map(s => ({
                        sPos: { docIndex: s.selectionStartLineNumber - 1, charIndex: s.selectionStartColumn - 1 },
                        ePos: { docIndex: s.positionLineNumber - 1, charIndex: s.positionColumn - 1 }
                    }))
                }
                return [];
            },
            setSelections: (selections) =>
            {
                const sl = selections.length ? selections : [{ sPos: { docIndex: 0, charIndex: 0 } }];
                const newSelections = sl.map(s => {
                    const { docIndex: selectionStartLineNumber, charIndex: selectionStartColumn } = s.sPos;
                    const { docIndex: positionLineNumber, charIndex: positionColumn } = s.ePos ?? {...s.sPos};
                    return {
                        selectionStartLineNumber: selectionStartLineNumber + 1,
                        selectionStartColumn: selectionStartColumn + 1,
                        positionLineNumber: positionLineNumber + 1,
                        positionColumn: positionColumn + 1
                    };
                })

                this.editor.setSelections(newSelections);
                this.editor.focus();
            },
            replaces: (items: IReplaceText[]) =>
            {
                const edits = items.map(item => {
                    const { area, text } = item;
                    const { ePos, sPos } = area;
                    const endPosition = ePos ?? sPos;

                    const r: IRange =
                    {
                        startLineNumber: sPos.docIndex + 1,
                        endLineNumber: endPosition.docIndex + 1,
                        startColumn: sPos.charIndex + 1,
                        endColumn: endPosition.charIndex + 1
                    }

                    return {
                        forceMoveMarkers: false,
                        text: text,
                        range: r
                    }
                });

                this.model.applyEdits(edits);
                this.editor.focus();
            },
            getText: (pos) =>
            {
                const { sPos, ePos } = pos;
                const endPosition = ePos ?? sPos;

                return this.model.getValueInRange({
                    startLineNumber: sPos.docIndex + 1,
                    endLineNumber: endPosition.docIndex + 1,
                    startColumn: sPos.charIndex + 1,
                    endColumn: endPosition.charIndex + 1
                });
            },
            /*
            positionToIndex: (position: IDocumentPosition): number =>
            {
                return this.model.getOffsetAt(new Position(position.docIndex + 1, position.charIndex + 1));
            },
            indexToPosition: (docIndex: number): IDocumentPosition | undefined =>
            {
                const pos = this.model.getPositionAt(docIndex);
                if(pos)
                {
                    return {
                        docIndex: pos.lineNumber - 1,
                        charIndex: pos.column - 1
                    }
                }
                return undefined;
            },
            */
            scroll: (docIndex: number) =>
            {
                this.editor.revealLine(docIndex + 1, editor.ScrollType.Smooth);
            }
        }
    }
}


