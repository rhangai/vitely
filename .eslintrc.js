module.exports = {
	root: true,
	extends: ['@rhangai/typescript'],
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: './tsconfig.json',
	},
	rules: {
		'import/no-named-default': 'off',
	},
};
