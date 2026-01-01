import { createContext, useContext, useMemo, useState } from "@wordpress/element";
import { parseSaveMarkdown } from "../components/parser";

export type MarkdownContextProps =
{
    markdown: string;
    editHeight: number,
    viewMode: "code" | "view" | "both";
    setAttributes: (value: any) => void,
    onMarkdownChanged: (v: string) => void;
}

const Context = createContext<MarkdownContextProps>({
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

    
	const markdownContextValue = useMemo<MarkdownContextProps>(() => {

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
