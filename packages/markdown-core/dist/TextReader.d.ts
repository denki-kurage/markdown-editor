import { IRollbackable } from "./IRollbackable";
import { ITextSource } from "./ITextSource";
export declare class TextReader {
    private _textSource;
    private _position;
    get position(): number;
    get current(): string;
    constructor(textSource: ITextSource);
    /**
     * positionをインクリメントします。
     * ただし、終点を超えることはない点に注意してください。
     */
    moveNext(): boolean;
    /**
     * positionをデクリメントします。
     * ただし、始点(-1)未満には移動しない点に注意してください。
     */
    moveBack(): boolean;
    copy(): TextReader;
    copyBackMode(): TextReader;
    copyNextMode(): TextReader;
    /**
     * positionを指定した位置までまで移動します。
     * 移動先が終点でない有効範囲内であればtrueを返します。
     * falseが返る状況にない場合でもpositionはリセットされません。
     * saveSeek(position)かITrackbackableからリセットしてください。
     */
    seek(position: number): boolean;
    safeSeek(position: number): boolean;
    freeSeek(position: number): TextReader;
    atPosition(position: number): boolean;
    hasCurrent(): boolean;
    /**
     * moveNext()された後のcurrentをコールバックから取得します。
     */
    static lx<TResult>(textReader: TextReader, callback: (line: string) => TResult): TResult | null;
    createRollbackable(): IRollbackable;
    getText(begin: number, end: number): Array<string>;
}
//# sourceMappingURL=TextReader.d.ts.map