/* eslint-disable no-console */
import { statSync } from 'node:fs';
import { relative, join, dirname } from 'node:path';

/**
 * Assert the client dir is passed as an argument
 * @param clientDir
 */
export function assertClientDir(clientDir: string) {
	if (!clientDir) {
		printHelp();
		process.exit(1);
	}

	const dirStat = statSync(clientDir, {
		throwIfNoEntry: false,
	});
	if (!dirStat || !dirStat.isDirectory()) {
		printHelp(`The directory "${clientDir}" does not exist`);
		process.exit(1);
	}

	const indexStat = statSync(join(clientDir, 'index.html'), {
		throwIfNoEntry: false,
	});
	if (!indexStat || !indexStat.isFile()) {
		printHelp(`The file index.html does not exist on "${clientDir}"`);
		process.exit(1);
	}
}

/**
 * Print help
 */
function printHelp(error: string = '') {
	const serverPath = relative(process.cwd(), process.argv[1]);
	const possibleClientPath = join(dirname(serverPath), '../client');
	const stat = statSync(join(possibleClientPath, 'index.html'), {
		throwIfNoEntry: false,
	});
	console.error(`\n!!! ERROR STARTING SERVER !!!`);
	if (error) console.error(`${error}`);
	console.error(`
You must pass the client directory as an argument. 
    node ${serverPath} CLIENT_FOLDER
`);

	if (stat && stat.isFile()) {
		console.error(`Ex:
    node ${serverPath} ${possibleClientPath}
`);
	}
}
