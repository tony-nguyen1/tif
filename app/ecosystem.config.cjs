module.exports = {
	apps: [
		{
			script: 'build/index.js',
			env: {
				PORT: 3000,
				HOST: '0.0.0.0',
				NODE_ENV: 'production',

				ORIGIN: 'http://127.0.0.1:3000',

				DATABASE_URL: process.env.DATABASE_URL,
				DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN
			}
		}
	]
};
