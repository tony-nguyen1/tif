import { defineConfig } from 'drizzle-kit';

console.info('drizzle.config.ts');
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
console.info(`[drizzle.config.ts] ${process.env.DATABASE_URL}`);

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'turso',
	dbCredentials: {
		authToken: process.env.DATABASE_AUTH_TOKEN,
		url: process.env.DATABASE_URL
	},
	verbose: true,
	strict: true
});
