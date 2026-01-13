import { ConfigurationHelper, IConfigurationStorage } from "@kurage/markdown-core";

export class ExtensionConfigStorageHelper extends ConfigurationHelper
{
    public constructor(storage: IConfigurationStorage)
    {
        super(storage);
    }

    public getEnabledTokenExplorer(): boolean
    {
        return this.configurationStorage.getValue('Extensions.Core.EnabledTokenExplorer') ?? true;
    }

    public setEnableTokenExplorer(enabled: boolean): void
    {
        this.configurationStorage.setValue('Extensions.Core.EnabledTokenExplorer', enabled);
    }

    public getEnabledAutoTableFormatter(): boolean
    {
        return this.configurationStorage.getValue('Extensions.Core.EnabledAutoTableFormatter') ?? true;
    }

    public setEnabledAutoTableFormatter(enabledAutoTableFormatter: boolean): void
    {
        this.configurationStorage.setValue('Extensions.Core.EnabledAutoTableFormatter', enabledAutoTableFormatter);
    }

    public getEnabledTableDecoration(): boolean
    {
        return this.configurationStorage.getValue('Extensions.Core.EnabledTableDecoration') ?? true;
    }

    public setEnabledTableDecoration(enabled: boolean): void
    {
        this.configurationStorage.setValue('Extensions.Core.EnabledTableDecoration', enabled);
    }



}
