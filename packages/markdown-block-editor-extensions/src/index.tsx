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
import './token-viewer.scss';


const tableStyle = `
.wp-kurage {
  box-sizing: border-box;
  border-width: 1px;
  border-color: green;
  background-color: rgba(128, 128, 128, 0.5);
}
.wp-kurage.row {
  border-style: solid none solid none;
}
.wp-kurage.column {
  border-style: none solid none solid;
}
.wp-kurage.left {
  border-style: solid none solid none;
}
.wp-kurage.right {
  border-style: solid none solid none;
}
.wp-kurage.top {
  border-style: solid solid none solid !important;
}
.wp-kurage.bottom {
  border-style: none solid solid solid !important;
}
.wp-kurage.center {
  border-style: solid;
}
`

console.log("★★★★★★★★★★★★★★★★★★★★★★★★★★2", tableStyle)

import { IAppContext, ICommandItem, IConfigurationStorage, ISnippet, IToken, MarkdownCore } from '@kurage/markdown-core'

import { ExMarkdownCore } from '@kurage/markdown-core-extensions'
import { addAction, addFilter } from '@wordpress/hooks';
import TokenExplorer from './token-explorer';
import {  ExtensionContexts, TokenEditorComponentInfo } from "@kurage/markdown-block-editor"
import { ListItemEditor } from './token-editors';
import { ExtensionSettings } from './ExtensionSettings';
import { SnippetsSettings } from './SnippetSettings';



addFilter(
	'markdown_block_editor_create_markdown_core',
	'kurage/markdown-block-editor',
	(markdownCore: MarkdownCore, appContext: IAppContext, storage: IConfigurationStorage) =>
	{

		if (appContext && storage)
		{
			return new ExMarkdownCore(appContext, storage);
		}

		return markdownCore
	}
)

addAction(
	'markdown_block_editor_dom_changed',
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
	'markdown_block_editor_header_initalize',
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
	'markdown_block_editor_single_token_changed',
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
	'markdown_block_editor_get_extension_components',
	'kurage/markdown-block-editor',
	(panels: TokenEditorComponentInfo[]) =>
	{
		panels.push({label: 'Token Explorer', component: TokenExplorer as any});
		return panels;
	}
);


addFilter(
	'markdown_block_editor_get_token_editor_components',
	'kurage/markdown-block-editor',
	(components: TokenEditorComponentInfo[]) =>
	{
		const x = [
			{ type: 'listItem', label: 'List Item', component: ListItemEditor },
		];
		return [
			...components,
			...x
		] as TokenEditorComponentInfo[]
	}
);

addFilter(
	'markdown_block_editor_get_inspector_commands',
	'kurage/markdown-block-editor',
	(rootCommandItem: ICommandItem, context: ExtensionContexts) =>
	{
		const core = context.appContext.markdownCore;
		if(core instanceof ExMarkdownCore)
		{
			const cmap = core.table.getCommandsMap();
			rootCommandItem.children?.push(cmap);
		}
		return rootCommandItem;
	}
)

addFilter(
	'markdown_block_editor_settings',
	'kurage/markdown-block-editor',
	(settings: JSX.Element[]) => [...settings, ExtensionSettings, SnippetsSettings]
)

addFilter(
	'markdown_block_editor_custom_snippets',
	'kurage/markdown-block-editor',
	(snippets: ISnippet[], core: MarkdownCore) => {
		if(core instanceof ExMarkdownCore)
		{
			const exSnippets = core.getConfigurationHelper().getSnippets();
			return [...snippets, ...exSnippets];
		}

		return [...snippets];
	}
)

addFilter(
	'markdown_block_editor_create_markdown_core',
	'kurage/markdown-block-editor',
	(core, { appContext, configStorage, settings, settingOptions }: any) => {
		return new ExMarkdownCore(appContext, configStorage);
	}
)

addFilter(
	'markdown_block_editor_editor_styles',
	'kurage/markdown-block-editor',
	(styles: string[]) =>
	{
		return [...styles, tableStyle]
	}
)


