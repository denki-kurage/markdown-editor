import { registerBlockType } from '@wordpress/blocks';


import './style.scss';


import Edit from './edit';
import save from './save';

// @ts-ignore
import metadata from './block.json';

// @ts-ignore
import { ReactComponent as M } from './m.svg';

// @ts-ignore
registerBlockType( metadata.name, {

	edit: Edit,
	icon: <M />,
	save,
} );



