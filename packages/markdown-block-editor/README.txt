=== Markdown with Block Editor ===
Contributors: denkikurage
Tags: markdown, vscode
Tested up to: 6.9
Stable tag: 0.1.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Requires at least: 6.8
Requires PHP: 8.0.30


You can edit markdown in a VSCode-like editor on the block editor.

== Description ==

You can write Markdown using a VSCode-like editor. 
It provides minimal functionality for editing Markdown.
for example. (add bold, strikethrough, text decorations, adding images, code highlighting, and table formatting, etc...)


== Screenshots ==

1. add Markdown block editor.
2. Supports code (```, ~~~), heading (#), and table (n*n) suggestions.
3. You can apply B (bold), I (italic), and S (strikethrough) from the toolbar.


== Installation ==

1. Go to the admin screen
2. Open the "Plugins" item and click "Add New Plugin"
3. Enter "Markdown" in the search box.
4. Find "Markdown with Block Editor" and click "Install"


== Frequently Asked Questions == 


= What can this plugin do? =

You can edit Markdown while viewing a preview in the block editor.
Please see the link below for detailed instructions on how to use it.

https://github.com/denki-kurage/markdown-editor/blob/master/packages/markdown-block-editor/document/readme.en.md


= The IME display position is shifted. =

We are aware of this bug.
The Monaco Editor used internally does not take IFrame into account,
which is why the misalignment occurs.
We cannot address this issue until the Monaco Editor is fixed.


= Can I see the source code? =

The source code is here.

https://github.com/denki-kurage/markdown-editor/tree/master/packages/markdown-block-editor


This software uses the following packages:

https://github.com/denki-kurage/markdown-editor/blob/master/packages/markdown-block-editor/THIRD-PARTY-NOTICES.txt
https://github.com/denki-kurage/markdown-editor/blob/master/packages/markdown-core/THIRD-PARTY-NOTICES.txt







== Changelog ==

= 0.1.0 =
* Release

== Upgrade Notice ==


= 0.1.0 =
* Release



