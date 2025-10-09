import { IStringCounter } from "./IStringCounter";

export class StringCounter
{

	public static counter: IStringCounter = (str: string) => str.length;

	public static stringCount(str: string): number
	{
		return this.counter(str);
	}

}