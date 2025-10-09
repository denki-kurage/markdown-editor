import { ITextSource } from "./ITextSource";
export declare class TextSource implements ITextSource {
    private _lines;
    constructor(str: string);
    lineAt(index: number): string;
    hasLine(index: number): boolean;
}
//# sourceMappingURL=TextSource.d.ts.map