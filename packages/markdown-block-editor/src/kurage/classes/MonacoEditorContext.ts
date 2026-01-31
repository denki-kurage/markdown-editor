import { Monaco } from "@monaco-editor/react";
import { editor, IRange, ISelection as IMonacoSelection, languages, Position, Selection } from 'monaco-editor';
import { IAppContext, IDisposable, IDocumentPosition, IEditorDecorateSelection, IEditorModel, IEventsInitializer, IMarkdownEvents, IReplaceText, IScrollSynchronizer, ISelection as IMdeSelection, IStringCounter, ITextSource, IConfigurationStorage, ConfigurationHelper, IEditControl } from "@kurage/markdown-core"
import { MonacoDecorator } from "./MonacoDecorator";
import { sortedCodeLanguages } from "./CodeLanguages";
import { __ } from "@wordpress/i18n";
import * as eaw from "eastasianwidth";




class Utils
{
    public static fromMonaco(selection: IMonacoSelection): IMdeSelection
    {
        return {
            sPos: {
                docIndex: selection.selectionStartLineNumber - 1,
                charIndex: selection.selectionStartColumn - 1
            },
            ePos: {
                docIndex: selection.positionLineNumber - 1,
                charIndex: selection.positionColumn - 1
            }
        }
    }

    public static toMonaco(selection: IMdeSelection): IMonacoSelection
    {
        const { sPos, ePos } = selection;

        return ({
            selectionStartLineNumber: sPos.docIndex + 1,
            selectionStartColumn: sPos.charIndex + 1,
            positionLineNumber: (ePos?.docIndex ?? sPos.docIndex) + 1,
            positionColumn: (ePos?.charIndex ?? sPos.charIndex) + 1
        })
    }

    public static toMonacoRange(selection: IMdeSelection): IRange
    {
        const { sPos, ePos } = selection;
        const endPosition = ePos ?? sPos;

        return ({
            startLineNumber: sPos.docIndex + 1,
            startColumn: sPos.charIndex + 1,
            endLineNumber: endPosition.docIndex + 1,
            endColumn: endPosition.charIndex + 1
        })
    }

    public static fromMonacoRange(range: IRange): IMdeSelection
    {
        return {
            sPos: {
                docIndex: range.startLineNumber - 1,
                charIndex: range.startColumn - 1
            },
            ePos: {
                docIndex: range.endLineNumber - 1,
                charIndex: range.endColumn - 1
            }
        }
    }
}



export class MonacoEditorContext implements IAppContext, IDisposable, IEventsInitializer<IMarkdownEvents>
{
    private decorator: MonacoDecorator;
    private monacoEventsDisposables: IDisposable[] = [];
    private configurationHelper: ConfigurationHelper;

    public constructor(
        private readonly monaco: Monaco,
        private readonly model: editor.ITextModel,
        private readonly editor: editor.IStandaloneCodeEditor,
        private readonly configurationStorage: IConfigurationStorage)
    {
        this.decorator = new MonacoDecorator(editor);
        this.configurationHelper = new ConfigurationHelper(configurationStorage);
        this.monacoEventsDisposables.push(...this.initInternalRegister());
    }


