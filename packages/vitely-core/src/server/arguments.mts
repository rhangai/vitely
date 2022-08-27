import { relative } from 'node:path';

/**
 * Assert the client dir is passed as an argument
 * @param clientDir
 */
export function assertClientDir(clientDir: string) {
	if (!clientDir) {
		const serverPath = relative(process.cwd(), process.argv[1]);

		// eslint-disable-next-line no-console
		console.error(`
!!! ERROR STARTING SERVER !!!

You must pass the client directory as an argument. 

node ${serverPath} CLIENT_FOLDER
`);
		process.exit(1);
	}
}
