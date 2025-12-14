import { defineConfig } from '@playwright/test';

export default defineConfig({
	use: {
		headless: true,
		viewport: { width: 1280, height: 720 },
		actionTimeout: 30000,
		baseURL: 'https://localhost:4173' // Vite dev server URL
	},
	webServer: {
		command: 'npm run preview:test',
		reuseExistingServer: true,
		port: 4173
	},
	testDir: 'e2e'
});
