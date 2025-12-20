import { BooleanConfigValue, IAppContext, IConfigurationStorage } from "@mde/markdown-core";
import { MarkdownTableContent } from "../tables";
import { TableDecorator } from "../tables/TableDecorator";



export class DecoratorConfiguration extends BooleanConfigValue
{
	public constructor(private readonly editorContext: IAppContext, storage: IConfigurationStorage) {
		super('markdown:decorator', true, storage);
	}

	protected onValueChanged(value: boolean): void {
		if (!this.getValue()) {
			this.editorContext.getDecorator().clearDecorate();
		}
	}

	public decorate(nv?: MarkdownTableContent): void {
		if (this.getValue()) {
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
