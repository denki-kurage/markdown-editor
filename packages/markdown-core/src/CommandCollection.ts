import { ICommandItem } from "./commands";

export class CommandCollection
{
    public constructor(public readonly root: ICommandItem)
    {

    }

    public getCommand(name: string): ICommandItem | undefined
    {
        const items = [this.root];
        
        while(items.length)
        {
            const current = items.pop()!;

            if(current.name === name)
            {
                return current;
            }

            items.push(...(current.children ?? []))
        }
    }
    public getCommand3(name: string): ICommandItem | undefined
    {
        return [...this.getAllCommands()].find(c => c.name === name);
    }

    public *getAllCommands()
    {
        const items = [this.root];
        
        while(items.length)
        {
            const current = items.pop()!;
            yield current;
            items.push(...(current.children ?? []))
        }
    }

    public execute(name: string, parameter?: any): void
    {
        const item = this.getCommand(name);
        item?.command?.execute(parameter);
    }
}