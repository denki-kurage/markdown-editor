import { MarkdownTableContent } from "./MarkdownTableContent";
/**
 * テーブルとの相互変換を表します。
 * Markdownのテーブル以外に、エクセルやHTMLテーブルなどとの変換を想定してます。
 */
export interface ITableConverter<TDataType> {
    fromTable(table: MarkdownTableContent): TDataType;
    toTable(data: TDataType): MarkdownTableContent;
}
//# sourceMappingURL=ITableConverter.d.ts.map