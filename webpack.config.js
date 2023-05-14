const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const dfxJson = require("./dfx.json");
const cid = require("./canister_ids.json")


// List of all aliases for canisters. This creates the module alias for
// the `import ... from "@dfinity/ic/canisters/xyz"` where xyz is the name of a
// canister.
const aliases = Object.entries(dfxJson.canisters).reduce(
  (acc, [name, _value]) => {
    // Get the network name, or `local` by default.
    const networkName = process.env["DFX_NETWORK"] || "local";
    const outputRoot = path.join(
      __dirname,
      ".dfx",
      networkName,
      "canisters",
      name
    );

    return {
      ...acc,
      ["dfx-generated/" + name]: path.join(outputRoot, name + ".js"),
    };
  },
  {}
);

/**
 * Generate a webpack configuration for a canister.
 */
function generateWebpackConfigForCanister(name, info) {
  if (typeof info.frontend !== "object") {
    return;
  }

  const isProduction = process.env.NODE_ENV === "production";
  const devtool = isProduction ? undefined : "source-map";

  return {
    mode: isProduction ? "production" : "development",
    entry: {
      // The public.entrypoint points to the HTML file for this build, so we need
      // to replace the extension to `.js`.
      index: path
      .join(__dirname, info.frontend.entrypoint)
      .replace(/\.html$/, ".tsx"),
    },
    devtool,
    optimization: {
      minimize: isProduction,
    },
    resolve: {
      alias: {
        "@": path.resolve("src"),
        "@Basic": path.resolve("src/components/Basic"),
        "@components": path.resolve("src/components"),
        ...aliases,
      },
      extensions: [".js", ".ts", ".jsx", ".tsx"],
      fallback: {
        assert: require.resolve("assert/"),
        buffer: require.resolve("buffer/"),
        events: require.resolve("events/"),
        stream: require.resolve("stream-browserify/"),
        util: require.resolve("util/"),
        zlib: require.resolve("browserify-zlib"),
        crypto: require.resolve("crypto-browserify"),
        path: require.resolve("path-browserify")
      },
    },
    output: {
      filename: "[name].js",
      path: path.join(__dirname, "dist"),
    },
    devServer: {
      historyApiFallback: true,
      port: 3001,
      proxy: {
        "/api": {
          target: "https://ic0.app",
          // target: "http://localhost:8004/",
          changeOrigin: true,
          pathRewrite: {
            "^/api": "/api",
          },
        },
      },
      allowedHosts: [".localhost", ".local", ".ngrok.io"],
      hot: true,
      contentBase: path.resolve(__dirname, "./src"),
      watchContentBase: true,
    },

    // Depending in the language or framework you are using for
    // front-end development, add module loaders to the default
    // webpack configuration. For example, if you are using React
    // modules and CSS as described in the "Adding a stylesheet"
    // tutorial, uncomment the following lines:
    module: {
      rules: [
        {test: /\.(ts|tsx|jsx)$/, loader: "ts-loader"},
        {
          test: /\.(css|less)$/,
          use: ["style-loader", "css-loader", "less-loader"],
        },
        {test: /\.svg$/, loader: "file-loader"},
        {test: /\.ttf$/, loader: "file-loader"},
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, info.frontend.entrypoint),
        filename: "index.html",
        chunks: ["index"],
      }),
      new webpack.ProvidePlugin({
        Buffer: [require.resolve("buffer/"), "Buffer"],
        process: require.resolve("process/browser"),
        path: require.resolve("path"),
      }),
      new webpack.EnvironmentPlugin({...env}),
      new CopyPlugin({
        patterns: [
          {
            from: path.join(__dirname, "public"),
            to: path.join(__dirname, "dist"),
          },
        ],
      }),
    ],
  };
}

const env = {
  NODE_ENV: "production",
  ETH_ADDRESS: "0xC1DaEf5E13401a56cf818b389cF44932Eb031cBa",
  ENDPOINT: cid.frontend.ic === "37s5e-paaaa-aaaao-afmca-cai" ? "https://testnet.metabox.rocks" : "https://api.metabox.rocks"
}


// If you have additional webpack configurations you want to build
//  as part of this configuration, add theme to the section below.
module.exports = [
  ...Object.entries(dfxJson.canisters)
  .map(([name, info]) => {
    return generateWebpackConfigForCanister(name, info);
  })
  .filter((x) => !!x),
];
