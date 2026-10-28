const defaultConfig = require('@wordpress/scripts/config/webpack.config')
const CopyWebpackPlugin = require('copy-webpack-plugin')


const path = require('path');


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
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
                    console.log(rule)
                    console.log(defaultConfig.module.rules)
                    return {
                        ...rule,
                        exclude: /node_modules\/(?!(monaco-editor)\/).*/,
                        use: {
                            loader: 'swc-loader',
                            options: {
                                cacheDirectory: true
                            }
                        },
                        //exclude: /node_modules\/(?!monaco-editor\/)/,
                    };
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
        ...defaultConfig.plugins,
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
    ]
};
