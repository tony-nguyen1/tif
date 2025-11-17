module.exports = {
	apps: [
		{
			script: 'build/server/index.js',
			env: {
				PORT: 3000,
				HOST: '0.0.0.0',
				NODE_ENV: 'production'
			}
		}
	]
};
