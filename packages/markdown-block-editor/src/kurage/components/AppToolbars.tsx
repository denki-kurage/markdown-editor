// @ts-ignore
import { BlockControls } from '@wordpress/block-editor';
import {
	Modal,
	ToolbarButton,
	ToolbarGroup,
	type IconType,
} from '@wordpress/components';
import { useMemo, useState } from '@wordpress/element';
import type { ReactNode } from 'react';
import { __ } from '@wordpress/i18n';
import BlogCardGenerator from './dialogs/BlogCardGenerator';
import { CommandToolbarGroup } from './CommandToolbarGroup';
import ImageUploadEditor from './dialogs/ImageUploadEditor';
import { LinkEditor } from './dialogs/LinkEditor';
import { useExtensionContexts } from '../markdown-react-editor/hooks';
import { useMarkdownEditorComponentAdapter } from '../markdown-react-editor/context/markdown-editor-component-adapter';
import { filterActiveCommands } from '../markdown-react-editor/IMarkdownEditorComponentAdapter';

const AppToolbars = () => {
	const contexts = useExtensionContexts();
	const componentAdapter = useMarkdownEditorComponentAdapter();
	const activeCommandItems = useMemo(() => {
		const commands = componentAdapter.getToolbarCommandItems(contexts);
		return filterActiveCommands(commands);
	}, [contexts, componentAdapter]);

	

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarDialog
						icon="media-default"
						title={ __( 'Add Image', 'markdown-block-editor' ) }
					>
						{ close  => <ImageUploadEditor onExecuted={ close } />　}
					</ToolbarDialog>
					<ToolbarDialog
						icon="archive"
						title={ __( 'Add Blog Card', 'markdown-block-editor' ) }
					>
						{ ( close ) => <BlogCardGenerator onExecuted={ close } /> }
					</ToolbarDialog>
					<ToolbarDialog
						icon="admin-links"
						title={ __( 'Add Link', 'markdown-block-editor' ) }
					>
						{ ( close ) => <LinkEditor onExecuted={ close } /> }
					</ToolbarDialog>
				</ToolbarGroup>
			</BlockControls>

			<BlockControls>
				{ activeCommandItems.map( ( item ) => (
					<CommandToolbarGroup key={ item.name } groupRoot={ item } />
				) ) }
			</BlockControls>
		</>
	);
};

type ToolbarDialogProps = {
	icon: IconType;
	title: string;
	children: ( close: () => void ) => ReactNode;
};

export const ToolbarDialog = ( {
	icon,
	title,
	children,
}: ToolbarDialogProps ) => {
	const [ isOpen, setIsOpen ] = useState( false );
	const close = () => setIsOpen( false );

	return (
		<>
			<ToolbarButton
				icon={ icon }
				label={ title }
				onClick={ () => setIsOpen( true ) }
			/>
			{ isOpen && (
				<Modal
					style={ { width: '60%' } }
					title={ title }
					onRequestClose={ close }
				>
					{ children( close ) }
				</Modal>
			) }
		</>
	);
};

export default AppToolbars;
