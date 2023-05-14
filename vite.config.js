import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import {resolve} from "path";
import legacy from "@vitejs/plugin-legacy";
import viteImagemin from "vite-plugin-imagemin";
import history from "vite-plugin-history";
import requireTransform from "vite-plugin-require-transform";
import wasm from "vite-plugin-wasm";
import {nodePolyfills} from 'vite-plugin-node-polyfills'
import topLevelAwait from "vite-plugin-top-level-await";

require('dotenv').config()
// https://vitejs.dev/config/
export default ({mode}) => {
  const __DEV__ = mode === "development";

  return defineConfig({
    define: {
      'process.env': process.env
    },
    plugins: [wasm(), topLevelAwait(), requireTransform({}), react(__DEV__ ? {jsxRuntime: "classic"} : ""), legacy({
      targets: ["defaults", "not IE 11"],
    }), history({
      rewrites: [{
        from: /^\/$/, to: "./index.html",
      },],
    }), viteImagemin({
      gifsicle: {
        optimizationLevel: 7, interlaced: false,
      }, optipng: {
        optimizationLevel: 7,
      }, mozjpeg: {
        quality: 50,
      }, pngquant: {
        quality: [0.8, 0.9], speed: 4,
      }, svgo: {
        plugins: [{
          name: "removeViewBox",
        }, {
          name: "removeEmptyAttrs", active: false,
        },],
      },
    }),
      nodePolyfills({
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true,
      }),
    ], publicDir: "public", base: "./", assetsInclude: "", logLevel: "info", clearScreen: false, server: {
      host: "localhost", port: 8080, strictPort: false, base: "/", // https: true,
      open: "/", hmr: {
        overlay: false /* 为 false 可以禁用服务器错误遮罩层 */,
      },
      proxy: {
        "/api": {
          target: "https://ic0.app", changeOrigin: true,
        },
      },
    }, resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    }, css: {
      preprocessorOptions: {
        less: {},
      },
    }, //打包配置
    build: {
      // rollupOptions: {
      //     plugins: [inject({ Buffer: ["buffer", "Buffer"] })],
      // },
      target: "modules",
      outDir: "dist",
      assetsDir: "assets",
      assetsInlineLimit: 4096,
      cssCodeSplit: true,
      sourcemap: false,
      commonjsOptions: {
        include: /node_modules|libs/, defaultIsModuleExports: "auto", transformMixedEsModules: true,
      },
      manifest: false, // boolean | 'terser' | 'esbuild'
      minify: "terser", //terser
      write: true,
      emptyOutDir: true,
      brotliSize: true,
      chunkSizeWarningLimit: 500,
    },
  });
};

// export type VitePluginRequireTransformParamsType = {
// 	//filter files that should enter the plugin
// 	fileRegex?: RegExp = /.ts$|.tsx$/ ,
// 	//prefix that would plugin into the requireSpecifier
// 	importPrefix? = '_vite_plugin_require_transform_': string,
// 	//to deal with the requireSpecifier
// 	importPathHandler?: Function
// }
