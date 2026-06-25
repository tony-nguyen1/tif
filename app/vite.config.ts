import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { sveltekit } from '@sveltejs/kit/vite';
import fs from 'fs';
import path from 'path';
import { loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
	// command is "serve" during `npm run dev` or npm run preview
	// and "build" during `npm run build`
	const isDev = command === 'serve';
	const env = loadEnv(mode, process.cwd(), ''); // prefix filter optional
	// console.log('Loaded env:', env);

	let httpsConfig = undefined;

	if (isDev) {
		const keyPath = path.resolve('./localhost-key.pem');
		const certPath = path.resolve('./localhost.pem');

		// Load cert files only if present or if not in e2e test
		if (env.APP_ENV !== 'test' && fs.existsSync(keyPath) && fs.existsSync(certPath)) {
			httpsConfig = {
				key: fs.readFileSync(keyPath),
				cert: fs.readFileSync(certPath)
			};
		} else {
			console.warn('[vite] HTTPS disabled: missing .pem files');
		}
	}

	return {
		plugins: [tailwindcss(), sveltekit()],

		test: {
			expect: { requireAssertions: true },
			environment: 'jsdom',
			include: ['src/**/*.{test,spec}.{js,ts}'],
			// https://vitest.dev/guide/browser/
			browser: {
				provider: playwright(),
				enabled: true,
				// at least one instance is required
				instances: [{ browser: 'chromium' }]
			}
		},

		server: {
			host: '0.0.0.0',
			https: httpsConfig // ← only active in dev
		},

		// Tell Vitest to use the `browser` entry points in `package.json` files, even though it's running in Node
		resolve: process.env.VITEST
			? {
					conditions: ['browser']
				}
			: undefined
	};
});
