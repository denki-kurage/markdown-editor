import { IAppContext } from "@kurage/markdown-core";
import { MarkdownTableContent } from "../tables";
import { TableDecorator } from "../tables/TableDecorator";
import { BaseConfiguration, IBoolConfiguration } from "./Configurations";
import { ExtensionConfigStorageHelper } from "../ExtensionConfigStorageHelper";



export class DecoratorConfiguration extends BaseConfiguration implements IBoolConfiguration
{
	public constructor(private readonly editorContext: IAppContext, helper: ExtensionConfigStorageHelper)
	{
		super(helper);
	}

	public on(): void
	{
		this.helper.setEnabledTableDecoration(true);
	}

	public off(): void
	{
		this.editorContext.getDecorator().clearDecorate();
		this.helper.setEnabledTableDecoration(false);
	}

	public getValue(): boolean
	{
		return this.helper.getEnabledTableDecoration();
	}

	public decorate(nv?: MarkdownTableContent): void
	{

		if (this.getValue())
		{
			const ctx = this.editorContext;
			ctx.getDecorator().clearDecorate();

			if (nv) {
				const pos = ctx.getEditorModel().getCursor();
				if (pos) {
					// ctx.getDecorator().decorate(nv, pos);
					new TableDecorator(ctx).decorate(nv, pos)
				}
			}
		}
	}
}
