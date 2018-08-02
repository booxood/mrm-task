const { ini } = require('mrm-core');

function task(config) {
	// const { indent } = config.defaults({ indent: 'tab' }).values();

	const generalRules = Object.assign(
		{
			indent_style: 'space',
			indent_size: 2,
			end_of_line: 'lf',
			charset: 'utf-8',
			trim_trailing_whitespace: true,
			insert_final_newline: true,
		}
	);

	// .editorconfig
	const editorconfig = ini('.editorconfig', 'editorconfig.org');
	editorconfig.set('_global', { root: true }).set('*', generalRules);

	// Set/update Makefile section
	const makefileSection = editorconfig.get().find(section => /Makefile/.test(section));
	if (!makefileSection) {
		editorconfig.set('Makefile', {
			indent_style: 'tab',
			indent_size: 4,
		})
	}

	editorconfig.save();
}

task.description = 'Adds EditorConfig By @azm';
module.exports = task;
