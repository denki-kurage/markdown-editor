const defaultConfig = require('@wordpress/scripts/config/webpack.config')


const path = require('path');


module.exports = {
    ...defaultConfig,
    module:
    {
        ...defaultConfig.module,
        rules: [
            {
                test: /editor\.main\.xcss$/i,
                type: 'asset/source'
            },
            ...defaultConfig.module.rules
        ]
    },
    resolve: {
        ...defaultConfig.resolve,
        alias: {
            ...defaultConfig.resolve.alias,
            '@components': path.resolve(__dirname, 'src/components/'),
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
};