import { createContext, useContext, useMemo } from "react";
import { MarkdownDocumentAttributes, MarkdownViewMode } from "./context-service";



/**
 * エディタの永続的な設定や状態を管理するコンテキストです。
 */
export type MarkdownEditorAttributeContextType =
{
    markdown: string;
    editHeight: number | null;
    viewMode: MarkdownViewMode;
    updateAttributes: (attrs: Partial<MarkdownDocumentAttributes>) => void;
    onMarkdownChanged: (v: string) => void;
}

const MarkdownEditorAttributeContext = createContext<MarkdownEditorAttributeContextType>({
    markdown: '',
    editHeight: 500,
    viewMode: "both",
    onMarkdownChanged: () => {},
    updateAttributes: () => {}
});

export const useMarkdownEditorAttributeContext = () => useContext(MarkdownEditorAttributeContext);

export type MarkdownEditorAttributeContextProviderProps =
{
    children: React.ReactNode;
    attributes: MarkdownDocumentAttributes;
    standardizeReturnKey: (markdown: string) => string;
    parseSaveMarkdown: (markdown: string) => string;
    updateAttributes: (attrs: Partial<MarkdownDocumentAttributes>) => void;
}
export const MarkdownEditorAttributeContextProvider = ({ children, attributes, standardizeReturnKey, parseSaveMarkdown, updateAttributes }: MarkdownEditorAttributeContextProviderProps) =>
{
	const { viewMode, editHeight, markdown } = attributes;

	const markdownContextValue = useMemo<MarkdownEditorAttributeContextType>(() => {

		return {
            markdown: standardizeReturnKey(markdown),
            viewMode,
            editHeight,
            updateAttributes,
			onMarkdownChanged: (markdown: string) =>
			{
				const m = standardizeReturnKey(markdown);
                const html = parseSaveMarkdown(m);
				updateAttributes({ markdown: m, html })
			},
		}
	}, [viewMode, editHeight, markdown]);

    return (
        <MarkdownEditorAttributeContext.Provider value={markdownContextValue}>
            {children}
        </MarkdownEditorAttributeContext.Provider>
    );

}
