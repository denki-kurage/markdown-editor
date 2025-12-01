
export interface IConfigureStorage
{
    setValue<T>(name: string, value: T): void;
    getValue<T>(name: string): T;
}


