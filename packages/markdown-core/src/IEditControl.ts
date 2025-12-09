export interface IEditControl
{
    undo(): void;
    redo(): void;
    openSuggest(): void;
    openFindDialog(): void;
    openReplaceDialog(): void;
}
