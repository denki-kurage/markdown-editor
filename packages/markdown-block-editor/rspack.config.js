const defaultConfig = require('@wordpress/scripts/config/webpack.config')
const CopyWebpackPlugin = require('copy-webpack-plugin')


const path = require('path');

const { rspack } = require('@rspack/core');

console.log(defaultConfig.plugins)
console.log(defaultConfig.plugins)

module.exports = {
    ...defaultConfig,
    cache: {
        ...defaultConfig.cache,
        type: "filesystem"
    },
    module:
    {
        ...defaultConfig.module,
        rules: [
            {
                test: /editor\.main\.xcss$/i,
                type: 'asset/source'
            },
            ...defaultConfig.module.rules.map((rule) => {
                // デフォルトの babel-loader を swc-loader に差し替える
                if (rule.test && rule.test.toString().includes('(j|t)sx')) {
                    console.log(">>>>>>>>>>>>>>>>9>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
                    console.log(rule)
                    console.log(defaultConfig.module.rules)
                    return {
                        ...rule,
                        use: {
                            loader: 'swc-loader',
                            options: {
                                cacheDirectory: true
                            }
                        },
                        //exclude: /node_modules\/(?!monaco-editor\/)/,
                    };
                }

                                // CSSローダーの設定を差し替え
                if (rule.use) {
                    rule.use = rule.use.map((use) => {
                        if (
                            typeof use === 'object' &&
                            use.loader &&
                            use.loader.includes('mini-css-extract-plugin')
                        ) {
                            return { loader: rspack.CssExtractRspackPlugin.loader };
                        }
                        return use;
                    });
                }

                return rule;
            }),


        ]
    },

      // チャンク分割を無効にする設定
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,
      },
    },
  },
    resolve: {
        ...defaultConfig.resolve,
        alias: {
            ...defaultConfig.resolve.alias,
            '@components': path.resolve(__dirname, 'src/components/'),
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },

    externals:
    {
        //'monaco-editor': 'monaco'
    },
    plugins:
    [
 ...defaultConfig.plugins.filter((plugin) => !['MiniCssExtractPlugin', 'DefinePlugin'].includes(plugin.constructor.name)),
 new rspack.DefinePlugin({
      'process.env.MY_VAR': JSON.stringify('hello')}),
 new rspack.CssExtractRspackPlugin(
    {
            filename: '[name].css'// 必要に応じてパス調整
        }
    )
    ]
    
/*
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'node_modules/monaco-editor/min/vs/',
                    to: 'vs'
                }
            ]
        })
        */

};