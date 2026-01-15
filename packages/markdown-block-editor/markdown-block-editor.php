<?php
/**
 * Plugin Name:       Markdown with Block Editor
 * Description:       You can edit markdown in a VSCode-like editor on the block editor.
 * Version:           0.1.0
 * Requires at least: 6.8
 * Requires PHP:      8.0.30
 * Author:            denkikurage
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       markdown-block-editor
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}




#define( 'WP_DEBUG', true );






add_action( 'init', function(){
	$pdir = plugin_dir_path(__FILE__);

/*
	load_plugin_textdomain(
		'markdown-block-editor',
		false,
		'markdown-block-editor/languages'
	);
*/

	$x = register_block_type( __DIR__ . '/build/kurage' );
	//$handle = $x->editor_script_hadn


	

	$handle = generate_block_asset_handle('denkikurage/markdown-block-editor', 'editorScript');

	wp_set_script_translations(
		$handle,
		'markdown-block-editor',
		$pdir . 'languages'
	);



});

add_action( 'after_setup_theme', function(){
	add_theme_support('align-wide');
});




add_filter('markdown_block_editor_front_themes', function($themes){
	$pluginPath = plugin_dir_url(__FILE__);
	$themes['none'] = ['なし', ''];
	$themes['default'] = ['デフォルト', $pluginPath . "front-themes/default.css"];
	return $themes;
});

add_filter('markdown_block_editor_admin_themes', function($themes){
	$pluginPath = plugin_dir_url(__FILE__);
	$themes['none'] = ['なし', ''];
	$themes['default'] = ['デフォルト', $pluginPath . "front-themes/default.css"];
	return $themes;
});


add_filter('markdown_block_editor_prism_themes', function($themes){
	$pluginPath = plugin_dir_url(__FILE__);
	$themes['coy'] = ['Coy', $pluginPath . "prismjs/coy/prism"];
	$themes['dark'] = ['Dark', $pluginPath . "prismjs/dark/prism"];
	$themes['default'] = ['Default', $pluginPath . "prismjs/default/prism"];
	$themes['funkey'] = ['Funkey', $pluginPath . "prismjs/funkey/prism"];
	$themes['okaidia'] = ['Okaidia', $pluginPath . "prismjs/okaidia/prism"];
	$themes['solarized'] = ['Solarized', $pluginPath . "prismjs/solarized/prism"];
	$themes['tommorow'] = ['Tommorow', $pluginPath . "prismjs/tommorow/prism"];
	$themes['twilight'] = ['Twilight', $pluginPath . "prismjs/twilight/prism"];
	return $themes;
});

add_filter('markdown_block_editor_monaco_themes', function($themes){
	$themes['vs'] = 'VS Light';
	$themes['vs-dark'] = 'VS Dark';
	$themes['hc-black'] = 'High Contrast Black';
	$themes['hc-light'] = 'High Contrast Light';
	return $themes;
});



