/**
 * コンストラクタによる初期化を行う基底クラスです。
 * 
 */

import { Direction } from "../Direction";
import { ICommandContext } from "../ICommandContext";
import { MarkdownAlignments } from "../MarkdownAlignments";
import { TableCellCommandBase } from "./TableCellCommandBase";





export abstract class MoveCommandBase extends TableCellCommandBase<boolean>
{
	public constructor(commandContext: ICommandContext, isBefore: boolean)
	{
		super(commandContext, isBefore)
	}
}


export abstract class InsertCommandBase extends TableCellCommandBase<boolean>
{
	public constructor(commandContext: ICommandContext, isBefore: boolean)
	{
		super(commandContext, isBefore);
	}
}

export abstract class RemoveCommandBase extends TableCellCommandBase<void>
{
	public constructor(commandContext: ICommandContext)
	{
		super(commandContext);
	}
}

export abstract class ChangeAlignmentCommandBase extends TableCellCommandBase<MarkdownAlignments>
{
	public constructor(commandContext: ICommandContext, align: MarkdownAlignments)
	{
		super(commandContext, align);
	}
}

export abstract class FormatCommandBase extends TableCellCommandBase<void>
{
	public constructor(commandContext: ICommandContext)
	{
		super(commandContext);
	}
}

export abstract class FocusCommandBase extends TableCellCommandBase<Direction>
{
	public constructor(commandContext: ICommandContext, direction: Direction)
	{
		super(commandContext, direction);
	}
}


export abstract class SortCommandBase extends TableCellCommandBase<boolean>
{
	public constructor(commandContext: ICommandContext, isAsc: boolean)
	{
		super(commandContext, isAsc);
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



