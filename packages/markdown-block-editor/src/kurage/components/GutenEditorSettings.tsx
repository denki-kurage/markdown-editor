import { Button, CheckboxControl, Flex, FlexItem, Modal, RangeControl, SelectControl, Spinner, TextControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { EditorSettingTemplateProps, SettingForms, IFormTemplates, OtherSettingTemplateProps, DialogTemplateProps, ControlForms, ControlPanelTemplateProps, LoadingProps } from "../markdown-react-editor/components/FormTemplates";
import { useMemo, useState } from "react";
import { DefaultControlPanel, DefaultDialogComponent, DefaultEditorSettingForm, DefaultOtherSettingsForm } from "../markdown-react-editor/components/DefaultForms";
import { DefaultLoading, LoadingOverlay } from "../markdown-react-editor/components/Loading";


const fontFamilies = [
    { label: '', value: '' },
    ...['Consolas', 'Courier New', 'Inconsolata', 'Monaco', 'Cascadia Code', 'Meiryo UI', 'MS ゴシック', 'BIZ UDゴシック', 'Noto Sans CJK SC/TC', 'Microsoft JhengHei', 'Malgun Gothic'].map(x => ({label: x, value: x}))
];
const fontSizes = [...Array(30).keys()].map(x => (x + 4).toString()).map(x => ({label: x, value: x}))


export const GutenDialogComponent = ({ label, children }: DialogTemplateProps) =>
{
    const [isOpenState, setIsOpenState] = useState(false);
    return (
        <>
            <Button variant="primary" style={{width: '100%'}} onClick={() => setIsOpenState(true)}>{label}</Button>
            { isOpenState && <Modal onRequestClose={() => setIsOpenState(false)}>
                { children }
            </Modal> }
        </>
    )
}

export const GutenEditorSettings = ({ settings, fontFamily, fontSize, isLoading, errorMessage, onFontFamilyChange, onFontSizeChange }: EditorSettingTemplateProps) =>
{

    return (
        <>
            <p>{isLoading ? <><Spinner />{__('Updating settings...', 'markdown-block-editor')}</> : errorMessage || __('Settings', 'markdown-block-editor') }</p>

            {/* 世界で使用される等幅フォントの一覧 */}
            <SelectControl
                label={__('Font Family', 'markdown-block-editor')}
                options={fontFamilies}
                value={fontFamily}
                onChange={(e: any) => onFontFamilyChange(e)}
                />
            
            {/* 独自の等幅フォントを直接入力 */}
            <InputBox
                text="Apply"
                value={fontFamily}
                onChanged={onFontFamilyChange}
                onClicked={() => onFontFamilyChange(fontFamily)} />

            
            <SelectControl
                label={__('Font Size', 'markdown-block-editor')}
                options={fontSizes}
                value={(fontSize || 12).toString()}
                onChange={(e: any) => onFontSizeChange(parseInt(e))} />
            
        </>
    )
}


export const GutenOtherSettings = ({ settings, recentCodeLanguages, settingOptions, updateSettings }: OtherSettingTemplateProps) =>
{
    const { frontTheme, adminTheme, monacoTheme, prismTheme, previewInterval, useSnippets } = settings;
    const { frontThemes, adminThemes, prismThemes, monacoThemes } = settingOptions;
    const { frontThemeOptions, adminThemeOptions, prismThemeOptions, monacoThemeOptions } = useMemo(() => {
        const frontThemeOptions = frontThemes.map(t => ({ value: t.key, label: t.name }));
        const adminThemeOptions = adminThemes.map(t => ({ value: t.key, label: t.name }));
        const prismThemeOptions = prismThemes.map(t => ({ value: t.key, label: t.name }));
        const monacoThemeOptions = monacoThemes.map(t => ({ value: t.key, label: t.name }));
        return { frontThemeOptions, adminThemeOptions, prismThemeOptions, monacoThemeOptions };
    }, [settingOptions]);

    return (
        <>
            <div>
                
                <p>{recentCodeLanguages.join(', ')}</p>

                <RangeControl
                    label={__('Preview Interval', 'markdown-block-editor')}
                    value={previewInterval}
                    onChange={v => updateSettings({previewInterval: v})}
                    max={5000}
                    min={500}
                    />

                <SelectControl
                    label={__('Front Theme', 'markdown-block-editor')}
                    options={frontThemeOptions}
                    value={frontTheme}
                    onChange={value => updateSettings({ frontTheme: value })}
                />

                <SelectControl
                    label={__('Admin Theme', 'markdown-block-editor')}
                    options={adminThemeOptions}
                    value={adminTheme}
                    onChange={value => updateSettings({ adminTheme: value })}
                />

                <SelectControl
                    label={__('Monaco Editor Theme', 'markdown-block-editor')}
                    options={monacoThemeOptions}
                    value={monacoTheme}
                    onChange={value => updateSettings({ monacoTheme: value })}
                />

                <SelectControl
                    label={__('Prism Theme', 'markdown-block-editor')}
                    options={prismThemeOptions}
                    value={prismTheme}
                    onChange={value => updateSettings({ prismTheme: value })}
                />

                <CheckboxControl
                    label={__('Use Snippets', 'markdown-block-editor')}
                    checked={useSnippets}
                    onChange={v => updateSettings({ useSnippets: v })}
                />


                <p>{ __('This will update the options used globally, but you will need to reload the page for the changes to take effect.', 'markdown-block-editor') }</p>


            </div>
        </>
    )
}

type EditMode = "code"|"view"|"both";
const splitOptions = [
    ['code', 'Code'],
    ['view', 'View'],
    ['both', 'Both']
].map(([k, v]) => ({ value: k, label: v}))

export const GutenControlPanel = ({ maximized, viewMode, undo, redo, openFindDialog, openReplaceDialog, onMaximizeChanged, onPanelChange }: ControlPanelTemplateProps) =>
{

    return (
        <>
            <div className="markdown-block-editor-button-group markdown-block-editor-margin-vertical" >
                <Button variant="primary" onClick={undo}>{__('undo', 'markdown-block-editor')}</Button>
                <Button variant="primary" onClick={redo}>{__('redo', 'markdown-block-editor')}</Button>
            </div>

            <div className="markdown-block-editor-button-group markdown-block-editor-margin-vertical" >
                <Button variant="primary" className="markdown-block-editor-button-vertical" onClick={openFindDialog}>{__('find', 'markdown-block-editor')}</Button>
                <Button variant="primary" className="markdown-block-editor-button-vertical" onClick={openReplaceDialog}>{__('replace', 'markdown-block-editor')}</Button>
            </div>

            <Button variant="primary" className="markdown-block-editor-button-vertical markdown-block-editor-margin-vertical" onClick={onMaximizeChanged}>
                { maximized ? __('Restore the editor to normal size.', 'markdown-block-editor') : __('Maximize the editor.', 'markdown-block-editor') }
            </Button>


            <SelectControl
                className="markdown-block-editor-margin-vertical"
                options={splitOptions}
                value={viewMode}
                onChange={v => onPanelChange(v as EditMode)}
                />
        </>
    )
}

export const GutenLoading = ( { isLoading }: LoadingProps ) => {
    if ( ! isLoading ) {
        return null;
    }

    return (
        <LoadingOverlay>
            <Spinner style={ { width: 100, height: 100 } } />
        </LoadingOverlay>
    );
};



type InputBoxProps =
{
    text: string;
    value: string;
    onChanged: (value: string) => void;
    onClicked: () => void;
}

const InputBox = ({text, value, onChanged, onClicked}: InputBoxProps) =>
{
    return (
        <Flex gap="1" align="center">
            <FlexItem isBlock>
                <TextControl
                    __nextHasNoMarginBottom
                    value={ value }
                    onChange={onChanged}
                />
            </FlexItem>
            <FlexItem>
                <Button
                    variant="primary"
                    onClick={onClicked}
                    size="compact"
                >
                    { text }
                </Button>
            </FlexItem>
        </Flex>
    );
}


const gutenForms: IFormTemplates = {
    DialogTemplate: GutenDialogComponent,
    EditorSettingComponent: GutenEditorSettings,
    OtherSettingComponent: GutenOtherSettings,
    ControlPanelComponent: GutenControlPanel,
    LoadingComponent: GutenLoading
}

const defaultForms: IFormTemplates = {
    DialogTemplate: DefaultDialogComponent,
    EditorSettingComponent: DefaultEditorSettingForm,
    OtherSettingComponent: DefaultOtherSettingsForm,
    ControlPanelComponent: DefaultControlPanel,
    LoadingComponent: DefaultLoading
}

export const EditorSettings = () =>
{
    return (
        <div>
            <SettingForms {...gutenForms} />
            <div>-----------</div>
            <SettingForms {...defaultForms} />
        </div>
    )
}


export const ControlPanels = () =>
{
    return (
        <>
            <ControlForms {...gutenForms} />
            <div>-----------</div>
            <ControlForms {...defaultForms} />
        </>
    )
}