import { IDocumentPosition, IEditorDecorateSelection, } from "@kurage/markdown-core";
import { editor as EditorType, IDisposable } from "monaco-editor/esm/vs/editor/editor.api.d.js";

//import { Range } from 'monaco-editor/esm/vs/editor/editor.api';

// @ts-ignore
import { Range } from 'monaco-editor';

export class MonacoDecorator implements IDisposable
{
    private decorations: EditorType.IEditorDecorationsCollection | undefined;

    public constructor(private readonly editor: EditorType.IStandaloneCodeEditor)
    {

    }

    private toRange(sPos: IDocumentPosition, ePos: IDocumentPosition)
    {
        return new Range(sPos.docIndex + 1, sPos.charIndex + 1, ePos.docIndex + 1, ePos.charIndex + 1)
    }

    public decorate(selections: IEditorDecorateSelection[])
    {
        this.decorations = this.editor.createDecorationsCollection(selections.map<EditorType.IModelDeltaDecoration>(r =>
        {
            const { sPos, ePos } = r.selection;
            const cn = r.classes.join(' ')
            return ({
                range: this.toRange(sPos, ePos ?? sPos),
                options: { inlineClassName: 'wp-kurage ' + cn }
            })
        }));

    }

    public clear()
    {
        this.decorations?.clear();
        this.decorations = undefined;
    }

    public dispose()
    {
        this.clear();
    }

}

