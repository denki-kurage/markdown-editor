
export * from './context';
export * from './components';


import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import Save from './save';

export { Edit, Save };

// @ts-ignore
import metadata from './block.json';

// @ts-ignore
import { ReactComponent as M } from './m.svg';

// @ts-ignore
registerBlockType( metadata.name, {

	edit: Edit,
	icon: <M />,
	save: Save,
} );



//console.log("x222")


export const x = 3;













