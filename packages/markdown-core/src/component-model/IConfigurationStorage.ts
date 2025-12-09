
export interface IConfigurationStorage
{
    setValue<T>(name: string, value: T): void;
    getValue<T>(name: string): T;
}


