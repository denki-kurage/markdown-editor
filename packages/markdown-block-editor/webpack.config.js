const defaultConfig = require('@wordpress/scripts/config/webpack.config')


const path = require('path');

defaultConfig.module.rules.push({
    test: /\.dscss$/,
    use: ['raw-loader', 'sass-loader']
})

module.exports = {
    ...defaultConfig,
    resolve: {
        ...defaultConfig.resolve,
        alias: {
            ...defaultConfig.resolve.alias,
            '@components': path.resolve(__dirname, 'src/components/'),
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },

};