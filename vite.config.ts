import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // SUPABASE_* vars are public by design (anon key + RLS) and are inlined
  // for the browser client, same as VITE_* vars.
  envPrefix: ['VITE_', 'SUPABASE_'],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
