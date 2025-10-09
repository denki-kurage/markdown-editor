import { IConfigureStorage } from "./IConfigureStorage";
export interface IConfigValue<T> {
    setValue(value: T): void;
    getValue(): T;
}
export declare abstract class ConfigValue<T> implements IConfigValue<T> {
    readonly name: string;
    readonly defaultValue: T;
    private readonly storage;
    constructor(name: string, defaultValue: T, storage: IConfigureStorage);
    setValue(value: T): void;
    getValue(): T;
    abstract validate(value: T): void;
    protected onValueChanged(value: T): void;
}
export declare class BooleanConfigValue extends ConfigValue<boolean> {
    validate(value: boolean): void;
    on(): void;
    off(): void;
}
export declare class StringConfigValue extends ConfigValue<string> {
    validate(value: string): void;
}
export declare class NumberConfigValue extends ConfigValue<number> {
    validate(value: number): void;
}
//# sourceMappingURL=IConfigValue.d.ts.map