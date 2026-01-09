require('dotenv').config({ path: '.env.production' });
const env = process.env;

module.exports = {
	apps: [
		{
			name: 'nyx',
			script: './build/index.js',
			env: {
				PORT: 4000,
				HOST: '0.0.0.0',
				NODE_ENV: 'production',

				ORIGIN: 'https://nyx.nguyentony.fr',

				...env
			}
		}
	]
};
