import { IAppContext, IConfigurationStorage, MarkdownEventCollection } from "@mde/markdown-core";
import { AutoFormatterConfiguration } from "./AutoFormatterConfiguration";
import { DecoratorConfiguration } from "./DecoratorConfiguration";


export class MarkdownConfigurations
{
	public readonly autoFormatter: AutoFormatterConfiguration;
	public readonly decorator: DecoratorConfiguration;
	public readonly eventCollection: MarkdownEventCollection;

	public constructor(
		events: MarkdownEventCollection,
		storage: IConfigurationStorage,
		editorContext: IAppContext) {
		this.eventCollection = events;
		this.autoFormatter = new AutoFormatterConfiguration(events, storage);
		this.decorator = new DecoratorConfiguration(editorContext, storage);
	}

}
