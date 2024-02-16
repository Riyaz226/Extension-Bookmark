const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')

module.exports = {
    mode: "development",
    devtool: 'cheap-module-source-map',
    entry: {
        bookmark: path.resolve('./src/ex-bookmark/index.tsx'),
        options: path.resolve('./src/options/options.tsx'),
        background: path.resolve('./src/background/background.ts'),
        contentScript: path.resolve('./src/contentScript/contentScript.ts'),
    },
    module: {
        rules: [
            {
                use: "ts-loader",
                test: /\.tsx$/,
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            ident: 'postcss',
                            plugins: [tailwindcss, autoprefixer]
                        }
                    }
                }],
                test: /\.css$/i,
            },
            {
                type: 'assets/resource',
                test: /\.(png|jpg|jpeg|gif|woff|woff2|tff|eot|svg)$/,
            },
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve('src/static')
                    , to: path.resolve('dist')
                }

            ],
        }),
        ...getHtmlPlugins([
            'bookmark',
            'options',
        ])

    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
      }
}

function getHtmlPlugins(chunks) {
    return chunks.map(chunk => new HtmlPlugin({
        title: 'React Extension',
        filename: `${chunk}.html`,
        chunks: [chunk]
    }))
}