import { createContext, useContext } from "react";
import { IMarkdownEditorComponentAdapter } from "../IMarkdownEditorComponentAdapter";

const MarkdownEditorComponentAdapterContext = createContext<IMarkdownEditorComponentAdapter | null>(null);

export const MarkdownEditorComponentAdapterProvider = MarkdownEditorComponentAdapterContext.Provider;

export const useMarkdownEditorComponentAdapter = () => {
    const context = useContext(MarkdownEditorComponentAdapterContext);
    if (!context) {
        throw new Error("useMarkdownEditorComponentAdapter must be used within a MarkdownEditorComponentAdapterProvider");
    }
    return context;
};




