import { IConfigurationStorage, IDisposable } from "@kurage/markdown-core";
import { ExtensionConfigStorageHelper } from "../ExtensionConfigStorageHelper";

export abstract class BaseConfiguration implements IDisposable
{
    public constructor(protected readonly helper: ExtensionConfigStorageHelper)
    {
        
    }

    public dispose(): void
    {
        
    }
}

export interface IBoolConfiguration
{
    on(): void;
    off(): void;
    getValue(): boolean;
}

