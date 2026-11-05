const defaultConfig = require('@wordpress/scripts/config/webpack.config')
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
                    return {
                        ...rule,
                        exclude: /node_modules/,
                        use: {
                            loader: 'swc-loader',
                            options: {
                                jsc: {
                                    parser: {
                                        syntax: "typescript",
                                        tsx: true
                                    }
                                }
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
        'monaco-editor': 'undefined'
    },
    plugins:
    [
        // 型チェックプラグインがデフォルトにいる場合、開発速度優先で一旦除去するアプローチ
        ...defaultConfig.plugins
            .filter(p => p.constructor.name !== 'ForkTsCheckerWebpackPlugin')
            //.filter(p => !(p instanceof DependencyExtractionWebpackPlugin))
        ,
        
    ]
};
