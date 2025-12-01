import { IConfigureStorage } from "@mde/markdown-core";

export class MarkdownConfigureStorage implements IConfigureStorage
{
    private config: Map<string, any> = new Map();

    public setValue<T>(name: string, value: T): boolean
    {
        this.config.set(name, value);
        return true;
    }

    public getValue<T>(name: string): T
    {
        return this.config.get(name) as T;
    }
}
