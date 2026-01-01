import { IConfigurationStorage } from "./IConfigurationStorage";

export interface IConfigValue<T>
{
    setValue(value: T): void;
    getValue(): T;
}

export abstract class ConfigValue<T> implements IConfigValue<T>
{
    public constructor(
        public readonly name: string,
        public readonly defaultValue: T,
        private readonly storage: IConfigurationStorage
    )
    {

    }

    public setValue(value: T): void
    {
        this.validate(value);
        this.storage.setValue(this.name, value);
        this.onValueChanged(value);
    }

    public getValue(): T
    {
        try
        {
            const value = this.storage.getValue<T>(this.name);
            this.validate(value);
            return value;
        }
        catch
        {
            return this.defaultValue;
        }
    }

    public abstract validate(value: T): void;

    protected onValueChanged(value: T): void
    {

    }
}

export class BooleanConfigValue extends ConfigValue<boolean>
{
    public validate(value: boolean): void
    {
        if(typeof value !== "boolean")
        {
            throw new Error('boolean');
        }
    }
    
    public on(): void
    {
        this.setValue(true);
    }

    public off(): void
    {
        this.setValue(false);
    }
}

export class StringConfigValue extends ConfigValue<string>
{
    public validate(value: string): void
    {
        if(typeof value !== "string")
        {
            throw new Error('string');
        }
    }
}

export class NumberConfigValue extends ConfigValue<number>
{
    public validate(value: number): void
    {
        if(typeof value !== "number")
        {
            throw new Error('number');
        }
    }

}
