import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Charge les variables du fichier .env
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'https://api.football-data.org/v4',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          headers: {
            // Le serveur Vite injecte la clé automatiquement à chaque appel
            'X-Auth-Token': env.VITE_API_KEY || '',
          },
        },
      },
    },
  }
})