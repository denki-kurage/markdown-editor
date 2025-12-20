import { CellInfoHelper } from "./TableCellCommandBase";
import { InsertCommandBase } from "./CommandBaseClasses";
import { IFormattableParameter } from "@mde/markdown-core";
import { MarkdownTableRows, TableCell, TableCellInfo } from "../tables/MarkdownTableContent";



export class InsertRowCommand extends InsertCommandBase
{
	protected canExecuteOverride(cellInfo: TableCellInfo, parameter: boolean): boolean
	{
		return true;
	}

	protected executeOverride(cellInfo: TableCellInfo, parameter: boolean, focus: IFormattableParameter): void
	{
		const table = cellInfo.table;
		const insertRowIndex = cellInfo.tablePosition.newAdded(this.getInsertRowDirection(parameter)).rowIndex;
		const insertRow = CellInfoHelper.createRow(MarkdownTableRows, table.columnLength, () => new TableCell(''));
		table.rows.splice(insertRowIndex, 0, insertRow);

		// フォーマット
		focus.format();

		// フォーカスは自身
		const f = cellInfo.newCellInfo()?.getForcus();
		focus.setFocusedCellInfo(f);

	}

	protected isRowOnly(): boolean
	{
		return true;
	}
	
}





