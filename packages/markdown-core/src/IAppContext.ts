import { ITextSource } from "./ITextSource";
import { IStringCounter } from "./IStringCounter";
import { IEditorDecorator } from "./IEditorDecorator";
import { IEditorModel } from "./IEditorModel";
import { IAppConfig } from "./IAppConfig";
import { IScrollSynchronizer } from "./IScrollSynchronizer";
import { IDisposable, IEventsInitializer } from "./component-model";
import { IMarkdownEvents } from "./IMarkdownEvents";
import { IEditControl } from "./IEditControl";

export interface IAppContext extends IDisposable
{
	getEditorName(): string;
	getTextSource(): ITextSource;
	getEditorModel(): IEditorModel;
	getDecorator(): IEditorDecorator;
	getScrollSynchronizer(): IScrollSynchronizer;
	getAppConfig(): IAppConfig;
	getEventsInitializer(): IEventsInitializer<IMarkdownEvents>;
	getEditControl(): IEditControl;

	getStringCounter(): IStringCounter;
	returnKey(): string;
}


