import { useEffect, useMemo, useState } from "react";
import { ISettings } from "../ISettings";
import { useMarkdownCoreContext, useMarkdownCoreInstance, useMarkdownEditorAttributeContext, useMarkdownEditorContext, useMarkdownEditorStateContext } from "../..";
import { useComponentViewModels } from "./ComponentViewModelContext";
import { ISettingOptions } from "../ISettingOptions";
import { __ } from "../locale";

export type DialogTemplateProps =
{
    children: React.ReactNode;
    label?: string;
};


export type EditorSettingTemplateProps = {
    settings: ISettings;
    fontFamily: string;
    fontSize: number;
    isLoading: boolean;
    errorMessage: string | undefined;
    onFontFamilyChange: (fontFamily: string) => void;
    onFontSizeChange: (fontSize: number) => void;
};

export const EditorSettingTemplate = ({ChildComponent}: { ChildComponent: React.ComponentType<EditorSettingTemplateProps> }) =>
{
    const { settings } = useMarkdownCoreContext();
    const { fontFamily, fontSize } = settings;
    const [customFontFamily, setCustomFontFamily] = useState(fontFamily);
    const {
        isLoading,
        errorMessage,
        updateFontFamily,
        updateFontSize,
    } = useComponentViewModels().settingsViewModel;

    useEffect(() => {
        setCustomFontFamily(fontFamily);
    }, [fontFamily]);

    return <ChildComponent
                settings={settings}
                fontFamily={customFontFamily}
                fontSize={fontSize}
                isLoading={isLoading}
                errorMessage={errorMessage}
                onFontFamilyChange={(newFontFamily) => {
                    setCustomFontFamily(newFontFamily);
                    updateFontFamily(newFontFamily);
                }}
                onFontSizeChange={(newFontSize) => {
                    updateFontSize(newFontSize);
                }}
            />;
}



export type OtherSettingTemplateProps =
{
    recentCodeLanguages: string[];
    settings: ISettings;
    settingOptions: ISettingOptions;
    updateSettings: (newSettings: Partial<ISettings>) => void;
};

export const OtherSettingTemplate = ({ChildComponent}: { ChildComponent: React.ComponentType<OtherSettingTemplateProps> }) =>
{
    const { settings, settingOptions } = useMarkdownCoreContext();
    const { settingsViewModel } = useComponentViewModels();
    const { updateSettings } = settingsViewModel;

    const  markdownCore = useMarkdownCoreInstance();
    const configurationHelper = markdownCore.getConfigurationHelper();
    const recentCodeLanguages = configurationHelper.getRecentCodeLanguages();



    return <ChildComponent
                settings={settings}
                recentCodeLanguages={recentCodeLanguages}
                settingOptions={settingOptions}
                updateSettings={updateSettings}
            />;
}


export type ControlPanelTemplateProps =
{
    viewMode: "code"|"view"|"both";
    maximized: boolean;
    onPanelChange: (viewMode: "code"|"view"|"both") => void;
    onMaximizeChanged: () => void;
    undo: () => void;
    redo: () => void;
    openFindDialog: () => void;
    openReplaceDialog: () => void;
}
type EditMode = "code"|"view"|"both";
const splitOptions = [
    ['code', 'Code'],
    ['view', 'View'],
    ['both', 'Both']
].map(([k, v]) => ({ value: k, label: v}))
export const ControlPanelTemplate = ({ChildComponent}: { ChildComponent: React.ComponentType<ControlPanelTemplateProps> }) =>
{
    const { editorState, setEditorState } = useMarkdownEditorStateContext();
    const editorContext = useMarkdownEditorContext();

    const { undo, redo, openFindDialog, openReplaceDialog } = editorContext.getEditControl();
    const { maximized, beginnerAssistOpened } = editorState;

    const { viewMode, updateAttributes } = useMarkdownEditorAttributeContext();
    const onPanelChange = (viewMode: EditMode) =>
    {
        updateAttributes({viewMode});
    }
    const onMaximizeChanged = () =>
    {
        setEditorState({ maximized: !maximized});
    }

    return <ChildComponent
                viewMode={viewMode}
                onPanelChange={onPanelChange}
                undo={undo}
                redo={redo}
                openFindDialog={openFindDialog}
                openReplaceDialog={openReplaceDialog}
                maximized={maximized}
                onMaximizeChanged={onMaximizeChanged}
            />;

}

export type LoadingProps = {
    isLoading: boolean;
}

export interface IFormTemplates
{
    DialogTemplate: React.ComponentType<DialogTemplateProps>;
    EditorSettingComponent: React.ComponentType<EditorSettingTemplateProps>;
    OtherSettingComponent: React.ComponentType<OtherSettingTemplateProps>;
    ControlPanelComponent: React.ComponentType<ControlPanelTemplateProps>;
    LoadingComponent: React.ComponentType<LoadingProps>;
}

export const SettingForms = ({ DialogTemplate, EditorSettingComponent, OtherSettingComponent }: IFormTemplates) =>
{
    return (
        <>
            <EditorSettingTemplate ChildComponent={EditorSettingComponent} />

            <DialogTemplate label={__('Open Other Settings', 'markdown-block-editor')}>
                <OtherSettingTemplate ChildComponent={OtherSettingComponent} />
            </DialogTemplate>
        </>
    )
}

export const ControlForms = ({ ControlPanelComponent }: IFormTemplates) =>
{
    return (
        <>
            <ControlPanelTemplate ChildComponent={ControlPanelComponent} />
        </>
    )
}