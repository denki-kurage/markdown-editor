import { useEffect, useState, memo, useMemo } from "@wordpress/element";
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Spinner } from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import AppToolbars from './components/AppToolbars';
import TokenInspectors from './components/TokenInspectors';
import { useEditorInterlocking } from './useEditorInterlocking';

import { ContextProviders } from './markdown-react-editor/context/context-providers';
import { CommandsInspector } from './components/CommandsInspector';
//import Prism from 'prismjs'

import './editor.scss';
import { ControlPanels, EditorSettings } from './components/GutenEditorSettings';
import { MarkdownViewer } from './components/MarkdownViewer';
import { __ } from '@wordpress/i18n';
import { useWordPressComponentViewModels, useWordPressContextServices } from "./use-wordpress";
import { useMarkdownEditorStateContext } from "./markdown-react-editor/context/markdown-editor-state-context";
import { useMarkdownEditorAttributeContext } from "./markdown-react-editor/context/markdown-editor-attribute-context";
import { MarkdownCoreReadyGuard, useMarkdownCoreContext, useMarkdownCoreSessionInternal } from "./markdown-react-editor/context/markdown-core-context";
import { ISnippet } from "@kurage/markdown-core";
import { applyFilters } from "@wordpress/hooks";
import { MarkdownEditorComponent } from "./markdown-react-editor/components/EditorType";
import { MonacoEditor } from "./markdown-react-editor/components/MonacoEditor";
import { GutenMarkdownEditorComponentAdapter } from "./components/GutenMarkdownEditorComponentAdapter";


const str = `
| fruits | price | color  | pr |
|--------|-------|--------|----|
| apple  | 200   | red | 1  |
 grape  | 1200  | purple | 22 |
| banana | 160   | yellow | 3  |ff
| melon  | 2000  | green  | 51 |
`;


const Edit = ({ attributes, setAttributes, ...props }: any) =>
{
	const { clientId } = props;
	const contextServices = useWordPressContextServices(attributes, setAttributes, props);
	const componentViewModels = useWordPressComponentViewModels(contextServices);

	if(!contextServices)
	{
		return <p>Context Services loading</p>
	}
	
	if(!componentViewModels)
	{
		return <p>ViewModel Loading</p>;
	}

	const settings = contextServices?.contextData?.settings;
	console.log(settings)

	const { contextService, contextData } = contextServices;

	console.log(`PPPPPPPPPPPPPPPPPPPPP {contextServices?.}`)
	const componentAdapter = new GutenMarkdownEditorComponentAdapter();

	return (
		<ContextProviders
			attributes={attributes}
			contextService={contextService}
			contextData={contextData}
			viewModels={componentViewModels}
			componentAdapter={componentAdapter}
			clientId={clientId}
			blockEditorProps={props}
			loadingComponent={() => <Spinner />} >
			<InternalBlockEditor />
		</ContextProviders>
	);
	
};

const EditMemo = memo(Edit);

export default EditMemo;


const InternalBlockEditor = () =>
{
	const { editorState, blockEditorProps } = useMarkdownEditorStateContext();
	const { isSelected } = blockEditorProps;
  	const className = editorState.maximized && isSelected ? 'block-editor-maximizer' : '';
	return (
		<div { ...useBlockProps({ className }) }>
			<div className="wp-block-kurage-worker-markdown-block-editor-label">Markdown Block Editor</div>
			<EditorPanel />
		</div>
	)
}

const EditorPanel = () =>
{
	const { editHeight } = useMarkdownEditorAttributeContext();

	return (
		<>
			<MarkdownCoreReadyGuard>
				<ControlPanelInspector />
				<AppToolbars />				
			</MarkdownCoreReadyGuard>
 
			<MainEditor editorName="monaco" />

			<MarkdownCoreReadyGuard>
				<CommandsInspector />
				<TokenInspectors />
			</MarkdownCoreReadyGuard>
			
		</>
	)
}


const MainEditor = ({ editorName }: any) =>
{
	const { markdown, viewMode, editHeight } = useMarkdownEditorAttributeContext();
	const { updateEditorContext } = useMarkdownCoreContext();
	const { editorContext: appContext, markdownCore: core } = useMarkdownCoreSessionInternal() ?? {};
	
	const [win, setWin] = useState<Window|undefined>();
	const EditorComponent: MarkdownEditorComponent = MonacoEditor;
	const snippets =  useMemo<ISnippet[]>(() => {
		return core ? applyFilters('markdown_block_editor_custom_snippets', [], core) as ISnippet[] : [];
	}, []);

    const editorStyles: string[] = useMemo(() => applyFilters('markdown_block_editor_editor_styles', []), []) as string[];

	
	useEffect(() => {
		if(win && appContext)
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
				<EditorComponent
					snippets={snippets}
					editorStyles={editorStyles}
					initializedAppContext={updateEditorContext} />
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
			<PanelBody title={__('Control Panel', 'markdown-block-editor')}>
				<ControlPanels />
			</PanelBody>
			<PanelBody title={__('Settings Panel', 'markdown-block-editor')}>
				<EditorSettings />
			</PanelBody>
		</InspectorControls>
	)
}



const SplitPanel = ({children, height}: any) =>
{
	const { editorState, blockEditorProps } = useMarkdownEditorStateContext();
	const { isSelected } = blockEditorProps;

	const isMax = editorState.maximized && isSelected;

    // @ts-ignore
    const post: any = useSelect(select => select(editorStore).getCurrentPost(), []);

	const style = { height: isMax ? '100%' : height ?? post?.md_table_editor_height ?? '500px' };

	return (
		<div className="markdown-block-editor split-panel" style={style}>
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




