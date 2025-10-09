import { ITextChanged, ISelectChanged } from "./ITextEventReciever";
export interface IMarkdownEvents {
    textChanged: (e: ITextChanged) => void;
    selectChanged: (e: ISelectChanged) => void;
    otherChanged: (e: any) => void;
    cursorChanged: (e: number) => void;
    formatRequest: (e: void) => void;
}
//# sourceMappingURL=IMarkdownEvents.d.ts.map