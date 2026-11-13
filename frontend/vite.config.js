import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const reactEsm = 'https://esm.sh/react@18.3.1';
const reactDomEsm = 'https://esm.sh/react-dom@18.3.1';
const rechartsEsm = 'https://esm.sh/recharts@2.15.4?external=react,react-dom';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^react\/jsx-dev-runtime$/, replacement: `${reactEsm}/jsx-dev-runtime` },
      { find: /^react\/jsx-runtime$/, replacement: `${reactEsm}/jsx-runtime` },
      { find: /^react-dom\/client$/, replacement: `${reactDomEsm}/client` },
      { find: /^react-dom$/, replacement: reactDomEsm },
      { find: /^react$/, replacement: reactEsm },
      { find: /^recharts$/, replacement: rechartsEsm },
    ],
  },
  optimizeDeps: {
    exclude: ['react', 'react-dom', 'recharts'],
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
});
