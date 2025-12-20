import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import AppToolbars from './components/AppToolbars';
import TokenInspectors from './components/token-inspectors';
import { MarkdownContextProviderWrapper, useMarkdownContext } from './context/markdown-context';
import { useMarkdownEditorGenerator } from './components/editor-wrapper';
import { useEditorInterlocking } from './useEditorInterlocking';
import { MarkdownTokenContextProviderWrapper } from './context/markdown-token-context';
import { MarkdownAppContextWrapper, useMarkdownAppContext } from './context/markdown-app-context';

import { MarkdownEditorContextProviderWrapper, useMarkdownEditorContext } from './context/markdown-editor-context';
import { CommandsInspector } from './components/CommandsInspector';
import { ControlPanel } from './components/ControlPanel';
//import Prism from 'prismjs'

import './editor.scss';
import './components/token-viewer.scss'
import { EditorSettings } from './components/EditorSettings';
import { MarkdownViewer } from './components/MarkdownViewer';


const str = `
| fruits | price | color  | pr |
|--------|-------|--------|----|
| apple  | 200   | red | 1  |
 grape  | 1200  | purple | 22 |
| banana | 160   | yellow | 3  |ff
| melon  | 2000  | green  | 51 |
`;

const standardizeReturnKey = (str: string) => str.replace(/\r\n|\n/g, "\n");


const Edit = ({ attributes, setAttributes, ...props }: any) =>
{
	const { clientId } = props;
	return (
		<MarkdownContextProviderWrapper attributes={attributes} setAttributes={setAttributes} standardizeReturnKey={standardizeReturnKey}>
			<MarkdownAppContextWrapper>
				<MarkdownEditorContextProviderWrapper clientId={clientId} {...props}>
					<MarkdownTokenContextProviderWrapper>
						<InternalBlockEditor />
					</MarkdownTokenContextProviderWrapper>
				</MarkdownEditorContextProviderWrapper>
			</MarkdownAppContextWrapper>
		</MarkdownContextProviderWrapper>
	)
};

const EditMemo = React.memo(Edit);

export default EditMemo;


const InternalBlockEditor = () =>
{
	const { editorState, blockEditorProps } = useMarkdownEditorContext();
	const { isSelected } = blockEditorProps;
  	const className = editorState.maximized && isSelected ? 'block-editor-maximizer' : '';
	return (
		<div { ...useBlockProps({ className }) }>
			<div className="wp-block-kurage-worker-md-table-editor-label">MdTableEditor with Block Editor</div>
			<EditorPanel />
		</div>
	)
}

const EditorPanel = () =>
{
	const { editHeight, setAttributes } = useMarkdownContext();

	return (
		<>
			<ControlPanelInspector />

			<AppToolbars />
 
			<MainEditor editorName="monaco" />

			<CommandsInspector />
			
			<TokenInspectors />
			
		</>
	)
}


const MainEditor = ({ editorName }: any) =>
{
	const { markdown, viewMode, editHeight } = useMarkdownContext();
	const { appContext, updateAppContext } = useMarkdownAppContext();
	const [win, setWin] = useState<Window|undefined>();
	const { name, EditorComponent } = useMarkdownEditorGenerator(editorName);
	
	useEffect(() => {
		if(win)
		{
			const { dispose, editReveal, viewScroll } = useEditorInterlocking(appContext, win);
			return () => dispose();
		}
	}, [appContext, win]);

	
	const isBoth = viewMode === 'both';
	const both = { width: "50%" };
	const full = { width: "100%" };
	const none = { display: "none" };
	const styles = isBoth ? [both, both] : (viewMode === 'code' ? [full, none] : [none, full]);
	
	return (
		<SplitPanel height={editHeight}>
			<Panel style={styles[0]}>
				<EditorComponent initializedMarkdownCore={updateAppContext} />
			</Panel>
			<Panel style={styles[1]}>
				<MarkdownViewer markdown={markdown} setWindow={setWin} />
			</Panel>
		</SplitPanel>
	)
}

const ControlPanelInspector = () =>
{
	return (
		<InspectorControls>
			<PanelBody title="操作パネル">
				<ControlPanel />
			</PanelBody>
			<PanelBody title="設定パネル">
				<EditorSettings />
			</PanelBody>
		</InspectorControls>
	)
}



const SplitPanel = ({children, height}: any) =>
{
	const { editorState, blockEditorProps } = useMarkdownEditorContext();
	const { isSelected } = blockEditorProps;

	const isMax = editorState.maximized && isSelected;

    // @ts-ignore
    const post: any = useSelect(select => select(editorStore).getCurrentPost(), []);

	const style = { height: isMax ? '100%' : height ?? post?.md_table_editor_height ?? '500px' };

	return (
		<div className="md-table-editor split-panel" style={style}>
			{children}
		</div>
	)
}

const Panel = ({children, style}: any) =>
{


	return (
		<div className="width-panel" style={style}>
			{children}
		</div>
	)
}




