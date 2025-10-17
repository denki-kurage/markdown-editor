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

import { IAppContext, IConfigureStorage } from '@mde/markdown-core'
import { ExMarkdownCore } from '@mde/markdown-core-extensions'
import { addFilter } from '@wordpress/hooks';

addFilter(
	'extensionAppContext',
	'kurage/markdown-block-editor',
	(appContext: IAppContext, storage: IConfigureStorage) =>
	{
		if (appContext && storage)
		{
			return new ExMarkdownCore(appContext, storage);
		}
	}
)

