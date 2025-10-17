import { registerBlockType } from '@wordpress/blocks';

import './style.scss';

import Edit from './edit';
import save from './save';
import metadata from './block.json';
import { ReactComponent as M } from './m.svg';

import '../../../markdown-block-editor-extensions/build/index'

registerBlockType( metadata.name, {

	edit: Edit,
	icon: <M />,
	save,
} );



