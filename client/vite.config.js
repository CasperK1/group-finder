import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dotenv from 'dotenv';
// https://vitejs.dev/config/

dotenv.config();


export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  define: {
    'process.env': process.env, 
  },
})
