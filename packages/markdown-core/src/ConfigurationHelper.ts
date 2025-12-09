import { IConfigurationStorage } from "./component-model";


export class ConfigurationHelper
{
    protected readonly getter: ConfigurationValueGetter;

    public constructor(private readonly configurationStorage: IConfigurationStorage)
    {
        this.getter = new ConfigurationValueGetter(configurationStorage);
    }
    
    public updateRecentCodeLanguage(language: string, maxLength: number = 10)
    {
        const languages = this.getter.createArrayString('Core.RecentCodeLanguages') ?? [];
        const idx = languages.indexOf(language);
        if(idx >= 0)
        {
            languages.splice(idx, 1);
        }

        languages.unshift(language);
        languages.splice(maxLength);
        

        this.configurationStorage.setValue('Core.RecentCodeLanguages', languages);
    }

    public getRecentCodeLanguages(): string[]
    {
        return this.getter.createArrayString('Core.RecentCodeLanguages') ?? [];
    }


}

export class ConfigurationValueGetter
{
    public constructor(private readonly configurationStorage: IConfigurationStorage)
    {

    }

    public createArrayString(key: string): string[] | undefined
    {
        const v = this.configurationStorage.getValue(key);
        if(Array.isArray(v))
        {
            return [...v.values()].filter(v => typeof v === "string");
        }
    }
}
