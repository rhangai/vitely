#!/usr/bin/env node
import { vitelyBuild, vitelyDevServer } from '@vitely/core';

async function main(argv: string[]) {
	const command = argv[2];
	const root = argv[3];

	if (!['build', 'dev'].includes(command)) throw new Error(`Invalid command`);
	if (command === 'build')
		await vitelyBuild({
			root,
		});
	else
		await vitelyDevServer({
			root,
		});
}

// Create the vitely plugin
void main(process.argv);
