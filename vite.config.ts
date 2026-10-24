import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'lucide-react', 'canvas-confetti'],
      exclude: ['pdfjs-dist', 'pptxgenjs'],
    },
    build: {
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/pptxgenjs')) return 'pptxgen';
            if (id.includes('node_modules/pdfjs-dist')) return 'pdfjs';
            if (id.includes('node_modules/jspdf')) return 'jspdf';
            if (id.includes('node_modules/mammoth')) return 'mammoth';
            if (id.includes('node_modules/katex')) return 'katex';
            if (id.includes('node_modules/lucide-react')) return 'lucide-icons';
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor-react';
          },
        },
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
