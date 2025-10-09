
import { ICommand, MarkdownCore } from "@mde/markdown-core";


const md : Markdown = null as any; // dummy to make import work

export class AppMainHelper {
	public readonly commands: Map<string, ICommand>;
	public get enabledCommandNames()
	{
		return this.markdownApp.table.getEnabledCommandNames();
	}


	public constructor(public readonly markdownApp: MarkdownCore) {
		this.commands = markdownApp.table.getCommandsMap();
	}

	// テーブルコマンド名のみ取得。
	public get getTableCommandNames() {
		return this.markdownApp.table.getCommandNames();
	}

	public isCommandEnable(n: string) {
		return this.enabledCommandNames.includes(n);
	}

	public getCommand(n: string): ICommand | undefined {
		return this.commands.get(n);
	}

	public execCommand(n: string, parameter: any): void {
		const cmd = this.getCommand(n);
		if (cmd && cmd.canExecute(parameter)) {
			cmd.execute(parameter);
		}
	}
}



