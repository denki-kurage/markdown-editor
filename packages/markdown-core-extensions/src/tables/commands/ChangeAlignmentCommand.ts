import { ITableCommandParameter } from "./ITableCommandParameter";
import { ChangeAlignmentCommandBase } from "./CommandBaseClasses";
import { IFormattableParameter } from "@kurage/markdown-core";
import { TableAlignmentCell, TableCellInfo } from "../MarkdownTableContent";
import { MarkdownAlignments } from "../MarkdownAlignments";




export class ChangeAlignmentCommand extends ChangeAlignmentCommandBase
{

	protected canExecuteOverride(cellInfo: TableCellInfo, parameter: MarkdownAlignments): boolean
	{
		return !!this.getAlignmentCell(cellInfo);
	}

	protected executeOverride(cellInfo: TableCellInfo, parameter: MarkdownAlignments, focus: IFormattableParameter): void
	{
		const ac = this.getAlignmentCell(cellInfo);
		if (ac)
		{
			ac.updateAlign(parameter);

			const rp = cellInfo.relativeCursorInnerPosition;

			focus.format();
			const f = cellInfo.newCellInfo(rp)?.getForcus()
			focus.setFocusedCellInfo(f);
		}
	}
	

	private getAlignmentCell(cellInfo: TableCellInfo): TableAlignmentCell | undefined
	{
		return cellInfo.table.alignments.cells[cellInfo.columnIndex];
	}

}

export interface MarkdownAlignmentsParameter extends ITableCommandParameter
{
	align: MarkdownAlignments;
}