    private initInternalRegister()
    {

        // [] の終了括弧が閉じるかどうかを捕捉するために必要。
        let previousContent = this.editor.getValue();
        let currentContent = previousContent;


        return [
            this.editor.onDidChangeModelContent(e => {
                previousContent = currentContent;
                currentContent = this.editor.getValue();
            }),
            this.monaco.languages.registerCompletionItemProvider(
                'markdown',
                {
                    triggerCharacters: ['x'],
                    provideCompletionItems: (model: any, pos: any, content: any, token: any) =>
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
                                        detail: __('Create a new table.', 'markdown-block-editor') as string,
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
            /**
             * コードブロックの言語補完完了後、セレクションを選択できない・・・。
             * コマンドで実装する以外の方法がわかるまでそのままにしておく。
             */
            this.monaco.languages.registerCompletionItemProvider(
                'markdown',
                {
                    triggerCharacters: ['`', '~'],
                    provideCompletionItems: (model: any, pos: any, context: any, token: any) =>
                    {
                            const line = model.getLineContent(pos.lineNumber).trim();

                            // pos.column === 4
                            if(line.length === 3 && ['```', '~~~'].includes(line))
                            {
                                // ツールバーやCtrl+Spaceで呼び出された場合は改行追加させない。
                                // 文字でサジェストが呼び出された場合のみ追加時に改行を加える。
                                const chr = context.triggerCharacter;
                                const triple = chr ? chr.repeat(3) : '```';
                                const breaks = chr ? `\n$0\n${triple}\n` : '';
                                
                                const languages = sortedCodeLanguages(this.configurationHelper.getRecentCodeLanguages());
                                const items = languages.map((lang, index) => {
                                    return <languages.CompletionItem>{
                                        sortText: index.toString().padStart(3, '0'),
                                        label: { label: lang.name, detail: ` (${lang.label})`},
                                        kind: this.monaco.languages.CompletionItemKind.Snippet,
                                        detail: __(`Insert code block for ${lang.label}.`, 'markdown-block-editor') as string,
                                        insertText: `${lang.name}${breaks}`,
                                        insertTextRules: this.monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                        command: { id: 'markdown.code.changed', arguments: [lang.name] },
                                        documentation: `${triple}${lang.name}\n${__('Your code here...', 'markdown-block-editor')}\n${triple}`,
                                    };
                                });

                                return { suggestions: items };
                            }
                    }
                }
            ),

            this.monaco.languages.registerCompletionItemProvider(
                'markdown',
                {
                    triggerCharacters: ['!', '['],
                    provideCompletionItems: (model: any, pos: any, context: any, token: any) =>
                    {
                        const triggerChar = context.triggerCharacter;
                        
                        if(!triggerChar)
                        {
                            return;
                        }

                        const snippet = `[$1]($0)`;
                        const isImage = triggerChar === '!';
                        const label = isImage ? __('add image', 'markdown-block-editor') + '![](url)' : __('add link', 'markdown-block-editor') + '[](url)';
                        let range: IRange | undefined;
                        
                        if(!isImage)
                        {
                            const hasCloseBraket = currentContent.length === previousContent.length + 2;

                            range = new this.monaco.Range(
                                pos.lineNumber,
                                pos.column - 1,
                                pos.lineNumber,
                                hasCloseBraket ? pos.column + 1 : pos.column
                            );
                        }

                        return {
                            suggestions: [{
                                label,
                                kind: this.monaco.languages.CompletionItemKind.Snippet,
                                detail: label,
                                insertText: snippet,
                                insertTextRules: this.monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                range
                            } as any]
                        }
                    }
                }
            ),
            
            this.monaco.editor.addEditorAction({
                id: 'markdown.code.changed',
                label: 'RECENT CODE',
                run: (editor: any, ...args: any[]) =>
                {
                    this.configurationHelper.updateRecentCodeLanguage(args[0]);
                }
            }),

            this.monaco.languages.registerCompletionItemProvider(
                'markdown',
                {
                    triggerCharacters: ['#'],
                    provideCompletionItems: (model: any, pos: any, context: any, token: any) =>
                    {
                        if(context.triggerCharacter === '#')
                        {
                            const line = model.getLineContent(pos.lineNumber);
                            const leadingHashes = line.match(/^#+/)?.[0]?.length ?? 0;
                            const range = new this.monaco.Range(pos.lineNumber, 1, pos.lineNumber, leadingHashes + 1);
                            const text = "\n" + model.getLinesContent().slice(0, Math.max(0, pos.lineNumber - 1)).join("\n");
                            const lastSharps = text.match(/\n#+/g)?.pop()?.trim() || '';
                            const currentDeps = lastSharps.length;
                            const items = [...Array(6).keys()].map((i) => {
                                const index = i + 1;
                                const Heading = '#'.repeat(index);
                                const isCurrent = index === currentDeps;
                                const isLower = index - 1 === currentDeps;
                                const detail = isCurrent ? __('current level', 'markdown-block-editor') : isLower ? __('lower level', 'markdown-block-editor') : '';
                                const preselect = index === Math.min(leadingHashes, 6);
                                return <any>{
                                    preselect,
                                    label: `${Heading} ${index} ${detail ? `- ${detail}` : ''}`,
                                    kind: this.monaco.languages.CompletionItemKind.Snippet,
                                    detail: __('Insert Heading level ${index} ${detail}.', 'markdown-block-editor') as string,
                                    insertText: Heading,
                                    additionalTextEdits: [{ range, text: '' }],
                                    //range
                                };
                            });

                            return { suggestions: items };
                        }
                    }
                }
            ),

            this.monaco.languages.registerSelectionRangeProvider(
                'markdown',
                {

                    provideSelectionRanges: (model: any, positions: any) =>
                    {
                        const ranges = positions.map((pos: any) =>
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
    }

    public initializeEvents(events: IMarkdownEvents): IDisposable
    {
        const disposable = [

            this.editor.getModel()?.onDidChangeContent(e => {
                const { startColumn, startLineNumber } = e.changes[0].range;
                events.textChanged({ startPosition: { docIndex: startLineNumber - 1, charIndex: startColumn - 1 } });
            }),

            this.editor.onDidChangeCursorSelection(e => {
                const { startColumn, startLineNumber } = e.selection;
                events.selectChanged({ startPosition: { docIndex: startLineNumber - 1, charIndex: startColumn - 1 } });
            }),

            this.editor.onDidChangeCursorPosition(e => {
                const pos = e.position;
                events.cursorChanged(this.model.getOffsetAt(pos));
            }),

        ];

        return { dispose: () => disposable.forEach(d => d?.dispose())}
    }

    public dispose(): void
    {
        this.monacoEventsDisposables.forEach(d => d.dispose());
    }
    
    public getEventsInitializer(): IEventsInitializer<IMarkdownEvents>
    {
        return this;
    }

    public getEditorName(): string
    {
        return "Monaco Editor";
    }

    public getTextSource(): ITextSource
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
        //return str => str.length;
        return str => eaw.length(str);
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
                    return selections.map(s => Utils.fromMonaco(s));
                }
                return [];
            },
            setSelections: (selections) =>
            {
                if(selections.some(s => s.ePos === undefined))
                {
                    throw new Error("MonacoEditorContext#setSelections: ePos is required.");
                }

                //const sl = selections.length ? selections : [{ sPos: { docIndex: 0, charIndex: 0 } }];
                if(selections.length)
                {
                    const newSelections = selections.map(s => Utils.toMonaco(s));
                    this.editor.setSelections(newSelections);
                }
                this.editor.focus();
            },
            replaces: (items: IReplaceText[], reselect) =>
            {
                const edits = items.map(item => {
                    const { area, text } = item;
                    const r: IRange = Utils.toMonacoRange(area);

                    return {
                        forceMoveMarkers: false,
                        text: text,
                        range: r
                    }
                });

                //this.model.applyEdits(edits);
                const r: undefined | editor.ICursorStateComputer  = reselect ? options => {
                        return options.map((opt, idx) => {
                            const { range, text } = opt;
                            const newSelection = reselect(text, Utils.fromMonacoRange(range));
                            const ms = Utils.toMonaco(newSelection);
                            return new Selection(ms.selectionStartLineNumber, ms.selectionStartColumn, ms.positionLineNumber, ms.positionColumn);
                        })
                    } : undefined;
                
                const computedSelections = this.model.pushEditOperations(
                    null,
                    edits,
                    r!
                );
                if(computedSelections)
                {
                    this.editor.setSelections(computedSelections);
                }
                this.editor.focus();
            },
            rewrite: (items: IReplaceText[]) =>
            {
                const edits: editor.IIdentifiedSingleEditOperation[] = items.map(item => {
                    const { area, text } = item;
                    const range: IRange = Utils.toMonacoRange(area);
                    return ({
                        range,
                        text
                    })
                });

                this.model.applyEdits(edits)
            },
            getText: (pos) =>
            {
                if(!pos)
                {
                    return this.model.getValue();
                }
                
                return this.model.getValueInRange(Utils.toMonacoRange(pos));
            },
            positionToIndex: (position: IDocumentPosition): number =>
            {
                return this.model.getOffsetAt(new Position(position.docIndex + 1, position.charIndex + 1));
            },
            indexToPosition: (docIndex: number): IDocumentPosition =>
            {
                const pos = this.model.getPositionAt(docIndex);

                return {
                    docIndex: pos.lineNumber - 1,
                    charIndex: pos.column - 1
                }
            },
            scroll: (docIndex: number) =>
            {
                this.editor.revealLine(docIndex + 1, editor.ScrollType.Smooth);
            }
        }
    }

    public getEditControl(): IEditControl
    {
        const editor = this.editor;
        return ({
            undo: () => editor.trigger('markdown-block-editor', 'undo', null),
            redo: () => editor.trigger('markdown-block-editor', 'redo', null),
            openSuggest: () => editor.trigger('markdown-block-editor', 'editor.action.triggerSuggest', null),
            openFindDialog: () => editor?.getAction('actions.find')?.run(),
            openReplaceDialog: () => editor?.getAction('editor.action.startFindReplaceAction')?.run()
        })
    }
}


