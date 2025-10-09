export class ConfigValue {
    name;
    defaultValue;
    storage;
    constructor(name, defaultValue, storage) {
        this.name = name;
        this.defaultValue = defaultValue;
        this.storage = storage;
    }
    setValue(value) {
        this.validate(value);
        this.storage.setValue(this.name, value);
        this.onValueChanged(value);
    }
    getValue() {
        try {
            const value = this.storage.getValue(this.name);
            this.validate(value);
            return value;
        }
        catch {
            return this.defaultValue;
        }
    }
    onValueChanged(value) {
    }
}
export class BooleanConfigValue extends ConfigValue {
    validate(value) {
        if (typeof value !== "boolean") {
            throw new Error('boolean');
        }
    }
    on() {
        this.setValue(true);
    }
    off() {
        this.setValue(false);
    }
}
export class StringConfigValue extends ConfigValue {
    validate(value) {
        if (typeof value !== "string") {
            throw new Error('string');
        }
    }
}
export class NumberConfigValue extends ConfigValue {
    validate(value) {
        if (typeof value !== "number") {
            throw new Error('number');
        }
    }
}
//# sourceMappingURL=IConfigValue.js.map