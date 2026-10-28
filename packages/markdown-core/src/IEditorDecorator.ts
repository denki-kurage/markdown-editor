import { ISelection } from "./ISelection";

/**
 * TODO: ここも変更。
 */
export interface IEditorDecorator
{
	decorate(selections: IEditorDecorateSelection[]): void;
	clearDecorate(): void;
}


export interface IEditorDecorateSelection
{
	selection: ISelection;
	classes: string[]
}
