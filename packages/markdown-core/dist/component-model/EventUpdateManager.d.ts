/**
 *
 * ドキュメント変更におけるイベントを一元管理します。
 * エディタがアクティブ化されたり、コマンドが実行された場合など即時にイベントを発生させるものと、
 * テキスト変更、セレクション変更など遅延して発生させるものがあります。
 * update()が即時、lazyUpdate()が遅延でイベントを発生させます。
 *
 * @see https://github.com/Microsoft/vscode-extension-samples/blob/master/decorator-sample/src/extension.ts
 */
export declare class EventUpdateManager {
    readonly interval: number;
    private _timeout;
    readonly updated: Array<() => void>;
    constructor(interval?: number);
    /**
     *
     * @param e
     */
    lazyUpdate(): void;
    /**
     * 即時更新を実行します。
     * @param e
     */
    update(): void;
    /**
     * タイマーがセットしてある場合のみ即時更新します。
     * @param e
     */
    hasUpdate(): void;
    /**
     * オーバーライドする場合は派生元を呼び出してください。
     */
    protected onUpdated(): void;
    dispose(): void;
    clearTimeout(): void;
}
//# sourceMappingURL=EventUpdateManager.d.ts.map