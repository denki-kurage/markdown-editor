<?php
/**
 * Plugin Name:       Markdown with Block Editor
 * Description:       You can edit markdown in a VSCode-like editor on the block editor.
 * Version:           0.1.1
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

add_action(
	'init',
	function () {
		$pdir = plugin_dir_path( __FILE__ );

		$x = register_block_type( __DIR__ . '/build/kurage' );

		$handle = generate_block_asset_handle( 'denkikurage/markdown-block-editor', 'editorScript' );

		wp_set_script_translations(
			$handle,
			'markdown-block-editor',
			$pdir . 'languages'
		);
	}
);

add_action(
	'after_setup_theme',
	function () {
		add_theme_support( 'align-wide' );
	}
);


add_filter(
	'markdown_block_editor_front_themes',
	function ( $themes ) {
		$p                 = plugin_dir_url( __FILE__ );
		$themes['none']    = [ 'なし', '' ];
		$themes['default'] = [ 'デフォルト', $p . 'front-themes/default.css' ];
		return $themes;
	}
);

add_filter(
	'markdown_block_editor_admin_themes',
	function ( $themes ) {
		$p                 = plugin_dir_url( __FILE__ );
		$themes['none']    = [ 'なし', '' ];
		$themes['default'] = [ 'デフォルト', $p . 'front-themes/default.css' ];
		return $themes;
	}
);

add_filter(
	'markdown_block_editor_prism_themes',
	function ( $themes ) {
		$p                   = plugin_dir_url( __FILE__ );
		$themes['coy']       = [ 'Coy', $p . 'prismjs/coy/prism' ];
		$themes['dark']      = [ 'Dark', $p . 'prismjs/dark/prism' ];
		$themes['default']   = [ 'Default', $p . 'prismjs/default/prism' ];
		$themes['funkey']    = [ 'Funkey', $p . 'prismjs/funkey/prism' ];
		$themes['okaidia']   = [ 'Okaidia', $p . 'prismjs/okaidia/prism' ];
		$themes['solarized'] = [ 'Solarized', $p . 'prismjs/solarized/prism' ];
		$themes['tommorow']  = [ 'Tommorow', $p . 'prismjs/tommorow/prism' ];
		$themes['twilight']  = [ 'Twilight', $p . 'prismjs/twilight/prism' ];
		return $themes;
	}
);

add_filter(
	'markdown_block_editor_monaco_themes',
	function ( $themes ) {
		$themes['vs']       = 'VS Light';
		$themes['vs-dark']  = 'VS Dark';
		$themes['hc-black'] = 'High Contrast Black';
		$themes['hc-light'] = 'High Contrast Light';
		return $themes;
	}
);






add_action(
	'init',
	function () {

		$op = [
			'fontSize'        => 12,
			'fontFamily'      => '',
			'prismTheme'      => 'tommorow',
			'monacoTheme'     => 'vs-dark',
			'frontTheme'      => 'default',
			'adminTheme'      => 'default',
			'previewInterval' => 1000,
			'configurations'  => new stdClass(),
		];

		$p = plugin_dir_url( __FILE__ );

		$settings = get_option( 'markdown_block_editor_settings', $op );

		$front = $settings['frontTheme'] ?? $op['frontTheme'];
		$prism = $settings['prismTheme'] ?? $op['prismTheme'];

		$fmap = apply_filters( 'markdown_block_editor_front_themes', [] );
		$amap = apply_filters( 'markdown_block_editor_admin_themes', [] );

		$front_css = $fmap[ $front ] ?? [ '', '' ];
		$admin_css = $amap[ $front ] ?? [ '', '' ];

		add_action(
			'wp_enqueue_scripts',
			function () use ( $front_css, $p, $prism ) {
				$front_css = $front_css[1] ?? '';
				if ( $front_css ) {
					wp_enqueue_style( 'markdown_block_editor_front_css', $front_css, [], 1 );
				}
				wp_enqueue_style( 'markdown_block_editor_prism_theme', $p . "prismjs/{$prism}/prism.css", []);
				wp_enqueue_script( 'markdown_block_editor_prism_theme', $p . "prismjs/{$prism}/prism.js", []);
			}
		);

		/**
		 * Nonce check for REST API
		 */
		function markdown_block_editor_check_nonce() {
			$nonce1 = isset( $_REQUEST['_wpnonce'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['_wpnonce'] ) ) : null;
			$nonce2 = isset( $_SERVER['HTTP_X_WP_NONCE'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_X_WP_NONCE'] ) ) : null;
			$nonce  = $nonce1 ?? $nonce2 ?? '';

			if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
				return new WP_Error( 'rest_cookie_invalid_nonce', 'nonce error!', [ 'status' => 403 ] );
			}

			return true;
		}

		add_action(
			'rest_api_init',
			function () use ( $op ) {

				register_rest_route(
					'markdown-block-editor/v1',
					'/settings',
					[
						[
							'methods'             => WP_REST_Server::READABLE,
							'permission_callback' => fn() => current_user_can( 'manage_options' ),
							'callback'            => function () use ( $op ) {
								$data = get_option( 'markdown_block_editor_settings', $op );
								return rest_ensure_response( $data );
							},
						],
						[
							'methods'             => WP_REST_Server::CREATABLE,
							'permission_callback' => fn() => current_user_can( 'manage_options' ),
							'validate_callback'   => fn() => markdown_block_editor_check_nonce(),
							'args'                => json_decode( file_get_contents( 'schema.json', true ), true )['properties'],
							'callback'            => function ( WP_REST_Request $request ) use ( $op ) {
								$data = [];
								foreach ( $op as $k => $v ) {
									$data[ $k ] = $request->get_param( $k ) ?? $v;
								}

								update_option( 'markdown_block_editor_settings', $data );
								return rest_ensure_response( $data );
							},
						],
						'permission_callback' => fn() => current_user_can( 'manage_options' ),
					]
				);

				register_rest_route(
					'markdown-block-editor/v1',
					'/setting-options',
					[
						[
							'methods'             => WP_REST_Server::READABLE,
							'permission_callback' => fn() => current_user_can( 'manage_options' ),
							'callback'            => function () use ( $op ) {
								$front_themes  = apply_filters( 'markdown_block_editor_front_themes', [] );
								$admin_themes  = apply_filters( 'markdown_block_editor_admin_themes', [] );
								$prism_themes  = apply_filters( 'markdown_block_editor_prism_themes', [] );
								$monaco_themes = apply_filters( 'markdown_block_editor_monaco_themes', [] );

								$theme_url     = get_template_directory_uri();
								$front_themes  = array_map( fn( $v, $k )  => [ 'key' => $k, 'name' => $v[0], 'url' => $v[1] ], $front_themes, array_keys( $front_themes ) );
								$admin_themes  = array_map( fn( $v, $k )  => [ 'key' => $k, 'name' => $v[0], 'url' => $v[1] ], $admin_themes, array_keys( $admin_themes ) );
								$prism_themes  = array_map( fn( $v, $k )  => [ 'key' => $k, 'name' => $v[0], 'url' => $v[1] ], $prism_themes, array_keys( $prism_themes ) );
								$monaco_themes = array_map( fn( $v, $k ) => [ 'key' => $k, 'name' => $v ], $monaco_themes, array_keys( $monaco_themes ) );
								$data          = [
									'frontThemes'  => $front_themes,
									'adminThemes'  => $admin_themes,
									'prismThemes'  => $prism_themes,
									'monacoThemes' => $monaco_themes,
									'themeUrl'     => get_template_directory_uri(),
								];

								return rest_ensure_response( $data );
							},
						],
						'permission_callback' => fn() => current_user_can( 'manage_options' ),
					]
				);
			}
		);
	}
);
