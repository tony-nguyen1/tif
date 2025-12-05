// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
// import storybook from 'eslint-plugin-storybook';

import prettier from 'eslint-config-prettier';
import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		rules: {
			// typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
			// see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			'no-undef': 'off'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	},
	{
		// dotenv is required inside ecosystem.config.cjs common js and not ESM
		// cjs is outdatted syntax, so it raises a warning from the linter
		// however, .cjs works flawlessly with pm2, used for deploy so i
		// stick with it
		files: ['**/*.cjs'],
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
			'no-restricted-imports': 'off'
		}
	},
	{
		// svelte require a explicit route for links
		// components use an anchor tag with a link <a href>
		// but have an arg and not a clear path at comptime
		// restricting the type of the link inside component
		// could be possible but TDB, FIXME
		files: ['**/lib/components/**/*.svelte'],
		rules: {
			'svelte/no-navigation-without-resolve': 'off'
		}
	}
);
