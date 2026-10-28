import { IAppContext, IConfigurationStorage, MarkdownCore } from "@kurage/markdown-core";
import { ISettingOptions } from "../store/ISettingOptions";
import { ISettings } from "../store/ISettings";
import { IMarkdownBlockEditorState } from "../store/type";


export type ContextProviderData =
{
    attributes: MarkdownDocumentAttributes;
    settings: ISettings;
    settingOptions: ISettingOptions;
    editorState: IMarkdownBlockEditorState;
    configurationStorage: IConfigurationStorage;
}

export interface IContextService
{
    createMarkdownCore: (editorContext: IAppContext, configurationStorage: IConfigurationStorage) => MarkdownCore;
    setEditorState(clientId: string, editorState: Partial<IMarkdownBlockEditorState>): void;
    deleteEditorState(clientId: string): void;
    parseSaveMarkdown(markdown: string): string;
    standardizeReturnKey: (markdown: string) => string;
    updateAttributes: (attributes: Partial<MarkdownDocumentAttributes>) => void;
    
}


export type MarkdownContextServices =
{
    contextService: IContextService;
    contextData: ContextProviderData;
}


export type MarkdownDocumentAttributes =
{
    markdown: string;
    editHeight: number | null;
    viewMode: MarkdownViewMode;
    html: string;
};
export type MarkdownViewMode = "code" | "view" | "both";

