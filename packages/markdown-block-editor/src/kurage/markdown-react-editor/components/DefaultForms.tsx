import { __ } from "../locale";
import { ControlPanelTemplateProps, DialogTemplateProps, EditorSettingTemplateProps, OtherSettingTemplateProps } from "./FormTemplates";
import { useState } from "react";

const fontFamilies = [
    { label: "", value: "" },
    ...[
        "Consolas",
        "Courier New",
        "Inconsolata",
        "Monaco",
        "Cascadia Code",
        "Meiryo UI",
        "MS ゴシック",
        "BIZ UDゴシック",
        "Noto Sans CJK SC/TC",
        "Microsoft JhengHei",
        "Malgun Gothic",
    ].map(fontFamily => ({ label: fontFamily, value: fontFamily })),
];

const fontSizes = Array.from({ length: 30 }, (_, index) => index + 4);

const editorSettingFormStyles = `
    .editor-setting-form {
        width: 100%;
    }

    .editor-setting-form__field {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-bottom: 12px;
    }

    .editor-setting-form__field select,
    .editor-setting-form__field input[type="range"],
    .editor-setting-form__custom-font input {
        box-sizing: border-box;
        width: 100%;
    }

    .editor-setting-form__custom-font {
        display: flex;
        gap: 8px;
        width: 100%;
        margin-bottom: 12px;
    }

    .editor-setting-form__custom-font input {
        flex: 1;
        min-width: 0;
    }

    .editor-setting-form__custom-font button {
        flex-shrink: 0;
    }

    .editor-setting-form__other-settings {
        margin-top: 12px;
    }

    .editor-setting-form__other-settings > button {
        width: 100%;
    }

    .editor-setting-form__other-settings-panel {
        width: 100%;
        margin-top: 12px;
    }

    .editor-setting-form__extension-setting {
        width: 100%;
        margin-bottom: 12px;
    }

    .editor-setting-form__checkbox {
        flex-direction: row;
        align-items: center;
        gap: 8px;
    }
`;

