import { CellInfoHelper } from "./TableCellCommandBase";
import { TableCell, TableAlignmentCell, MarkdownTableAlignments, TableCellInfo, } from "../MarkdownTableContent";
import { InsertCommandBase } from "./CommandBaseClasses";
import { IFormattableParameter } from "@mde/markdown-core";



export class InsertColumnCommand extends InsertCommandBase
{
	protected canExecuteOverride(cellInfo: TableCellInfo, parameter: boolean): boolean
	{
		return !cellInfo.row.isFirstOrLast(cellInfo.cell)
	}

	protected executeOverride(cellInfo: TableCellInfo, parameter: boolean, focus: IFormattableParameter): void
	{
		for (const row of cellInfo.table)
		{
			if (row.hasCell(cellInfo.columnIndex))
			{
				const factory = row instanceof MarkdownTableAlignments ?
					() => TableAlignmentCell.createCellFromWAlignWord('---') :
					() => new TableCell('');

				const ba = cellInfo.tablePosition.newAdded(this.getInsertColumnDirection(parameter)).columnIndex;
				CellInfoHelper.insertCell(row, ba, factory);
			}
		}


		focus.format();
		const f = cellInfo.newCellInfo()?.getForcus();
		focus.setFocusedCellInfo(f);

	}

	

}

