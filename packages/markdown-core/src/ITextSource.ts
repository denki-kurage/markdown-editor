

/**
 * 1行レベルでテキストを取得するインターフェース
 */
export interface ITextSource
{
	lineAt(line: number): string;
	hasLine(line: number): boolean;
}

