const path = require('path');

module.exports = {
    // The entry point for our application, where Webpack starts bundling.
    entry: './App.jsx',

    // The output settings for the bundled file.
    output: {
        // The directory where the bundled files will be saved.
        path: path.resolve(__dirname, 'dist'),
        // The name of the bundled JavaScript file.
        filename: 'bundle.js',
        // Public path for the output directory.
        publicPath: '/',
    },

    // Configuration for the development server.
    devServer: {
        // The content base directory for the server.
        static: {
            directory: path.join(__dirname, 'dist'),
            publicPath: '/',
        },
        // The port for the development server.
        port: 3000,
        // Enable hot module replacement.
        hot: true,
        // Fallback to index.html for single-page applications.
        historyApiFallback: true,
    },

    // Module rules to handle different file types.
    module: {
        rules: [
            {
                // A regular expression to match .js or .jsx files.
                test: /\.(js|jsx)$/,
                // Exclude the node_modules directory.
                exclude: /node_modules/,
                // The loader to use for these files.
                use: {
                    loader: 'babel-loader',
                    options: {
                        // Presets for Babel to transpile React JSX and modern JavaScript.
                        presets: ['@babel/preset-react', '@babel/preset-env'],
                    },
                },
            },
        ],
    },

    // Resolve extensions to allow importing files without specifying the extension.
    resolve: {
        extensions: ['.js', '.jsx'],
    },
};
