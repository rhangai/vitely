/* eslint-disable no-console */
import { statSync } from 'node:fs';
import { relative, join, dirname } from 'node:path';
import { default as parse } from 'minimist';

type ParsedArguments = {
	clientDir: string;
	port: number;
	host: string;
};

/**
 * Assert the client dir is passed as an argument
 */
export function parseArguments(argsParam: string[]): ParsedArguments {
	const args = parse(argsParam, {
		string: ['port', 'host'],
		boolean: ['help'],
	});

	// Help
	if (args.help) {
		printHelp();
		process.exit(1);
	}

	const clientDir = args._[0];
	assertClientDir(clientDir);

	return {
		clientDir,
		port: argInt(args.port, 3000),
		host: args.host || '0.0.0.0',
	};
}

/**
 * Convert the argument to an int
 */
function argInt(arg: string | undefined, defaultValue: number): number {
	if (!arg) return defaultValue;
	const value = parseInt(arg, 10);
	if (!Number.isFinite(value)) {
		printHelp(`Invalid number "${arg}"`);
		process.exit(1);
	}
	return value;
}

/**
 * Assert the client dir is passed as an argument
 * @param clientDir
 */
function assertClientDir(clientDir: string) {
	if (!clientDir) {
		printHelp('No client dir');
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
function printHelp(error?: string) {
	const serverPath = relative(process.cwd(), process.argv[1]);
	if (error) {
		console.error(`\n!!! ERROR STARTING SERVER: ${error} !!!\n`);
	}

	console.error(`
Usage:
    node ${serverPath} CLIENT_FOLDER [...options]

Options:
    --port <port>    The server post (Default: 3000)
    --host <host>    The server host (Default: localhost)
`);

	// Try to find the client path
	const possibleClientPath = join(dirname(serverPath), '../client');
	const stat = statSync(join(possibleClientPath, 'index.html'), {
		throwIfNoEntry: false,
	});
	if (stat && stat.isFile()) {
		console.error(`
Ex:
  node ${serverPath} ${possibleClientPath}
`);
	}
}
