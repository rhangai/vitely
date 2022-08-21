import { createApp } from '../ssr/index.js';

async function main() {
	const { app, router } = await createApp();
	await router.isReady();
	app.mount('#app');
}

void main();
