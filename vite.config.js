import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'

import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { resolve } from 'path';

var isDevelopment = process.env.NODE_ENV?.toString().trim() == 'development';
const moduleName = "crowdplanning";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    hmr: false
  },
  plugins: [
    createVuePlugin(),
    cssInjectedByJsPlugin()
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
    // sourcemap: isDevelopment,
    emptyOutDir: true,
    outDir: resolve(__dirname, isDevelopment ? "../../main/public/modules/" + moduleName : "dist"),
    rollupOptions: {
      external: ["vue", "vuex"],
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
})
