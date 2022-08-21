import { createApp } from '../ssr/index.js';

async function main() {
	const { app } = await createApp();
	app.mount('#app');
}

void main();
