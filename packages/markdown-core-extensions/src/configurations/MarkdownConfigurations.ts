import { IAppContext, IConfigurationStorage, MarkdownEventCollection } from "@kurage/markdown-core";
import { AutoFormatterConfiguration } from "./AutoFormatterConfiguration";
import { DecoratorConfiguration } from "./DecoratorConfiguration";
import { ExtensionConfigStorageHelper } from "../ExtensionConfigStorageHelper";


export class MarkdownConfigurations
{
	public readonly autoFormatter: AutoFormatterConfiguration;
	public readonly decorator: DecoratorConfiguration;
	public readonly eventCollection: MarkdownEventCollection;

	public constructor(
		events: MarkdownEventCollection,
		storage: IConfigurationStorage,
		editorContext: IAppContext)
	{
		const helper = new ExtensionConfigStorageHelper(storage);
		this.eventCollection = events;
		this.autoFormatter = new AutoFormatterConfiguration(events, helper);
		this.decorator = new DecoratorConfiguration(editorContext, helper);
	}

}
