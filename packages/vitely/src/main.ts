#!/usr/bin/env node
import { createVitely } from '@vitely/core';

async function main(argv: string[]) {
	const vitely = await createVitely({
		root,
		plugins: [],
	});
	await vitely.build();
}

// Create the vitely plugin
void main(process.argv);
