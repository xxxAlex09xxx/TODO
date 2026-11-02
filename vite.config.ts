import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // 👈 1. Импортируем path для алиасов

export default defineConfig({
  plugins: [react()],
  
  // 👈 2. Добавляем алиасы
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    host: '0.0.0.0',
    port: 5173, // 👈 Твой любимый порт
    // ПРОКСИ НЕ НУЖЕН - используем Express сервер (оставляем как было)
  },

  build: {
    outDir: 'dist'
  }
});