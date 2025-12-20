import { ISelection, MarkdownRange } from "@mde/markdown-core";
import { TableCommandBase } from "./TableCommandBase";
import { ICommandContext } from "../tables/ICommandContext";
import { MarkdownTableContent } from "../tables";


/**
 * isIndexがtrueの時、テーブルがparameter個目(0から数えて)へ、falseの時はドキュメントインデックスにあるテーブルへ移動します。
 */
export class ScrollCommand extends TableCommandBase<number>
{

	public constructor(commandContext: ICommandContext, public readonly isIndex: boolean = true)
	{
		super(commandContext);
	}
	
	protected executeGeneric(parameter: number): void
	{
		const table = this.getTargetTable(parameter);
		if (table)
		{
			const pos = Math.floor((table.range.begin + table.range.end) / 2);
			this.commandContext.appContext.getEditorModel().scroll(pos);
			
			
			/**
			 * TODO: 仕様忘れた
			 */
			this.commandContext.appContext.getEditorModel().setSelections([<ISelection>{
				sPos: {
					docIndex: table.range.begin,
					charIndex: 0
				}
			}]);
		}

	}

	protected canExecuteGeneric(parameter: number): boolean
	{
		return !!this.getTargetTable(parameter);
	}


	public getTargetTable(parameter: number): MarkdownTableContent | undefined
	{
		let tables: Array<MarkdownTableContent> | undefined = undefined;

		if (this.isIndex)
		{
			tables = this.appHelper.getTableContents();
			if (new MarkdownRange(0, tables.length).internal(parameter))
			{
				return tables[parameter];
			}
		}

		else
		{
			tables = tables || this.appHelper.getTableContents();
			return tables.find(_ => _.range.internal(parameter));
		}
	}

}

