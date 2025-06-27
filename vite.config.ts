import { defineConfig } from 'vite'
import { cloudflare } from "@cloudflare/vite-plugin";
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react(), cloudflare()],
})