add_action('init', function(){

	$defaultOptions = [
		'fontSize' => 12,
		'fontFamily' => '',
		'prismTheme' => 'tommorow',
		'monacoTheme' => 'vs-dark',
		'frontTheme' => 'default',
		'adminTheme' => 'default',
		"previewInterval" => 1000,
		'configurations' => new stdClass
	];
	$pluginPath = plugin_dir_url(__FILE__);

	$settings = get_option('markdown_block_editor_settings', $defaultOptions);

	$frontTheme = $settings['frontTheme'] ?? $defaultOptions['frontTheme'];
	$prismTheme = $settings['prismTheme'] ?? $defaultOptions['prismTheme'];

	$frontMap = apply_filters('markdown_block_editor_front_themes', []);
	$adminMap = apply_filters('markdown_block_editor_admin_themes', []);

	$frontCss = $frontMap[$frontTheme] ?? ['', ''];
	$adminCss = $adminMap[$frontTheme] ?? ['', ''];

	add_action('wp_enqueue_scripts', function() use($frontCss, $pluginPath, $prismTheme){
		$frontCss = $frontCss[1] ?? '';
		if($frontCss)
		{
			wp_enqueue_style('markdown_block_editor_front_css', $frontCss);
		}
		wp_enqueue_style('markdown_block_editor_prism_theme', $pluginPath . "prismjs/{$prismTheme}/prism.css");
		wp_enqueue_script('markdown_block_editor_prism_theme', $pluginPath . "prismjs/{$prismTheme}/prism.js");
	});

	function markdown_block_editor_check_nonce()
	{
		$nonce1 = isset($_REQUEST['_wpnonce']) ? sanitize_text_field(wp_unslash($_REQUEST['_wpnonce'])) : null;
		$nonce2 = isset($_SERVER['HTTP_X_WP_NONCE']) ? sanitize_text_field(wp_unslash(($_SERVER['HTTP_X_WP_NONCE']))) : null;
		$nonce = $nonce1 ?? $nonce2 ?? '';

		if(!wp_verify_nonce( $nonce, 'wp_rest' ))
		{
			return new WP_Error( 'rest_cookie_invalid_nonce', 'nonce error!', array( 'status' => 403 ) );
		}

		return true;
	}

	
	add_action('rest_api_init', function() use($defaultOptions){

		register_rest_route(
			'markdown-block-editor/v1',
			'/settings',
			[
				[
					'methods' => WP_REST_Server::READABLE,
					'callback' => function(WP_REST_Request $request) use($defaultOptions)
					{
						$data = get_option('markdown_block_editor_settings', $defaultOptions);
						return rest_ensure_response($data);
					},
					'permission_callback' => fn() => current_user_can('manage_options'),
				],
				[
					'methods' => WP_REST_Server::CREATABLE,
					'callback' => function(WP_REST_Request $request) use($defaultOptions)
					{
						$data = [];
						foreach($defaultOptions as $k => $v)
						{
							$data[$k] = $request->get_param($k) ?? $v;
						}

						update_option('markdown_block_editor_settings', $data);
						return rest_ensure_response($data);
					},
					'permission_callback' => fn() => current_user_can('manage_options'),
					'validate_callback' => fn() => markdown_block_editor_check_nonce(),
					'args' => json_decode(file_get_contents('schema.json', true), true)['properties']
				],
				'permission_callback' => fn() => current_user_can('manage_options'),
			]
		);

		register_rest_route(
			'markdown-block-editor/v1',
			'/setting-options',
			[
				[
					'methods' => WP_REST_Server::READABLE,
					'callback' => function(WP_REST_Request $request) use($defaultOptions)
					{
						$frontThemes = apply_filters('markdown_block_editor_front_themes', []);
						$adminThemes = apply_filters('markdown_block_editor_admin_themes', []);
						$prismThemes = apply_filters('markdown_block_editor_prism_themes', []);
						$monacoThemes = apply_filters('markdown_block_editor_monaco_themes', []);
						$themeUrl = get_template_directory_uri();

						$frontThemes = array_map(fn($v, $k) => ['key' => $k, 'name' => $v[0], 'url' => $v[1]], $frontThemes, array_keys($frontThemes));
						$adminThemes = array_map(fn($v, $k) => ['key' => $k, 'name' => $v[0], 'url' => $v[1]], $adminThemes, array_keys($adminThemes));
						$prismThemes = array_map(fn($v, $k) => ['key' => $k, 'name' => $v[0], 'url' => $v[1]], $prismThemes, array_keys($prismThemes));
						$monacoThemes = array_map(fn($v, $k) => ['key' => $k, 'name' => $v], $monacoThemes, array_keys($monacoThemes));


						$data = [
							'frontThemes' => $frontThemes,
							'adminThemes' => $adminThemes,
							'prismThemes' => $prismThemes,
							'monacoThemes' => $monacoThemes,
							'themeUrl' => $themeUrl
						];

						return rest_ensure_response($data);
					},
					'permission_callback' => fn() => current_user_can('manage_options')
				],
				'permission_callback' => fn() => current_user_can('manage_options'),
			]
		);





	});

});



#
#
#
#
#
#
include('extensions/markdown-block-editor-extensions.php');
#
#
#


