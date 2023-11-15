import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { resolve } from 'path';

var isDevelopment = process.env.NODE_ENV?.toString().trim() == 'development';

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    hmr:false
  },
  plugins: [
    cssInjectedByJsPlugin(),
    createVuePlugin(),
    NodeGlobalsPolyfillPlugin({
      define: {
        "process.env": process.env
      }
    }),
  ],
  define: {
    "DEVELOPMENT": isDevelopment,
    "PRODUCTION": !isDevelopment
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  build: {
    minify: !isDevelopment,
    sourcemap: isDevelopment,
    emptyOutDir: true,
    outDir: resolve(__dirname, isDevelopment ? "../../main/public/modules/crowdplanning" : "dist"),
    rollupOptions: {
      external: ["vue"],
      output: {
        manualChunks: undefined,
        chunkFileNames: "chunks/[name]-[hash].min.js",
        globals: {
          qs: 'qs',
          vue: 'vue'
        }
      }
    },
    lib: {
      entry: "./src/libMain.ts",
      fileName: "crowdplanning",
      name: "crowdplanning",
      formats: ['umd']
    },
  }
})
