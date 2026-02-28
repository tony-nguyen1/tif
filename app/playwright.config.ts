import { defineConfig } from '@playwright/test';

export default defineConfig({
	use: {
		headless: true,
		viewport: { width: 1280, height: 720 },
		actionTimeout: 2000,
		baseURL: 'http://localhost:4173',
		launchOptions: {
			// slowMo: 3000
		}
	},
	webServer: {
		command: 'npm run preview:test',
		reuseExistingServer: false,
		timeout: 120 * 1000,
		url: 'http://localhost:4173'
	},
	testDir: 'e2e'
});
