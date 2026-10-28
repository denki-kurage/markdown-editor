import { IStringCounter } from "./IStringCounter";
import * as eaw from 'eastasianwidth';

export class DefaultStringCounter
{
	public static getStringCounter(): IStringCounter
	{
		return str => eaw.length(str);
	}

}