import { useEffect, useMemo, useState, type ComponentType } from "react";
import { __ } from "@wordpress/i18n";
import { applyFilters } from "@wordpress/hooks";
import { useExtensionContexts } from "../../components/hooks";
import { useMarkdownCoreContext } from "../../context";
import { useMarkdownCoreInstance } from "../../context/markdown-core-context";
import { useComponentViewModels } from "./ComponentViewModelContext";

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

export type EditorSettingFormProps =
{

}

export const EditorSettingForm = ({}: EditorSettingFormProps) =>
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
                        setCustomFontFamily(value);
                        updateFontFamily(value);
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
                    value={customFontFamily}
                    onChange={event => setCustomFontFamily(event.currentTarget.value)}
                />
                <button type="button" onClick={() => updateFontFamily(customFontFamily)}>
                    Apply
                </button>
            </div>

            <label className="editor-setting-form__field">
                {__("Font Size", "markdown-block-editor")}
                <select
                    value={(fontSize || 12).toString()}
                    onChange={event => updateFontSize(Number(event.currentTarget.value))}
                >
                    {fontSizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>
            </label>

            <OtherSettingsForm />
        </div>
    );
}

export type OtherSettingsFormProps =
{

}

export const OtherSettingsForm = ({}: OtherSettingsFormProps) =>
{
    const [isOpen, setIsOpen] = useState(false);
    const { settings, settingOptions } = useMarkdownCoreContext();
    const {
        frontTheme,
        adminTheme,
        monacoTheme,
        prismTheme,
        previewInterval,
        configurations,
        useSnippets,
    } = settings;
    const { frontThemes, adminThemes, monacoThemes, prismThemes } = settingOptions;
    const { updateSettings } = useComponentViewModels().settingsViewModel;
    const recentCodeLanguages = useMarkdownCoreInstance()
        .getConfigurationHelper()
        .getRecentCodeLanguages();
    const extensionContexts = useExtensionContexts();
    const extensionSettings = useMemo(
        () => applyFilters("markdown_block_editor_settings", []) as ComponentType<{
            configurations: typeof configurations;
            extensionContexts: typeof extensionContexts;
        }>[],
        [],
    );

    return (
        <div className="editor-setting-form__other-settings">
            <button type="button" onClick={() => setIsOpen(open => !open)}>
                {isOpen
                    ? __("Close Other Settings", "markdown-block-editor")
                    : __("Open Other Settings", "markdown-block-editor")}
            </button>
            {isOpen && (
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

                    {extensionSettings.map((Control, index) => (
                        <div
                            className="editor-setting-form__extension-setting"
                            key={Control.displayName || Control.name || index}
                        >
                            <Control
                                configurations={configurations}
                                extensionContexts={extensionContexts}
                            />
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
}