const { json, packageJson, lines, install, uninstall, getExtsFromCommand } = require('mrm-core');

function task(config) {
	let exts = '';
	const ignores = ['node_modules/'];
	const gitIgnores = ['.eslintcache'];
	const packages = [
		'eslint',
		'eslint-config-standard',
		'eslint-plugin-standard',
		'eslint-plugin-promise',
		'eslint-plugin-import',
		'eslint-plugin-node'
	];
	const oldPackages = ['jslint', 'jshint'];
	const { eslintPreset, eslintPeerDependencies, eslintObsoleteDependencies, eslintRules, eslintEnv } = config
		.defaults({
			eslintPreset: 'standard',
			eslintPeerDependencies: [],
			eslintObsoleteDependencies: [],
			eslintRules: {},
			eslintEnv: {
				es6: true,
				node: true,
			}
		})
		.values();

	// Preset
	if (eslintPreset !== 'standard') {
		packages.push(`eslint-config-${eslintPreset}`);
	}

	// Peer dependencies
	packages.push(...eslintPeerDependencies);

	// .eslintrc
	const eslintrc = json('.eslintrc');
	if (!eslintrc.get('extends', '').startsWith(eslintPreset)) {
		eslintrc.set('extends', eslintPreset);
	}
	if (eslintEnv) {
		eslintrc.merge({ env: eslintEnv });
	}
	if (eslintRules) {
		eslintrc.merge({ rules: eslintRules });
	}

	const pkg = packageJson();

	// TODO: Babel
	// Not sure how to detect that we need it, checking for babel-core is not enough because
	// babel-eslint is only needed for experimental features and Flow (this one is easy to test)
	// Flow also needs this: https://github.com/gajus/eslint-plugin-flowtype
	// if (pkg.get('devDependencies.babel-core')) {
	// 	packages.push('babel-eslint');
	// 	eslintrc.set('parser', 'babel-eslint');
	// }

	// TypeScript
	if (pkg.get('devDependencies.typescript')) {
		const parser = 'typescript-eslint-parser';
		packages.push(parser);
		eslintrc.merge({
			parser,
			rules: eslintRules || {
				// Disable rules not supported by TypeScript parser
				// https://github.com/eslint/typescript-eslint-parser#known-issues
				'no-undef': 0,
				'no-unused-vars': 0,
				'no-useless-constructor': 0,
			},
		});
		exts = ' --ext .ts,.tsx';
	}

	eslintrc.save();

	// .eslintignore
	lines('.eslintignore')
		.add(ignores)
		.save();

	// .gitignore
	lines('.gitignore')
		.add(gitIgnores)
		.save();

	// Keep custom extensions
	const lintScript = pkg.getScript('lint', 'eslint') || pkg.getScript('test', 'eslint');
	if (lintScript) {
		const lintExts = getExtsFromCommand(lintScript);
		if (lintExts && lintExts.toString() !== 'js') {
			const extsPattern = lintExts.map(x => `.${x}`).join(',');
			exts = ` --ext ${extsPattern}`;
		}
	}

	pkg
		// Remove existing JS linters
		.removeScript(/^(lint:js|eslint|jshint|jslint)$/)
		.removeScript('test', / (lint|lint:js|eslint|jshint|jslint)( |$)/) // npm run jest && npm run lint
		.removeScript('test', /\beslint|jshint|jslint\b/) // jest && eslint
		// Add lint script
		.setScript('lint', 'eslint . --cache --fix' + exts)
		// Add pretest script
		.prependScript('pretest', 'npm run lint')
		.save();

	// Dependencies
	uninstall([...oldPackages, ...eslintObsoleteDependencies]);
	install(packages);
}

task.description = 'Adds ESLint By @azm';
module.exports = task;