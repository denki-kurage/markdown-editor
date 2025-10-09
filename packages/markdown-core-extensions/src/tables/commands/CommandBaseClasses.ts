/**
 * コンストラクタによる初期化を行う基底クラスです。
 * 
 */

import { TableCellCommandBase } from "./TableCellCommandBase";
import { MarkdownAlignments } from "../MarkdownAlignments";
import { Direction } from "../Direction";
import { ICommandContext } from "../ICommandContext";





export abstract class MoveCommandBase extends TableCellCommandBase<number>
{
	public constructor(commandContext: ICommandContext, public readonly isBefore: boolean)
	{
		super(commandContext)
	}
}


export abstract class InsertCommandBase extends TableCellCommandBase<number>
{
	public constructor(commandContext: ICommandContext, public readonly isBefore: boolean)
	{
		super(commandContext);
	}
}

export abstract class RemoveCommandBase extends TableCellCommandBase<number>
{
	public constructor(commandContext: ICommandContext)
	{
		super(commandContext);
	}
}

export abstract class ChangeAlignmentCommandBase extends TableCellCommandBase<void>
{
	public constructor(commandContext: ICommandContext, public readonly align: MarkdownAlignments)
	{
		super(commandContext);
	}
}

export abstract class FormatCommandBase extends TableCellCommandBase<void>
{
	public constructor(commandContext: ICommandContext)
	{
		super(commandContext);
	}
}

export abstract class FocusCommandBase extends TableCellCommandBase<void>
{
	public constructor(commandContext: ICommandContext, public readonly direction: Direction)
	{
		super(commandContext);
	}
}


export abstract class SortCommandBase extends TableCellCommandBase<void>
{
	public constructor(commandContext: ICommandContext, public readonly isAsc: boolean)
	{
		super(commandContext);
	}
}

export abstract class TextSortCommandBase extends TableCellCommandBase<void>
{
	public constructor(
		commandContext: ICommandContext,
		public readonly isAsc: boolean,
		public readonly ignoreCase: boolean)
	{
		super(commandContext);
	}
}



