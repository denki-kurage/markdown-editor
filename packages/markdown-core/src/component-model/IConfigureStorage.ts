
export interface IConfigureStorage
{
    save(): Promise<boolean>;
    setValue<T>(name: string, value: T): boolean;
    getValue<T>(name: string): T;
}


