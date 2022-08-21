import { createVitely } from '@vitely/core';
import { vitelyPlugin } from './vitely-vue.js';

export default vitelyPlugin;

async function main(root: string) {
	const vitely = await createVitely({
		root,
		plugins: [vitelyPlugin()],
	});
	await vitely.build();
}

void main(process.argv[2]);
