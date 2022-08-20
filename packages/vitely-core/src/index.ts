import { VitelyCore } from './core';
import { VitelyCoreOptions } from './options';

/**
 * Create a new vitely core
 */
export async function createVitely(
	options: VitelyCoreOptions
): Promise<VitelyCore> {
	return new VitelyCore(options);
}

async function main() {
	const vitely = await createVitely({});
	await vitely.startDevServer();
}

void main();
