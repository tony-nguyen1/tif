import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import fs from 'fs';
import path from 'path';
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig(({ command }) => {
	// command is "serve" during `npm run dev`
	// and "build" during `npm run build`
	const isDev = command === 'serve';

	let httpsConfig = undefined;

	if (isDev) {
		const keyPath = path.resolve('./localhost-key.pem');
		const certPath = path.resolve('./localhost.pem');

		// Load cert files only if present (to avoid errors)
		if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
			httpsConfig = {
				key: fs.readFileSync(keyPath),
				cert: fs.readFileSync(certPath)
			};
		} else {
			console.warn('[vite] HTTPS disabled: missing .pem files');
		}
	}

	return {
		plugins: [tailwindcss(), sveltekit(), devtoolsJson(), commonjs()],

		test: {
			expect: { requireAssertions: true },
			projects: [
				// {
				// 	extends: './vite.config.ts',
				// 	test: {
				// 		name: 'client',
				// 		environment: 'browser',
				// 		browser: {
				// 			enabled: true,
				// 			provider: 'playwright',
				// 			instances: [{ browser: 'chromium' }]
				// 		},
				// 		include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
				// 		exclude: ['src/lib/server/**'],
				// 		setupFiles: ['./vitest-setup-client.ts']
				// 	}
				// },
				{
					extends: './vite.config.ts',
					test: {
						name: 'server',
						environment: 'node',
						include: ['src/**/*.{test,spec}.{js,ts}'],
						exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
					}
				}
			]
		},

		server: {
			host: '0.0.0.0',
			https: httpsConfig // ← only active in dev
		}
	};
});
