import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
// @ts-ignore
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [preact(), tailwindcss()],
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxImportSource: 'preact'
  },
  server: {
    port: 3000
  }
})