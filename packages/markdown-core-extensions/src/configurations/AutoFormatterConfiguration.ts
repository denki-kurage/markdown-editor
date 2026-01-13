import { EventCollection, IConfigurationStorage, IDisposable, IMarkdownEvents } from "@kurage/markdown-core";
import { BaseConfiguration, IBoolConfiguration } from "./Configurations";
import { ExtensionConfigStorageHelper } from "../ExtensionConfigStorageHelper";
import { AutoFormatter } from "../tables/AutoFormatter";


export class AutoFormatterConfiguration extends BaseConfiguration implements IBoolConfiguration
{
	private ev: Partial<IMarkdownEvents> | undefined;

	public constructor(
		private readonly eventCollections: EventCollection<IMarkdownEvents>,
		helper: ExtensionConfigStorageHelper)
	{
		super(helper);
	}

	public getValue(): boolean
	{
		return this.helper.getEnabledAutoTableFormatter();
	}

	public on(): void
	{
		const ev = this.ev;
		this.helper.setEnabledAutoTableFormatter(true);
		if(ev)
		{
			this.ev = undefined;
			this.eventCollections.add(ev);
		}
	}

	public off(): void
	{
		this.helper.setEnabledAutoTableFormatter(false);
		for(const e of [...this.eventCollections])
		{
			if(e instanceof AutoFormatter)
			{
				this.ev = e;
				this.eventCollections.remove(e);
			}
		}
	}

}
