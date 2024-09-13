import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/

const env = loadEnv('development', process.cwd(), '')

export default defineConfig({
  plugins: [react()],
  server: {
		host: env.APP_HOST || '0.0.0.0',
		port: env.APP_PORT || 3000,
	},
})
