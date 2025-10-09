import { IAppContext, IDisposable } from '@mde/markdown-core';
import { registerMarkdownViewer, scrollToLineNumber } from './components/parser';
import { EventBlocker } from './components/EventBlocker';

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
