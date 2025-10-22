import { IAppContext, IDisposable } from '@mde/markdown-core';
import { registerMarkdownViewer, scrollToLineNumber } from './components/parser';
//import { EventBlocker } from './components/EventBlocker';



export const useEditorInterlocking = (appContext: IAppContext, win: Window) =>
{
	const scrollSync = appContext.getScrollSynchronizer();
	const editorBlocker = new EventBlocker('Editor', (lineNumber: number) => scrollSync.scroll(lineNumber));
	const viewerBlocker = new EventBlocker('Viewer', (lineNumber: number) => scrollToLineNumber(win, lineNumber));

	const viewScroll = (lineNumber: number) => editorBlocker.saftyFire(() => viewerBlocker.execute(lineNumber));
	const d1 = scrollSync.addScrollEventListener(viewScroll);

	const editReveal = (lineNumber: number) => viewerBlocker.saftyFire(() => editorBlocker.execute(lineNumber));
	const d2 = registerMarkdownViewer(win.document, editReveal);

	return {
		dispose: () => {
			d1.dispose();
			d2.dispose();
		},
		viewScroll,
		editReveal
	}
};

export type EventDisposable = () => void;

export class EventBlocker<T>
{
	private isBlock = false;

	public constructor(
		public readonly label = 'None',
		private readonly execution: (arg: T) => void)
	{

	}

	public block(): EventDisposable
	{
		this.isBlock = true;
		return () => this.isBlock = false;
	}


	public execute(args: T): void
	{
		this.block();
		this.execution(args);
	}

	public saftyFire(callback: () => void): void
	{
		if (!this.isBlocking())
		{
			callback();
		}

		this.clear();
	}

	public clear(): void
	{
		this.isBlock = false;
	}

	public isBlocking(): boolean
	{
		return this.isBlock;
	}

}

/*
export const useEditorInterlocking = (appContext: IAppContext, win: Window) => {
	const editorBlocker = new EventBlocker('Editor');
	const viewerBlocker = new EventBlocker('Viewer');
	const scrollSync = appContext.getScrollSynchronizer();

	const fs = {
		reveal: (lineNumber: number) => editorBlocker.blocking(() => scrollSync.scroll(lineNumber)),
		scroll: (lineNumber: number) => viewerBlocker.blocking(() => scrollToLineNumber(win, lineNumber))
	};

	const d1 = scrollSync.addScrollEventListener(lineNumber => editorBlocker.fire(() => fs.scroll(lineNumber)));
	const d2 = registerMarkdownViewer(win.document, lineNumber => viewerBlocker.fire(() => fs.reveal(lineNumber)));

	return {
		dispose: () => {
			d1.dispose();
			d2.dispose();
		}
	} as IDisposable;
};
*/