import { AddBlogCardCommand, AddImageCommand, BoldCommand, SelectCommand } from "./commands";
import { EventCollection } from "./component-model";
import { CommandCollection } from "./CommandCollection";
export class MarkdownCore {
    appContext;
    configStorage;
    eventCollection;
    commands;
    disposables = [];
    constructor(appContext, configStorage) {
        this.appContext = appContext;
        this.configStorage = configStorage;
        this.eventCollection = new EventCollection();
        const deliver = this.eventCollection.deliver(s => {
            return {
                cursorChanged: s.select(x => x.cursorChanged),
                formatRequest: s.select(x => x.formatRequest),
                otherChanged: s.select(x => x.otherChanged),
                selectChanged: s.select(x => x.selectChanged),
                textChanged: s.select(x => x.textChanged)
            };
        });
        this.disposables.push(this.eventCollection.add(this), appContext.getEventsInitializer().initializeEvents(deliver));
        this.commands = this.createCommands(appContext, this.eventCollection, configStorage);
    }
    dispose() {
        this.disposables.forEach(d => d.dispose());
    }
    createCommands(appContext, eventCollection, configStorage) {
        return ({
            name: "root",
            command: undefined,
            icon: undefined,
            label: 'root',
            children: [
                { name: 'markdown:add-image', label: 'xxx', icon: 'media-default', command: new AddImageCommand(appContext) },
                { name: 'markdown:add-blog-card', label: 'xxx', icon: 'archive', command: new AddBlogCardCommand(appContext) },
                { name: 'markdown:bold', label: 'xxx', icon: 'editor-bold', command: new BoldCommand(appContext) },
                { name: 'markdown:select', label: 'xxx', icon: '', command: new SelectCommand(appContext) },
            ]
        });
    }
    createCommandCollection() {
        return new CommandCollection(this.commands);
    }
    //protected createMarkdownTable(editorContext: IAppContext, eventCollection: MarkdownEventCollection, configStorage: IConfigureStorage): MarkdownTable
    //{
    //	return new MarkdownTable(editorContext, eventCollection, configStorage);
    //}
    getCommandsMap() {
        return this.commands;
    }
    textChanged(e) {
    }
    selectChanged(e) {
    }
    otherChanged(e) {
    }
    cursorChanged(e) {
    }
    formatRequest(e) {
    }
}
//# sourceMappingURL=MarkdownCore.js.map