import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import './editor.scss';
import { Button, PanelBody, Spinner } from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import AppToolbars from './components/app-toolbars';
import { BasicInspectors } from './components/basic-inspectors';
import TokenInspectors from './components/token-inspectors';
import { MarkdownContextProviderWrapper, useMarkdownContext } from './context/markdown-context';
import { useMarkdownEditorGenerator } from './components/editor-wrapper';
import { useEditorInterlocking } from './useEditorInterlocking';
import { MarkdownTokenContextProviderWrapper, useMarkdownTokenContext } from './context/markdown-token-context';
import { MarkdownAppContextWrapper, useMarkdownAppContext } from './context/markdown-app-context';
import { EventUpdateManager, IToken } from '@mde/markdown-core';
import { parseEditMarkdown } from './components/parser';
import { applyFilters, doAction } from '@wordpress/hooks';
import { MarkdownEditorContextProviderWrapper, useMarkdownEditorContext } from './context/markdown-editor-context';
import './components/token-viewer.scss'
import { CommandsInspector } from './components/commands-inspector';
import { Loading } from './components/loading';
import { ExtensionContextProvider, MarkdownExtensionContextWrapper } from './context/markdown-extension-context';
import { MarkdownConfigContextWrapper } from './context/markdown-config-context';
import { withEditorRegistryComponent } from './components/withRegistryProvider';
//import Prism from 'prismjs'

const str = `
| fruits | price | color  | pr |
|--------|-------|--------|----|
| apple  | 200   | red | 1  |
 grape  | 1200  | purple | 22 |
| banana | 160   | yellow | 3  |ff
| melon  | 2000  | green  | 51 |
`;

type EditMode = "code"|"view"|"both";
const standardizeReturnKey = (str: string) => str.replace(/\r\n|\n/g, "\n");


const Edit = ({ attributes, setAttributes, ...props }: any) =>
{
	const { clientId } = props;
	return (
		<MarkdownContextProviderWrapper attributes={attributes} setAttributes={setAttributes} standardizeReturnKey={standardizeReturnKey}>
			<MarkdownAppContextWrapper>
				<MarkdownEditorContextProviderWrapper clientId={clientId} {...props}>
					<MarkdownTokenContextProviderWrapper>
						<MarkdownConfigContextWrapper>
							<InternalBlockEditor />
						</MarkdownConfigContextWrapper>
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
			
			<InspectorControls>

				<BasicInspectors 
					editHeight={editHeight}
					onEditHeightChanged={editHeight => setAttributes({editHeight: editHeight || null})}
				/>

			</InspectorControls>
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
	const { editorState, setEditorState } = useMarkdownEditorContext();

	const { viewMode, setAttributes } = useMarkdownContext();
	const onPanelChange = (viewMode: EditMode) =>
	{
		setAttributes({viewMode});
	}


	return (
		<InspectorControls>
			<PanelBody title="操作パネル">
				<div className="button-group" >
					<Button variant="primary" disabled={viewMode === "code"} onClick={() => onPanelChange("code")}>{ __('Code', 'mdtableeditor') }</Button>
					<Button variant="primary" disabled={viewMode === "view"} onClick={() => onPanelChange("view")}>{ __('View', 'mdtableeditor') }</Button>
					<Button variant="primary" disabled={viewMode === "both"} onClick={() => onPanelChange("both")}>{ __('Both', 'mdtableeditor') }</Button>
				</div>

				<Button variant="primary" onClick={() => setEditorState({ maximized: !editorState.maximized})}>
					{ editorState.maximized ? '元に戻す' : '最大化' }
				</Button>
			</PanelBody>
		</InspectorControls>
	)
}


const MarkdownViewer = ({markdown, setWindow}: { markdown: string, setWindow: (win: Window) => void }) =>
{
	const tokenContext = useMarkdownTokenContext();
	const { singleToken } = tokenContext;
	const { isEditing, setIsEditing } = useMarkdownContext();

	const frameRef = useRef(null);
	const docRef = useRef<Document|undefined>(undefined);

	const [updateManager, setUpdateManager] = useState<EventUpdateManager|undefined>(undefined);


	const renderHtmlRef = useRef<any>(null);
	renderHtmlRef.current = useCallback(() => {
			const parsedCode = parseEditMarkdown(markdown, true);
			const html = `<div class="markdown-content-style">${parsedCode}</div>`;

			const iframe = frameRef.current;
			// @ts-ignore
			const doc = (iframe?.contentDocument ?? iframe?.contentWindow.document);

			// docを更新
			docRef.current = doc;

			if(doc)
			{
				doc.body.innerHTML = html;

				doAction('extensionDomChanged', doc, markdown, () => tokenContext);

				// @ts-ignore
				window.Prism.highlightAllUnder(doc);

				// 
				if(!doc.head.hasChildNodes())
				{
					const createLink = (link: string) =>
					{
						const elm = document.createElement("link");
						Object.entries({ rel: 'stylesheet', type: "text/css", href: link }).map(p => elm.setAttribute(...p))
						return elm;
					}
					const fragment = doc.createDocumentFragment();
					const metas = [...window.document.querySelectorAll('meta[property="is-markdown-content-style"], meta[content^=http]')];
					// @ts-ignore
					metas.map(meta => fragment.appendChild(createLink(meta.content)));

					doc.head.appendChild(fragment);

					doAction('extensionHeaderInitalize', doc);
				}

			}
			
			setIsEditing(false);


	}, [markdown, tokenContext, setIsEditing]);

	useEffect(() => {
		updateManager?.lazyUpdate();
		setIsEditing(true);
	}, [markdown]);

	useEffect(() => {
		// @ts-ignore
		const win = frameRef?.current.contentWindow;
		setWindow(win);

	}, [frameRef.current])


	// 選択トークンの位置までスクロールとハイライト
	useEffect(() => {
		if(!docRef.current || !singleToken)
		{
			return;
		}
		const execute = applyFilters(
			'extensionSingleTokenChanged',
			(token: IToken, doc: Document) => () => {}
		) as any;

		const dispose = execute(singleToken, docRef.current);

		return () => dispose();



	}, [singleToken]);


	useEffect(() => console.log("★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★"), [])


	useEffect(() => {
		const updater = new EventUpdateManager(5000);
		updater.updated.push(() =>
		{
			renderHtmlRef.current();
		});

		updater.lazyUpdate();
		setUpdateManager(updater);

		return () => updater.dispose();
	}, []);


	
	return (
		<div>
			<iframe className='width-panel' ref={frameRef}></iframe>
			<Loading isLoading={isEditing} />
		</div>
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




