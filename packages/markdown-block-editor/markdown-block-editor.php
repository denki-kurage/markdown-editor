<?php
/**
 * Plugin Name:       MdTableEditor with Block Editor
 * Description:       This is an editor that allows you to edit tables in Markdown notation.
 * Version:           0.3.0
 * Requires at least: 6.8
 * Requires PHP:      8.0.30-dev
 * Author:            denkikurage
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       mdtableeditor
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}


add_action( 'init', fn() => register_block_type( __DIR__ . '/build/kurage' ) );

add_action( 'after_setup_theme', function(){
	add_theme_support('align-wide');
});




add_filter('markdownBlcokEditorFrontThemes', function($themes){
	$pluginPath = plugin_dir_url(__FILE__);
	$themes['none'] = ['なし', ''];
	$themes['default'] = ['デフォルト', $pluginPath . "front-themes/default.css"];
	return $themes;
});

add_filter('markdownBlcokEditorAdminThemes', function($themes){
	$pluginPath = plugin_dir_url(__FILE__);
	$themes['none'] = ['なし', ''];
	$themes['default'] = ['デフォルト', $pluginPath . "front-themes/default.css"];
	return $themes;
});


add_filter('markdownBlcokEditorPrismThemes', function($themes){
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

add_filter('markdownBlcokEditorMonacoEditorThemes', function($themes){
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
		'configurations' => new stdClass
	];
	$pluginPath = plugin_dir_url(__FILE__);

	$settings = get_option('markdown-block-editor-settings', $defaultOptions);

	$frontTheme = $settings['frontTheme'] ?? $defaultOptions['frontTheme'];
	$prismTheme = $settings['prismTheme'] ?? $defaultOptions['prismTheme'];

	$frontMap = apply_filters('markdownBlcokEditorFrontThemes', []);
	$adminMap = apply_filters('markdownBlcokEditorAdminThemes', []);

	$frontCss = $frontMap[$frontTheme] ?? ['', ''];
	$adminCss = $adminMap[$frontTheme] ?? ['', ''];

	add_action('wp_enqueue_scripts', function() use($frontCss, $pluginPath, $prismTheme){
		$frontCss = $frontCss[1] ?? '';
		if($frontCss)
		{
			wp_enqueue_style('md-table-editor-front-css', $frontCss);
		}
		wp_enqueue_style('md-table-editor-prism-theme', $pluginPath . "prismjs/{$prismTheme}/prism.css");
		wp_enqueue_script('md-table-editor-prism-theme', $pluginPath . "prismjs/{$prismTheme}/prism.js");
	});

	//add_action('admin_enqueue_scripts', function() use($adminCss, $pluginPath, $prismTheme){
		//wp_enqueue_style('md-table-editor-admin-css', $adminCss);
		//wp_enqueue_style('md-table-editor-prism-theme', $pluginPath . "prismjs/{$prismTheme}/prism.css");
		//wp_enqueue_script('md-table-editor-prism-theme', $pluginPath . "prismjs/{$prismTheme}/prism.js");
	//});
	
	add_action('rest_api_init', function() use($defaultOptions){

		register_rest_route(
			'markdown-block-editor/v1',
			'/settings',
			[
				[
					'methods' => WP_REST_Server::READABLE,
					'callback' => function(WP_REST_Request $request) use($defaultOptions)
					{
						$data = get_option('markdown-block-editor-settings', $defaultOptions);
						return rest_ensure_response($data);
					},
					'permission_callback' => fn() => current_user_can('manage_options')
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

						update_option('markdown-block-editor-settings', $data);
						return rest_ensure_response($data);
					},
					'permission_callback' => fn() => current_user_can('manage_options'),
					'args' => json_decode(file_get_contents('schema.json', true), true)['properties']
				]
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
						$frontThemes = apply_filters('markdownBlcokEditorFrontThemes', []);
						$adminThemes = apply_filters('markdownBlcokEditorAdminThemes', []);
						$prismThemes = apply_filters('markdownBlcokEditorPrismThemes', []);
						$monacoThemes = apply_filters('markdownBlcokEditorMonacoEditorThemes', []);
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
				]
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
//add_action('admin_enqueue_scripts', fn() => wp_enqueue_script('markdown-block-editor-extensions', plugin_dir_url(__FILE__) . 'extensions.js'));
#
#
#


