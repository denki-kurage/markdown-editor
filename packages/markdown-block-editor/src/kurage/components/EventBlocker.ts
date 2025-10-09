
export type EventDisposable = () => void;

export class EventBlocker
{
    private isBlock = false;

    public constructor(private readonly label = 'None')
    {
    }

    public block(): EventDisposable
    {
        this.isBlock = true;
        return () => this.isBlock = false;
    }


    public blocking(execute: () => void): void
    {
        this.block();
        execute();
    }

    public fire(execute: () => void): void
    {
        if (!this.isBlocking())
        {
            execute();
        }

        this.clear();
    }

    public clear(): void
    {
        this.isBlock = false;
    }

    public isBlocking(): boolean
    {
        return this.isBlock;
    }

}
