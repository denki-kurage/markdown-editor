import { IDisposable } from "./IDisposable";

export class Disposables implements IDisposable
{
	public constructor(private readonly disposables: IDisposable[] = [])
	{

	}

	public add(disposable: IDisposable): void
	{
		this.disposables.push(disposable);
	}

	public dispose(): void
	{
		for (const disposable of this.disposables)
		{
			disposable.dispose();
		}

		this.disposables.splice(0);
	}
}
