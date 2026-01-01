import { createContext, useContext } from "@wordpress/element"

export type LineNumberContextType =
{
    lineNumber: number;
    updateLineNumber: (line: number) => void;
}

const context = createContext<LineNumberContextType>(undefined as any);
export const { Provider: LineNumberContextProvider } = context;

export const useLineNumberContext = () =>
{
    return useContext(context)
}

