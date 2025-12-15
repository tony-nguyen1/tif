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
		reuseExistingServer: true,
		timeout: 30000,
		url: 'http://localhost:4173'
		// wait: {
		// 	// stdout: '/Listening on port (?<my_server_port>\\d+)/'
		// }
	},
	testDir: 'e2e'
});
