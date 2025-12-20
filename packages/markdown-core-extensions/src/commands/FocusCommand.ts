import { Direction } from "../tables/Direction";
import { TableCellInfo } from "../tables/MarkdownTableContent";
import { TablePosition } from "../tables/TablePosition";
import { FocusCommandBase } from "./CommandBaseClasses";
import { IFormattableParameter } from "@mde/markdown-core";

export class FocusCommand extends FocusCommandBase
{
	protected canExecuteOverride(cellInfo: TableCellInfo, parameter: Direction): boolean
	{
		// TODO: メニューバーとの問題がありどうするか検討中。
		const nextCellInfo = this.getNextCellInfo(cellInfo, parameter);

		return !cellInfo.isOuterSide && !!nextCellInfo;
	}

	protected executeOverride(cellInfo: TableCellInfo, parameter: Direction, focus: IFormattableParameter): void
	{
		let targetCellInfo = this.getNextCellInfo(cellInfo, parameter);
		if(targetCellInfo)
		{
			targetCellInfo = targetCellInfo.newCellInfo(0);
			const f = targetCellInfo?.getWordSelection();
			focus.setFocusedCellInfo(f);
		}
	}

	private getNextCellInfo(cellInfo: TableCellInfo, parameter: Direction): TableCellInfo | undefined
	{
		const colIndex = cellInfo.columnIndex; // firstCell or lastCell is -1
		const rowIndex = cellInfo.rowIndex;

		let currentCell: TableCellInfo | undefined = cellInfo;

		// 左移動(ワープ)
		if(parameter === Direction.Left)
		{
			if(colIndex > 0)
			{
				return currentCell.getCellFromDirection(Direction.Left);
			}

			// row=0の場合はalignmentsを飛ばしてheadersへ移動。その後一番左へ移動。
			let left = currentCell.getCellFromRelative(new TablePosition(rowIndex === 0 ? -2 : -1, 0));
			return left?.getCellFromRelative(new TablePosition(0, Math.max(0, left.rowCellsLength - 1)));
		}

		// 右移動(ワープ)
		if(parameter === Direction.Right)
		{
			const lastColIndex = cellInfo.rowCellsLength - 1 || 0;

			if(colIndex < lastColIndex)
			{
				return currentCell?.getCellFromDirection(Direction.Right);
			}

			const right = currentCell?.getCellFromAbsolute(cellInfo.tablePosition.newColumnIndex(0));
			return right?.getCellFromRelative(new TablePosition(rowIndex === -2 ? 2 : 1, 0));
		}


		if(parameter === Direction.Top)
		{
			return currentCell.getCellFromRelative(new TablePosition(rowIndex === 0 ? -2 : -1, 0));
		}

		if(parameter === Direction.Bottom)
		{
			return currentCell.getCellFromRelative(new TablePosition(rowIndex === -2 ? 2 : 1, 0));
		}

	}

	protected isRowOnly(): boolean
	{
		return false;
	}
}





