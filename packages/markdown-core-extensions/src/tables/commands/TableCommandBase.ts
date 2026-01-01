import { AppHelper } from "../AppHelper";
import { ICommandContext } from "../ICommandContext";
import { CommandBaseGeneric } from "./CommandBaseGeneric";
import { IAppContext } from "@kurage/markdown-core";

export abstract class TableCommandBase<T> extends CommandBaseGeneric<T>
{

	protected readonly appContext: IAppContext;
	protected readonly appHelper: AppHelper;

	public constructor(
		protected readonly commandContext: ICommandContext,
		protected readonly sealValue?: T)
	{
		super();
		this.appContext = commandContext.appContext;
		this.appHelper = new AppHelper(this.appContext);
	}


	/**
	 * デフォルトではパラメータの型の安全性は一切保証しません。
	 * @param parameter
	 */
	protected convert(parameter: any): T | undefined
	{
		return parameter as T ?? this.sealValue;
	}
	

}
