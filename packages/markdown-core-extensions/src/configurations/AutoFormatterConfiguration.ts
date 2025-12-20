import { BooleanConfigValue, EventCollection, IConfigurationStorage, IMarkdownEvents } from "@mde/markdown-core";


export class AutoFormatterConfiguration extends BooleanConfigValue {
	public constructor(
		private readonly events: EventCollection<IMarkdownEvents>,
		storage: IConfigurationStorage) {
		super('markdown:format', true, storage);
	}

	protected onValueChanged(value: boolean): void {
		if (value) {
			//this.events.formatRequest.add(() => this.events.otherChanged.emit({}));
		}

		else {
			//this.events.remove()
		}
	}

}
