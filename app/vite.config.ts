import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import fs from 'fs';
import path from 'path';
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig({
	// ssr: {
	// 	external: ['@libsql/linux-x64-gnu']
	// },
	// ssr: {
	// 	// Don't bundle this, let Node require it at runtime
	// 	noExternal: ['@libsql/linux-x64-gnu']
	// },
	plugins: [
		tailwindcss(),
		sveltekit(),
		devtoolsJson(),
		commonjs({
			// ignoreDynamicRequires: true
			// dynamicRequireTargets: ['@libsql/linux-x64-gnu']
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					environment: 'browser',
					browser: {
						enabled: true,
						provider: 'playwright',
						instances: [{ browser: 'chromium' }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts']
				}
			},
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
		https: {
			key: fs.readFileSync(path.resolve('./localhost-key.pem')),
			cert: fs.readFileSync(path.resolve('./localhost.pem'))
		}
	}
});
