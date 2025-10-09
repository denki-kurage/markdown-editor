import { createContext, useContext, useMemo, useState } from "react";
import { parseSaveMarkdown } from "../components/parser";

export type MarkdownContext =
{
    markdown: string;
    editHeight: number,
    viewMode: "code" | "view" | "both";
    setAttributes: (value: any) => void,
    onMarkdownChanged: (v: string) => void;
}

const Context = createContext<MarkdownContext>({
    markdown: '',
    editHeight: 500,
    viewMode: "both",
    setAttributes: v => {},
    onMarkdownChanged: () => {},
});

export const MarkdownContextProvider = Context.Provider;
export const useMarkdownContext = () => useContext(Context);


export const MarkdownContextProviderWrapper = ({ children, attributes, setAttributes, standardizeReturnKey }: any) =>
{
	const { viewMode, splitSize, editHeight, markdown } = attributes;

    
	const markdownContextValue = useMemo<MarkdownContext>(() => {

		return {
            markdown: standardizeReturnKey(markdown),
            viewMode,
            editHeight,
            setAttributes,
			onMarkdownChanged: (markdown: string) =>
			{
				const m = standardizeReturnKey(markdown);
                const html = parseSaveMarkdown(m);
				setAttributes({ markdown: m, html })
			},
		}
	}, [setAttributes, viewMode, editHeight, markdown]);

    return (
        <MarkdownContextProvider value={markdownContextValue}>
            {children}
        </MarkdownContextProvider>
    );

}

/*
import { Markdown, MarkdownTableContent } from "md-table-editor";
import { createContext, useContext, useMemo, useState } from "react";
import { parseSaveMarkdown } from "../components/parser/parser";

export type MarkdownContext =
{
    markdown: string;
    index: number;
    markdownApp: Markdown | undefined;
    currentTable: MarkdownTableContent | undefined;
    tables: MarkdownTableContent[];
    editHeight: number,
    viewMode: "code" | "view" | "both";
    onValueChanged: (v: string) => void;
    onTablesChanged: (tables: MarkdownTableContent[]) => void;
    onCurrentTableChanged: (table?: MarkdownTableContent) => void;
    onCursorPositionChanged: (position: number) => void;
    onAppInitialized: (markdown: Markdown) => void;
}

const Context = createContext<MarkdownContext>({
    markdown: '',
    markdownApp: undefined,
    index: 0,
    currentTable: undefined,
    tables: [],
    editHeight: 500,
    viewMode: "both",
    onValueChanged: () => {},
    onTablesChanged: () => {},
    onCurrentTableChanged: () => {},
    onCursorPositionChanged: () => {},
    onAppInitialized: () => {},
});

export const MarkdownContextProvider = Context.Provider;
export const useMarkdownContext = () => useContext(Context);


export const MarkdownContextProviderWrapper = ({ children, attributes, setAttributes, standardizeReturnKey }) =>
{
	const { viewMode, splitSize, editHeight } = attributes;
    const markdown = standardizeReturnKey(attributes.markdown);

    const [index, setIndex] = useState(0);
    const [markdownApp, setMarkdownApp] = useState<Markdown>();
    const [tables, setTables] = useState<MarkdownTableContent[]>([]);
    const [currentTable, setCurrentTable] = useState<MarkdownTableContent|undefined>();
    
	const markdownContextValue = useMemo<MarkdownContext>(() => {
		return {
            index,
            markdown,
            tables,
            currentTable,
            viewMode,
            editHeight,
            markdownApp,
			onValueChanged: (markdown: string) =>
			{
				const m = standardizeReturnKey(markdown);
                const html = parseSaveMarkdown(m);
				setAttributes({ markdown: m, html })
			},
			onTablesChanged: setTables,
			onCurrentTableChanged: setCurrentTable,
			onCursorPositionChanged: setIndex,
			onAppInitialized: setMarkdownApp
		}
	}, [setAttributes, index, markdownApp, tables, currentTable, markdownApp, viewMode, editHeight, markdown]);

    return (
        <MarkdownContextProvider value={markdownContextValue}>
            {children}
        </MarkdownContextProvider>
    );

}

*/