
import { useBlockProps } from '@wordpress/block-editor';

export const Save = ({attributes}: any) =>
{
	/**
	 * html属性をそのまま表示するにとどめる。
	 * これはマークダウンのレンダラが毎回同じHTMLを出力することを保証できず、
	 * それによってブロックエディタがエラーになることを避ける。
	 * markdown属性に変更が加わるときにhtml属性も同時に変更される仕様になっている。
	 */
	const { html } = attributes;
	
	// const html = parseSaveMarkdown(markdown);
	return <div { ...useBlockProps.save({ className: 'markdown-content-style' }) } dangerouslySetInnerHTML={{ __html: html }}></div>
}

export default Save;
