#!/usr/bin/env node
import { resolve } from 'node:path';
import { createVitely } from '@vitely/core';
import vitelyVue from '@vitely/vue';

async function main(argv: string[]) {
	const command = argv[2];
	const root = argv[3];

	if (!['build', 'dev'].includes(command)) throw new Error(`Invalid command`);

	const vitely = await createVitely({
		root: resolve(root),
		ssr: false,
		plugins: [vitelyVue()],
	});

	if (command === 'dev') await vitely.startDevServer();
	else await vitely.build();
}

// Create the vitely plugin
void main(process.argv);
