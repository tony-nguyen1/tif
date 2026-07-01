import { defineConfig } from '@playwright/test';

const port = process.env.HOST_PORT!;
const origin = process.env.ORIGIN ?? `http://localhost:${port}`;

export default defineConfig({
	reporter: process.env.CI ? 'github' : 'list',
	use: {
		headless: true,
		viewport: { width: 1280, height: 720 },
		actionTimeout: 2000,
		baseURL: origin,
		launchOptions: {
			// slowMo: 3000
		}
	},
	// webServer: {
	// 	command: 'npm run preview:test',
	// 	reuseExistingServer: true,
	// 	timeout: 120 * 1000,
	// 	url: 'http://localhost:3004'
	// },
	testDir: 'e2e'
});
