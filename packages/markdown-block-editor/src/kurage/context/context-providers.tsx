import { ComponentType, createContext, ReactNode, useContext, useState } from "react";
import { MarkdownEditorAttributeContextProvider, MarkdownEditorAttributeContextProviderProps } from "./markdown-editor-attribute-context";
import { MarkdownCoreContextProvider } from "./markdown-core-context";
import { MarkdownEditorStateContextProvider } from "./markdown-editor-state-context";
import { MarkdownTokenContextProvider } from "./markdown-token-context";
import { ContextProviderData, IContextService, MarkdownDocumentAttributes } from "./context-service";
import { IComponentViewModels } from "../markdown-react-editor/component-view-models";
import { ComponentViewModelContextProvider } from "../markdown-react-editor/components/ComponentViewModelContext";
import { IMarkdownEditorComponentAdapter } from "../markdown-react-editor/IMarkdownEditorComponentAdapter";
import { MarkdownEditorComponentAdapterProvider } from "./markdown-editor-component-adapter";



export type ContextProvidersProps =
{
    children: ReactNode;
    attributes: MarkdownDocumentAttributes;
    contextService: IContextService;
    contextData: ContextProviderData;
    viewModels: IComponentViewModels,
    clientId: string;
    blockEditorProps: any;
    componentAdapter: IMarkdownEditorComponentAdapter;
    loadingComponent: ComponentType;
};


export const ContextProviders = ({
    children,
    attributes,
    contextService,
    contextData,
    viewModels,
    loadingComponent: LoadingComponent,
    componentAdapter,
    clientId,
    blockEditorProps,
}: ContextProvidersProps) => {
    
    const attributeProps: MarkdownEditorAttributeContextProviderProps = {
        children: undefined,
        attributes,
        standardizeReturnKey: contextService.standardizeReturnKey,
        parseSaveMarkdown: contextService.parseSaveMarkdown,
        updateAttributes: contextService.updateAttributes,
    };

    const coreProps = {

    }

    return (
        <LoadingContext messageNode={<LoadingComponent />}>
            <MarkdownEditorAttributeContextProvider {...attributeProps}>
                <MarkdownCoreContextProvider contextData={contextData} contextService={contextService}>
                    <MarkdownEditorStateContextProvider contextData={contextData} contextService={contextService} clientId={clientId} blockEditorProps={blockEditorProps}>
                        <ComponentViewModelContextProvider value={viewModels}>
                            <MarkdownEditorComponentAdapterProvider value={componentAdapter}>
                                <MarkdownTokenContextProvider>
                                    {children}
                                </MarkdownTokenContextProvider>
                            </MarkdownEditorComponentAdapterProvider>
                        </ComponentViewModelContextProvider>
                    </MarkdownEditorStateContextProvider>
                </MarkdownCoreContextProvider>
            </MarkdownEditorAttributeContextProvider>
        </LoadingContext>
    )
};


export type LoadingContextProps = {
    children: ReactNode;
    isLoading?: boolean;
    messageNode: ReactNode;
}

type LoadingContextValue = {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
};

const LoadingStateContext = createContext<LoadingContextValue | null>(null);

export const useLoadingContext = (): LoadingContextValue =>
{
    const context = useContext(LoadingStateContext);
    if (!context)
    {
        throw new Error("useLoadingContext must be used within LoadingContext");
    }
    return context;
};

export const LoadingContext = ({ children, isLoading: initialIsLoading = false, messageNode }: LoadingContextProps) =>
{
    const [isLoading, setIsLoading] = useState(initialIsLoading);

    return (
        <LoadingStateContext.Provider value={{ isLoading, setIsLoading }}>
            <div style={{ position: "relative" }}>
                {children}
                {isLoading && <LoadingPanel messageNode={messageNode} />}
            </div>
        </LoadingStateContext.Provider>
    )
}

const LoadingPanel = ({ messageNode }: { messageNode: ReactNode }) =>
{
    return (
        <div
            role="status"
            style={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255, 255, 255, 0.75)",
            }}
        >
            {messageNode}
        </div>
    )
}
