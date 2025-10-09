import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { MarkdownTokenContextProviderWrapper } from './context/markdown-token-context';
import { MarkdownAppContextWrapper, useAppContext } from './context/Markdown-app-context';
import { EventUpdateManager } from '@mde/markdown-core';
import { parseEditMarkdown } from './components/parser';
import { CommandToolbar, FlatCommandToolbar } from './components/edit-toolbar';

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
export default ({ attributes, setAttributes }: any) =>
{
	return (
		<div { ...useBlockProps() }>
			<MarkdownContextProviderWrapper attributes={attributes} setAttributes={setAttributes} standardizeReturnKey={standardizeReturnKey}>
				<MarkdownAppContextWrapper>
					<MarkdownTokenContextProviderWrapper>
						<div className="wp-block-kurage-worker-md-table-editor-label">MdTableEditor with Block Editor</div>
						<EditorPanel />
					</MarkdownTokenContextProviderWrapper>
				</MarkdownAppContextWrapper>
			</MarkdownContextProviderWrapper>
		</div>

	)
}
const EditorPanel = () =>
{
	const { editHeight, setAttributes } = useMarkdownContext();
	const { markdownCore } = useAppContext();



	return (
		<>

			<ControlPanelInspector />


			<AppToolbars />
{/* 
			<CommandToolbar />
			<FlatCommandToolbar />
 */}
 
			<MainEditor editorName="monaco" />

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
	const { appContext, updateAppContext } = useAppContext();
	const [win, setWin] = useState<Window|undefined>();
	const { name, EditorComponent } = useMarkdownEditorGenerator(editorName);
	
	useEffect(() => {
		if(appContext && win)
		{
			const d = useEditorInterlocking(appContext, win);
			return () => d.dispose();
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
				{ appContext && <MarkdownViewer value={markdown} setWindow={setWin} /> }
			</Panel>
		</SplitPanel>
	)
}

const ControlPanelInspector = () =>
{	
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
			</PanelBody>
		</InspectorControls>
	)
}


const MarkdownViewer = ({value, setWindow}: { value: string, setWindow: (win: Window) => void }) =>
{
	const frameRef = useRef(null);
	const valueRef = useRef(value);

	const [isLoading, setIsLoading] = useState(false);
	const [updateManager, setUpdateManager] = useState<EventUpdateManager|undefined>(undefined);


	useEffect(() => {
		valueRef.current = value;
		updateManager?.lazyUpdate();
		setIsLoading(true);
	}, [value]);


	useEffect(() => {
		// @ts-ignore
		const win = frameRef?.current.contentWindow;
		setWindow(win);
	}, [frameRef.current])


	useEffect(() => {
		const updater = new EventUpdateManager(800);
		updater.updated.push(() =>
		{

			const value = valueRef.current;

			//
			// xxxxxxxxxxxxxxxxxx
			//
			//const parsedCode = parseMarkdown(value);
			const parsedCode = parseEditMarkdown(value, true);

			const html = `<div class="markdown-content-style">${parsedCode}</div>`;

			const iframe = frameRef.current;
			// @ts-ignore
			const doc = (iframe?.contentDocument ?? iframe?.contentWindow.document);

			if(doc)
			{
				doc.body.innerHTML = html;

				// @ts-ignore
				window.Prism.highlightAllUnder(doc);

				if(!doc.head.hasChildNodes())
				{
					const scripts = [
					//'<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" rel="stylesheet" />',
					//'<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />',
					//'<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>',
					//'<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>'
					].join("\n");
					
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

					doc.head.innerHTML = scripts;
					doc.head.appendChild(fragment);					
				}

			}

			setIsLoading(false);
		});

		updater.lazyUpdate();
		setUpdateManager(updater);

		return () => updater.dispose();
	}, []);


	
	return (
		<div>
			<iframe className='width-panel' ref={frameRef}></iframe>
			<Loading isLoading={isLoading} />
		</div>
	)
}

const Loading = ({isLoading}: any) =>
{
	const style: any = {
		position: 'absolute',
		top: 0,
		width: "100%",
		height: "100%",
	};

	return (
		<>
			{ isLoading &&
				<>
				<div style={{...style, opacity: 0.5, backgroundColor: "white"}}></div>
				<div style={{...style, alignContent: "center", textAlign: "center"}}>
					<Spinner style={{width: 100, height: 100}} />
				</div>
				</>
			}
		</>
	)
}


const SplitPanel = ({children, height}: any) =>
{
    // @ts-ignore
    const post: any = useSelect(select => select(editorStore).getCurrentPost(), []);

	const style = { height: height ?? post?.md_table_editor_height ?? undefined };

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




