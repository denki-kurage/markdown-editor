import { CheckboxControl } from "@wordpress/components";
import { BaseConfiguration, ExMarkdownCore, ExtensionConfigStorageHelper } from "@kurage/markdown-core-extensions";
import { ExtensionSettingsProps } from "./ExtensionSettingsProps";

export const TOKEN_EXPLORER = 'markdown_block_editor_.Core.TokenExplorer';


export const ExtensionSettings = ({configurations, extensionContexts}: ExtensionSettingsProps) =>
{
    const { appContext } = extensionContexts;
    const { configurationStorage, markdownCore } = appContext;

    const exc = (markdownCore as ExMarkdownCore).configurations;
    const autoFormatter = exc.autoFormatter;
    const decorator = exc.decorator;

    // TODO: 後でmarkdown-core-extensionsに移動する。
    const tokenEditor = new TokenEditorConfig(new ExtensionConfigStorageHelper(configurationStorage))
    



    return (
        <>
            <h2>Extension Settings</h2>

            <CheckboxControl
                label="Enabled Token Explorer"
                checked={tokenEditor.getValue()}
                onChange={c => c ? tokenEditor.on() : tokenEditor.off()}
                />
            
            
            <CheckboxControl
                label="Enabled Auto Table Formatter"
                checked={autoFormatter.getValue()}
                onChange={c => c ? autoFormatter.on() : autoFormatter.off()}
                />
            
            <CheckboxControl
                label="Enabled Table Decoration"
                checked={decorator.getValue()}
                onChange={c => c ? decorator.on() : decorator.off()}
                />

        </>
    ) as JSX.Element;
}

class TokenEditorConfig extends BaseConfiguration
{
    public constructor(helper: ExtensionConfigStorageHelper)
    {
        super(helper);
    }

    public getValue(): boolean
    {
        return this.helper.getEnabledTokenExplorer();
    }

    public on(): void
    {
        this.helper.setEnableTokenExplorer(true);
    }

    public off(): void
    {
        this.helper.setEnableTokenExplorer(false);
    }
}
