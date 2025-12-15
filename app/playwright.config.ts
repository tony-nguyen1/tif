import { defineConfig } from '@playwright/test';

export default defineConfig({
	use: {
		headless: true,
		viewport: { width: 1280, height: 720 },
		actionTimeout: 30000,
		baseURL: 'http://localhost:4173' // process.env.ORIGIN // Vite dev server URL
	},
	webServer: {
		command: 'npm run preview:test',
		reuseExistingServer: false,
		port: 4173,
		timeout: 2000
	},
	testDir: 'e2e'
});
