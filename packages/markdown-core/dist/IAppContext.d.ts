import { ITextSource } from "./ITextSource";
import { IStringCounter } from "./IStringCounter";
import { IEditorDecorator } from "./IEditorDecorator";
import { IEditorModel } from "./IEditorModel";
import { IAppConfig } from "./IAppConfig";
import { IScrollSynchronizer } from "./IScrollSynchronizer";
import { IEventsInitializer } from "./component-model";
import { IMarkdownEvents } from "./IMarkdownEvents";
export interface IAppContext {
    getEditorName(): string;
    getTextSource(): ITextSource | undefined;
    getEditorModel(): IEditorModel;
    getDecorator(): IEditorDecorator;
    getScrollSynchronizer(): IScrollSynchronizer;
    getAppConfig(): IAppConfig;
    getEventsInitializer(): IEventsInitializer<IMarkdownEvents>;
    getStringCounter(): IStringCounter;
    returnKey(): string;
}
//# sourceMappingURL=IAppContext.d.ts.map