import { IFormattableParameter, MovableArray } from "@kurage/markdown-core";
import { MoveCommandBase } from "./CommandBaseClasses";
import { MarkdownTableRows, TableCellInfo } from "../MarkdownTableContent";

export class MoveRowCommand extends MoveCommandBase
{
	protected canExecuteOverride(cellInfo: TableCellInfo, parameter: boolean): boolean
	{
		return !cellInfo.isOuterSide && this.getTargetRowIndex(cellInfo, parameter) !== undefined;
	}

	protected executeOverride(cellInfo: TableCellInfo, parameter: boolean, focus: IFormattableParameter): void
	{
		const itemRowIndex = cellInfo.rowIndex;
		const targetRowIndex = this.getTargetRowIndex(cellInfo, parameter) as number;
		const ba = this.getInsertLine(parameter);
		new MovableArray<MarkdownTableRows>(cellInfo.table.rows).move(targetRowIndex, [itemRowIndex], ba);

		focus.format();
		const f = cellInfo.newCellInfo()?.getForcus()
		focus.setFocusedCellInfo(f);
	}
	
	private getTargetRowIndex(cellInfo: TableCellInfo, p: boolean): number | undefined
	{
		const targetRowIndex = cellInfo.tablePosition.newAdded(this.getMoveRowDirection(p)).rowIndex;
		if(cellInfo.table.isRow(targetRowIndex))
		{
			return targetRowIndex;
		}
	}

	protected isRowOnly() : boolean
	{
		return true;
	}
	

}
