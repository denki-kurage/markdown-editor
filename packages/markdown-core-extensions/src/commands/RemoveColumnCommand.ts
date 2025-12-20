import { IFormattableParameter } from "@mde/markdown-core";
import { RemoveCommandBase } from "./CommandBaseClasses";
import { TableCellInfo } from "../tables/MarkdownTableContent";

export class RemoveColumnCommand extends RemoveCommandBase
{

	protected canExecuteOverride(cellInfo: TableCellInfo, parameter: void): boolean
	{
		return !cellInfo.isOuterSide;
	}

	protected executeOverride(cellInfo: TableCellInfo, parameter: void, focus: IFormattableParameter): void
	{
		for (const row of cellInfo.table)
		{
			row.cells.splice(cellInfo.columnIndex, 1);
		}

		focus.format();

		const bef = cellInfo.befCellInfo();
		if (bef)
		{
			focus.setFocusedCellInfo(bef.newCellInfo(0)?.getForcus() || bef?.getForcus());
		}
	}

}

