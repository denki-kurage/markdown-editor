/*
import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import save from './save';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit: Edit,
	save,
} );
*/

import './style.scss';

import { IAppContext, ICommandItem, IConfigureStorage, IToken, MarkdownCore } from '@mde/markdown-core'

import { ExMarkdownCore } from '@mde/markdown-core-extensions'
import { addAction, addFilter } from '@wordpress/hooks';
import TokenExplorer from './token-explorer';
import { ExtensionComponentInfo, TokenEditorComponentInfo } from '../../markdown-block-editor/src/kurage/components/token-editor';
import { TableTokenEditor } from './token-table-editor';


addFilter(
	'extensionAppContext',
	'kurage/markdown-block-editor',
	(markdownCore: MarkdownCore, appContext: IAppContext, storage: IConfigureStorage) =>
	{

		if (appContext && storage)
		{
			return new ExMarkdownCore(appContext, storage);
		}

		return markdownCore
	}
)

addAction(
	'extensionDomChanged',
	'kurage/markdown-block-editor',
	(doc: any, markdown: string, getTokenContext: any) =>
	{
		doc.querySelectorAll('[data-offset]').forEach((dom: HTMLElement) => dom.addEventListener('click', e => {
			const start = parseInt(dom.getAttribute('data-offset-start') || '0');
			const end = parseInt(dom.getAttribute('data-offset-end') || '0');
			const line = parseInt(dom.getAttribute('data-line-number') || '0');
			e.stopPropagation();
			getTokenContext().setSelectionsAndToken([[start, end]]);
		}));
	}
)

addAction(
	'extensionHeaderInitalize',
	'kurage/markdown-block-editor',
	(doc: Document) =>
	{
		const style = doc.createElement('style');
		style.textContent = `
			.markdown-content-style	
			{
				.selected-token
				{
					border: dotted 2px #ffcc00;
					color: red!important;
				}
			}
		`;

		doc.head.appendChild(style);
	}
)

addFilter(
	'extensionSingleTokenChanged',
	'kurage/markdown-block-editor',
	(execute) =>
	{
		return (token: IToken, doc: Document) =>
		{
			const dispose = execute(token, doc);

			const pos = token?.getPosition();
			const qs = `[data-offset][data-offset-start="${pos?.start}"][data-offset-end="${pos?.end}"]`;
			const dom = doc?.querySelectorAll(qs ?? '');

			if(dom && dom.length > 0)
			{
				// dom[0].scrollIntoView({behavior: "smooth", block: "center"});
				
				// 選択ハイライト
				dom.forEach(d => d.classList.add('selected-token'));
				// 前の選択をクリア
				return () => {
					dom.forEach(d => d.classList.remove('selected-token'));
					dispose();
				}
			}

			return () => dispose();
		}
	}
)

addFilter(
	'getExtensionComponents',
	'kurage/markdown-block-editor',
	(panels: ExtensionComponentInfo[]) =>
	{
		panels.push({label: 'Token Explorer', component: TokenExplorer as any});
		return panels;
	}
);


addFilter(
	'getTokenEditorComponents',
	'kurage/markdown-block-editor',
	(components: TokenEditorComponentInfo[]) =>
	{
		return [
			...components, 
			{ type: 'table', label: 'Table', component: TableTokenEditor },
			{ type: 'tableRow', label: 'Table Row', component: TableTokenEditor },
			{ type: 'tableCell', label: 'Table Cell', component: TableTokenEditor },
		]
	}
);




// return [commands: ICommandItem, enabledCommandNames: () => string[]]
addFilter(
	'getTokenCommands',
	'kurage/markdown-block-editor',
	(commandItems: ICommandItem[], markdownCore: MarkdownCore) =>
	{
		if(markdownCore instanceof ExMarkdownCore)
		{
			const maps = markdownCore.table.getCommandsMap().children ?? [];
			commandItems.push(...maps)
		}

		return commandItems;
	}
)

