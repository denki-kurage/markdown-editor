# Gutenberg 依存コンポーネント

`@wordpress/i18n`、`@wordpress/hooks`、`@wordpress/element` の React 相当フックのみを使う箇所は、主な移行対象から除外しています。

## ブロックエディターとの結びつきが強いもの

Gutenberg のブロック領域、メディア選択、ツールバーなどに直接依存しています。標準 React 要素への置き換えだけでは動作を維持できない可能性が高く、移行時には役割や UI の配置も検討してください。

- [ImageUploadEditor.tsx](../../../components/ImageUploadEditor.tsx) — `MediaPlaceholder`、`useSelect`
- [LinkEditor.tsx](../../../components/LinkEditor.tsx) — Gutenberg の `LinkControl`
- [AppToolbars.tsx](../../../components/AppToolbars.tsx) — `BlockControls`
- [CommandsInspector.tsx](../../../components/CommandsInspector.tsx) — `InspectorControls`
- [token-inspectors.tsx](../../../components/token-inspectors.tsx) — `InspectorControls`
- [edit.tsx](../../../edit.tsx) — `InspectorControls`、`useBlockProps`、`@wordpress/data`、`@wordpress/editor`
- [save.tsx](../../../save.tsx) — `useBlockProps`（ブロック保存用）
- [index.tsx](../../../index.tsx) — `registerBlockType`（ブロック登録。UI コンポーネントではありません）

## Gutenberg の UI 部品に依存しているもの

標準 HTML 要素への置き換えを検討しやすい候補です。

- [ControlPanel.tsx](../../../components/ControlPanel.tsx) — `Button`、`Modal`、`SelectControl`
- [BeginnerAssist.tsx](../../../components/BeginnerAssist.tsx) — `Button`、選択・入力コントロール
- [token-editor-forms/token-editors.tsx](../../../components/token-editor-forms/token-editors.tsx) — `Button`、`SelectControl`、`TextControl`
- [inspector-hooks.tsx](../../../components/inspector-hooks.tsx) — `Button`、`TextareaControl`
- [edit-toolbar.tsx](../../../components/edit-toolbar.tsx) — Gutenberg のツールバー部品
- [Loading.tsx](../../../components/Loading.tsx) — `Spinner`
- [BlogCardGenerator.tsx](../../../components/BlogCardGenerator.tsx) — 入力 UI、通知ストア、`useDispatch`

## Gutenberg のデータストア／レジストリに依存しているもの

UI の置き換えに加えて、データ取得・更新方法の移行も必要です。

-[*] [MonacoEditor.tsx](../../../components/MonacoEditor.tsx) — `@wordpress/data` の `useSelect`
- [withRegistryProvider.tsx](../../../components/withRegistryProvider.tsx) — `RegistryProvider`、`createRegistry`、`useRegistry`
- [use-wordpress.tsx](../../../context/use-wordpress.tsx) — `useSelect`、`useDispatch` を使う連携フック
- [store/index.ts](../../../store/index.ts)、[store/reducer.ts](../../../store/reducer.ts) — `@wordpress/data` によるストア実装（UI コンポーネントではありません）

## 拡張パッケージ側

拡張パッケージも移行対象に含める場合に確認してください。

- [token-explorer.tsx](../../../../markdown-block-editor-extensions/src/token-explorer.tsx) — 選択・チェック・モーダル等
- [token-checker-modal.tsx](../../../../markdown-block-editor-extensions/src/token-checker-modal.tsx) — ボタン・チェック・モーダル
- [SnippetSettings.tsx](../../../../markdown-block-editor-extensions/src/SnippetSettings.tsx) — ボタン・モーダル・テキスト入力
- [ExtensionSettings.tsx](../../../../markdown-block-editor-extensions/src/ExtensionSettings.tsx)、[token-editors.tsx](../../../../markdown-block-editor-extensions/src/token-editors.tsx) — Gutenberg のコントロール部品

## 着手候補

UI 中心の [ControlPanel.tsx](../../../components/ControlPanel.tsx)、[BeginnerAssist.tsx](../../../components/BeginnerAssist.tsx)、[token-editor-forms/token-editors.tsx](../../../components/token-editor-forms/token-editors.tsx)、[inspector-hooks.tsx](../../../components/inspector-hooks.tsx) は、設定フォームと同様の方法で進めやすい候補です。

旧 [EditorSettings.tsx](../../../components/EditorSettings.tsx) には `EditorSettingsBu` の実装も残っています。移行後は、旧実装への参照や不要になった Gutenberg import が残っていないか確認してください。
