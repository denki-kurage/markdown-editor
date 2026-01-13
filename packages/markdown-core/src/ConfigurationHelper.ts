import { IConfigurationStorage } from "./component-model";


export class ConfigurationHelper
{
    public readonly getter: ConfigurationValueGetter;

    public constructor(public readonly configurationStorage: IConfigurationStorage)
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

    private createArray<T>(key: string, type: string): T[] | undefined
    {
        const v = this.configurationStorage.getValue(key);

        if(Array.isArray(v))
        {
            return [...v.values()].filter(v => typeof v === type) as T[];
        }
    }

    public createArrayString(key: string): string[] | undefined
    {
        return this.createArray<string>(key, "string");
    }

    public createArrayNumner(key: string): number[] | undefined
    {
        return this.createArray<number>(key, "number");
    }

}
