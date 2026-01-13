<?php
/**
 * Plugin Name:       Markdown Extensions
 * Description:       Example block scaffolded with Create Block tool.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           Kurage Licence
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       markdown-extensions
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

add_action( 'init', function(){

	

/*
	load_plugin_textdomain(
		'markdown-block-editor',
		false,
		'markdown-block-editor/languages'
	);
*/

	//$x = register_block_type( __DIR__ . '/build/kurage' );
	//$handle = $x->editor_script_hadn


	

});



add_action(
	'admin_enqueue_scripts',
	function()
	{
		$pdir = plugin_dir_path(__FILE__);
		$purl = plugin_dir_url(__FILE__);
		$deps = include('extensions.asset.php');
		$deps = $deps['dependencies'];
		wp_enqueue_script(
			'markdown-block-editor-extensions',
			$purl . 'extensions.js',
			$deps
		);

		wp_enqueue_style(
			'markdown-block-editor-extensions',
			$purl . 'extensions.css'
		);

	}
);
