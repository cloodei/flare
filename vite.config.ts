import { defineConfig } from 'vite'
import { cloudflare } from "@cloudflare/vite-plugin";
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), cloudflare(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
