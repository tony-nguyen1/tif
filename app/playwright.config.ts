import { defineConfig } from '@playwright/test';

export default defineConfig({
	use: {
		headless: true,
		viewport: { width: 1280, height: 720 },
		actionTimeout: 2000,
		baseURL: 'http://localhost:4173' // process.env.ORIGIN // Vite dev server URL
	},
	webServer: {
		command: 'npm run preview:test',
		reuseExistingServer: false,
		url: 'http://localhost:4173'
	},
	testDir: 'e2e'
});
