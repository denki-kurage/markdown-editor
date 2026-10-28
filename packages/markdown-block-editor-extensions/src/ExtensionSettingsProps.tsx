import type { ExtensionContexts } from "@kurage/markdown-block-editor";



export type ExtensionSettingsProps = {
    configurations: { [key: string]: any; };
    extensionContexts: ExtensionContexts;
};
