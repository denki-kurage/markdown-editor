import { IFormattableParameter } from "@mde/markdown-core";
import { TableCellInfo } from "../MarkdownTableContent";
import { RemoveCommandBase } from "./CommandBaseClasses";

export class RemoveRowCommand extends RemoveCommandBase
{
	protected canExecuteOverride(cellInfo: TableCellInfo, parameter: void): boolean
	{
		return this.getInfo(cellInfo) !== undefined;
	}

	protected executeOverride(cellInfo: TableCellInfo, parameter: void, focus: IFormattableParameter): void
	{
		const removeRowIndex = this.getInfo(cellInfo) as number;
		cellInfo.table.rows.splice(removeRowIndex, 1);

		focus.format();

		const bef = cellInfo.befCellInfo();
		if(bef)
		{
			focus.setFocusedCellInfo(bef.newCellInfo(0)?.getForcus() || bef?.getForcus());
		}
	}

	private getInfo(cellInfo: TableCellInfo): number | undefined
	{
		if(cellInfo.table.isRow(cellInfo.rowIndex))
		{
			return cellInfo.rowIndex;
		}
	}
}