export const DefaultEditorSettingForm = ({ settings, fontFamily, fontSize, isLoading, errorMessage, onFontFamilyChange, onFontSizeChange }: EditorSettingTemplateProps) =>
{
    return (
        <div className="editor-setting-form">
            <style>{editorSettingFormStyles}</style>
            <p aria-live="polite">
                {isLoading
                    ? __("Updating settings...", "markdown-block-editor")
                    : errorMessage || __("Settings", "markdown-block-editor")}
            </p>

            <label className="editor-setting-form__field">
                {__("Font Family", "markdown-block-editor")}
                <select
                    value={fontFamily}
                    onChange={event => {
                        const value = event.currentTarget.value;
                        onFontFamilyChange(value);
                    }}
                >
                    {fontFamilies.map(({ label, value }) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
            </label>

            <div className="editor-setting-form__custom-font">
                <input
                    type="text"
                    aria-label={__("Custom Font Family", "markdown-block-editor")}
                    value={fontFamily}
                    onChange={event => onFontFamilyChange(event.currentTarget.value)}
                />
                <button type="button" onClick={() => onFontFamilyChange(fontFamily)}>
                    Apply
                </button>
            </div>

            <label className="editor-setting-form__field">
                {__("Font Size", "markdown-block-editor")}
                <select
                    value={(fontSize || 12).toString()}
                    onChange={event => onFontSizeChange(Number(event.currentTarget.value))}
                >
                    {fontSizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>
            </label>

        </div>
    );
}


export const DefaultOtherSettingsForm = ({ settings, recentCodeLanguages, settingOptions, updateSettings }: OtherSettingTemplateProps) =>
{

    const { frontTheme, adminTheme, monacoTheme, prismTheme, previewInterval, useSnippets } = settings;
    const { frontThemes, adminThemes, prismThemes, monacoThemes } = settingOptions;

    return (
        <div className="editor-setting-form__other-settings">

                <section
                    className="editor-setting-form__other-settings-panel"
                    aria-label={__("Other Settings", "markdown-block-editor")}
                >
                    <p>{recentCodeLanguages.join(", ")}</p>

                    <label className="editor-setting-form__field">
                        {__("Preview Interval", "markdown-block-editor")}
                        <input
                            type="range"
                            value={previewInterval}
                            min={500}
                            max={5000}
                            onChange={event => updateSettings({
                                previewInterval: Number(event.currentTarget.value),
                            })}
                        />
                    </label>

                    <label className="editor-setting-form__field">
                        {__("Front Theme", "markdown-block-editor")}
                        <select
                            value={frontTheme}
                            onChange={event => updateSettings({ frontTheme: event.currentTarget.value })}
                        >
                            {frontThemes.map(theme => (
                                <option key={theme.key} value={theme.key}>{theme.name}</option>
                            ))}
                        </select>
                    </label>

                    <label className="editor-setting-form__field">
                        {__("Admin Theme", "markdown-block-editor")}
                        <select
                            value={adminTheme}
                            onChange={event => updateSettings({ adminTheme: event.currentTarget.value })}
                        >
                            {adminThemes.map(theme => (
                                <option key={theme.key} value={theme.key}>{theme.name}</option>
                            ))}
                        </select>
                    </label>

                    <label className="editor-setting-form__field">
                        {__("Monaco Editor Theme", "markdown-block-editor")}
                        <select
                            value={monacoTheme}
                            onChange={event => updateSettings({ monacoTheme: event.currentTarget.value })}
                        >
                            {monacoThemes.map(theme => (
                                <option key={theme.key} value={theme.key}>{theme.name}</option>
                            ))}
                        </select>
                    </label>

                    <label className="editor-setting-form__field">
                        {__("Prism Theme", "markdown-block-editor")}
                        <select
                            value={prismTheme}
                            onChange={event => updateSettings({ prismTheme: event.currentTarget.value })}
                        >
                            {prismThemes.map(theme => (
                                <option key={theme.key} value={theme.key}>{theme.name}</option>
                            ))}
                        </select>
                    </label>

                    <label className="editor-setting-form__field editor-setting-form__checkbox">
                        <input
                            type="checkbox"
                            checked={useSnippets}
                            onChange={event => updateSettings({ useSnippets: event.currentTarget.checked })}
                        />
                        {__("Use Snippets", "markdown-block-editor")}
                    </label>

                    <p>
                        {__("This will update the options used globally, but you will need to reload the page for the changes to take effect.", "markdown-block-editor")}
                    </p>

                </section>
        </div>
    );
}



const splitOptions = [
    { value: 'code', label: 'Code' },
    { value: 'view', label: 'View' },
    { value: 'both', label: 'Both' },
] as const;

export const DefaultControlPanel = ( {
    maximized,
    viewMode,
    undo,
    redo,
    openFindDialog,
    openReplaceDialog,
    onMaximizeChanged,
    onPanelChange,
}: ControlPanelTemplateProps ) => {
    return (
        <>
            <div className="markdown-block-editor-button-group markdown-block-editor-margin-vertical">
                <button type="button" onClick={ undo }>
                    Undo
                </button>
                <button type="button" onClick={ redo }>
                    Redo
                </button>
            </div>

            <div className="markdown-block-editor-button-group markdown-block-editor-margin-vertical">
                <button
                    type="button"
                    className="markdown-block-editor-button-vertical"
                    onClick={ openFindDialog }
                >
                    Find
                </button>
                <button
                    type="button"
                    className="markdown-block-editor-button-vertical"
                    onClick={ openReplaceDialog }
                >
                    Replace
                </button>
            </div>

            <button
                type="button"
                className="markdown-block-editor-button-vertical markdown-block-editor-margin-vertical"
                onClick={ onMaximizeChanged }
            >
                { maximized
                    ? 'Restore the editor to normal size.'
                    : 'Maximize the editor.' }
            </button>

            <select
                aria-label="Editor view mode"
                className="markdown-block-editor-margin-vertical"
                value={ viewMode }
                onChange={ ( event ) => {
                    const selectedMode = event.currentTarget.value;
                    if (
                        selectedMode === 'code' ||
                        selectedMode === 'view' ||
                        selectedMode === 'both'
                    ) {
                        onPanelChange( selectedMode );
                    }
                } }
            >
                { splitOptions.map( ( { value, label } ) => (
                    <option key={ value } value={ value }>
                        { label }
                    </option>
                ) ) }
            </select>
        </>
    );
};



export const DefaultDialogComponent = ({ label, children }: DialogTemplateProps) =>
{
    const [isOpenState, setIsOpenState] = useState(false);

    return (
        <>
            <button type="button" style={{ width: '100%' }} onClick={() => setIsOpenState(true)}>
                {label}
            </button>
            {isOpenState && (
                <div
                    role="dialog"
                    aria-modal="true"
                    style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => { setIsOpenState(false); }}
                >
                    <div
                        style={{ background: 'white', padding: '1.5rem', maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto' }}
                        onClick={event => event.stopPropagation()}
                    >
                        {children}
                        <button type="button" onClick={() => { setIsOpenState(false); }}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
}


