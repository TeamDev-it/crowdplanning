import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'

import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { resolve } from 'path';

const moduleName = "crowdplanning";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    hmr: false
  },
  plugins: [
    createVuePlugin(),
    cssInjectedByJsPlugin()
  ],
  define: {
    "DEVELOPMENT": mode == "development",
    "PRODUCTION": mode == "production"
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  build: {
    minify: mode == "production",
    // sourcemap: mode=="development",
    emptyOutDir: true,
    outDir: resolve(__dirname, mode == "development" ? "../../main/public/modules/" + moduleName : "dist"),
    rollupOptions: {
      external: ["vue"],
      output: {
        chunkFileNames: "chunks/[name]-[hash].min.js",
        globals: {
          qs: 'qs',
          vue: 'vue'
        }
      }
    },
    lib: {
      entry: "./src/libMain.ts",
      fileName: moduleName,
      name: moduleName,
      formats: ['umd', 'es']
    },

  }
}))
